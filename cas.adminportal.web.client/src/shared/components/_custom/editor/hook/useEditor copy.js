// useEditorJs.js
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import debounce from "lodash.debounce";

const INSTANCES = new Map();

const loadEditorCore = async () => (await import("@editorjs/editorjs")).default;
const loadHeader = async () => (await import("@editorjs/header")).default;
const loadList = async () => (await import("@editorjs/list")).default;
const loadChecklist = async () => (await import("@editorjs/checklist")).default;
const loadTable = async () => (await import("@editorjs/table")).default;
const loadQuote = async () => (await import("@editorjs/quote")).default;
const loadCode = async () => (await import("@editorjs/code")).default;
const loadInlineCode = async () =>
  (await import("@editorjs/inline-code")).default;
const loadDelimiter = async () => (await import("@editorjs/delimiter")).default;
const loadEmbed = async () => (await import("@editorjs/embed")).default;
const loadLinkTool = async () => (await import("@editorjs/link")).default;
const loadImageTool = async () => (await import("@editorjs/image")).default;
const loadParagraph = async () => (await import("@editorjs/paragraph")).default;

export const DEFAULT_INITIAL_EDITOR = {
  time: Date.now(),
  blocks: [
    {
      id: "hdr_welcome",
      type: "header",
      data: { text: "New Page", level: 2 },
    },
    {
      id: "p_welcome",
      type: "paragraph",
      data: { text: "Start writing here…" },
    },
  ],
  version: "2.30.10",
};

// Global registry shared across HMR/StrictMode cycles
const getReg = () => {
  if (typeof window === "undefined") return null;
  if (!window.__EJS_REG__) {
    window.__EJS_REG__ = {
      byEl: new WeakMap(),
      byId: new Map(),
      creating: new Map(),
      holders: new Set(),
    };
  }
  return window.__EJS_REG__;
};

function hardCleanHolder(el) {
  if (!el) return;
  el.querySelectorAll(".codex-editor").forEach((n) => n.remove());
  el.innerHTML = "";
}

export default function useEditorJs(opts = {}) {
  const {
    docKey, // <- NEW: unique per doc/page
    holderId,
    value = DEFAULT_INITIAL_EDITOR,
    readOnly,
    placeholder = "Write something…",
    linkToolEndpoint = "/api/link",
    imageUploadEndpoint = "/api/upload",
    imageAdditionalHeaders,
    onChange,
    tools, // allow overriding tools from parent
  } = opts;

  const holderRef = useRef(null);
  const editorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Guards for StrictMode async races
  const generationRef = useRef(0);
  const mountedRef = useRef(false);

  // NEW: suppress onChange during programmatic render/reset
  const programmaticRef = useRef(false);

  const internalHolderId = useMemo(
    () => holderId ?? `editorjs_${Math.random().toString(36).slice(2)}`,
    [holderId]
  );

  // keep latest props in refs (avoid stale closures)
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const readOnlyRef = useRef(!!readOnly);
  useEffect(() => {
    readOnlyRef.current = !!readOnly;
  }, [readOnly]);

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const linkRef = useRef(linkToolEndpoint);
  useEffect(() => {
    linkRef.current = linkToolEndpoint;
  }, [linkToolEndpoint]);

  const imgRef = useRef(imageUploadEndpoint);
  useEffect(() => {
    imgRef.current = imageUploadEndpoint;
  }, [imageUploadEndpoint]);

  const imgHdrRef = useRef(imageAdditionalHeaders);
  useEffect(() => {
    imgHdrRef.current = imageAdditionalHeaders;
  }, [imageAdditionalHeaders]);

  const placeholderRef = useRef(placeholder);
  useEffect(() => {
    placeholderRef.current = placeholder;
  }, [placeholder]);

  const toolsRef = useRef(tools);
  useEffect(() => {
    toolsRef.current = tools;
  }, [tools]);

  const debouncedEmit = useMemo(
    () =>
      debounce(async () => {
        if (programmaticRef.current) return; // <- NEW: ignore programmatic changes
        const ed = editorRef.current;
        if (!ed) return;
        const saved = await ed.save();
        onChangeRef.current?.(saved, { holderId: internalHolderId });
      }, 300),
    [internalHolderId]
  );

  const destroyNow = useCallback(async (inst) => {
    try {
      await inst?.destroy?.();
    } catch {}
  }, []);

  const destroy = useCallback(async () => {
    try {
      debouncedEmit.flush?.();
    } catch {}
    const reg = getReg();

    const inst = editorRef.current;
    editorRef.current = null;
    setIsReady(false);

    generationRef.current += 1;

    reg?.creating.delete(internalHolderId);

    if (!inst) {
      INSTANCES.delete(internalHolderId);
      reg?.byId.delete(internalHolderId);
      if (holderRef.current) {
        reg?.byEl.delete(holderRef.current);
        hardCleanHolder(holderRef.current);
      }
      return;
    }

    await destroyNow(inst);
    INSTANCES.delete(internalHolderId);
    reg?.byId.delete(internalHolderId);
    if (holderRef.current) {
      reg?.byEl.delete(holderRef.current);
      hardCleanHolder(holderRef.current);
    }
  }, [debouncedEmit, destroyNow, internalHolderId]);

  const init = useCallback(async () => {
    if (typeof window === "undefined" || !holderRef.current) return;

    const reg = getReg();

    if (reg && reg.holders.has(internalHolderId)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[useEditorJs] Duplicate holderId "${internalHolderId}" detected. ` +
            `Give each <EditorJS> a unique holderId to avoid multiple instances.`
        );
      }
    } else {
      reg?.holders.add(internalHolderId);
    }

    const myGen = ++generationRef.current;
    mountedRef.current = true;

    if (reg?.creating.has(internalHolderId)) {
      try {
        const existing = await reg.creating.get(internalHolderId);
        if (myGen !== generationRef.current || !mountedRef.current) {
          await destroyNow(existing);
          return;
        }
        editorRef.current = existing;
        INSTANCES.set(internalHolderId, existing);
        reg?.byEl.set(holderRef.current, existing);
        reg?.byId.set(internalHolderId, existing);
        setIsReady(true);
        return;
      } catch {
        // fall through to fresh init
      }
    }

    const leaked =
      INSTANCES.get(internalHolderId) ?? reg?.byId.get(internalHolderId);
    if (leaked) {
      try {
        await destroyNow(leaked);
      } catch {}
      INSTANCES.delete(internalHolderId);
      reg?.byId.delete(internalHolderId);
    }

    hardCleanHolder(holderRef.current);

    const createPromise = (async () => {
      const [
        EditorJSCore,
        Header,
        List,
        Checklist,
        Table,
        Quote,
        Code,
        InlineCode,
        Delimiter,
        Embed,
        LinkTool,
        ImageTool,
        Paragraph,
      ] = await Promise.all([
        loadEditorCore(),
        loadHeader(),
        loadList(),
        loadChecklist(),
        loadTable(),
        loadQuote(),
        loadCode(),
        loadInlineCode(),
        loadDelimiter(),
        loadEmbed(),
        loadLinkTool(),
        loadImageTool(),
        loadParagraph(),
      ]);

      // If we became stale while loading, abort
      if (myGen !== generationRef.current || !mountedRef.current) {
        return null;
      }

      const defaultTools = {
        paragraph: { class: Paragraph, inlineToolbar: true },
        header: {
          class: Header,
          inlineToolbar: ["link", "bold", "italic"],
          config: { levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
        },
        list: { class: List, inlineToolbar: true },
        checklist: { class: Checklist, inlineToolbar: true },
        table: { class: Table, inlineToolbar: true },
        quote: { class: Quote, inlineToolbar: true },
        code: { class: Code },
        inlineCode: { class: InlineCode },
        delimiter: { class: Delimiter },
        embed: {
          class: Embed,
          config: {
            services: { youtube: true, vimeo: true, twitter: true },
          },
        },
        linkTool: {
          class: LinkTool,
          config: { endpoint: linkRef.current },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                // Option A: blob URL (local preview)
                const url = URL.createObjectURL(file);
                return { success: 1, file: { url } };

                // Option B: real upload (keep your commented code here)
              },
            },
          },
        },
      };

      const instance = new EditorJSCore({
        holder: internalHolderId,
        data: valueRef.current ?? DEFAULT_INITIAL_EDITOR,
        readOnly: readOnlyRef.current,
        placeholder: placeholderRef.current,
        onReady: () => {
          if (myGen !== generationRef.current || !mountedRef.current) return;
          setIsReady(true);
        },
        onChange: debouncedEmit,
        tools: toolsRef.current ? toolsRef.current : defaultTools,
      });

      await instance.isReady;

      // Final stale check after ready
      if (myGen !== generationRef.current || !mountedRef.current) {
        await destroyNow(instance);
        return null;
      }

      return instance;
    })();

    reg?.creating.set(internalHolderId, createPromise);
    try {
      const instance = await createPromise;
      if (!instance) return;
      editorRef.current = instance;
      INSTANCES.set(internalHolderId, instance);
      reg?.byEl.set(holderRef.current, instance);
      reg?.byId.set(internalHolderId, instance);
    } finally {
      reg?.creating.delete(internalHolderId);
    }
  }, [debouncedEmit, destroyNow, internalHolderId]);

  useLayoutEffect(() => {
    (async () => {
      await init();
    })();
    return () => {
      mountedRef.current = false;
      destroy();
      const reg = getReg();
      reg?.holders.delete(internalHolderId);
    };
  }, [init, destroy, internalHolderId]);

  useEffect(() => {
    const e = editorRef.current;
    if (!e) return;
    readOnly ? e.readOnly?.enable?.() : e.readOnly?.disable?.();
  }, [readOnly]);

  // --- NEW: explicit reset API (clear + render) and onChange suppression
  const reset = useCallback(async (data = DEFAULT_INITIAL_EDITOR) => {
    const e = editorRef.current;
    if (!e) return;
    programmaticRef.current = true;
    try {
      await e.clear();
      await e.render(data);
    } finally {
      // let any render-induced onChange settle before re-enabling
      setTimeout(() => (programmaticRef.current = false), 0);
    }
  }, []);

  // --- NEW: react to docKey changes (treat as open a different page)
  const lastDocKeyRef = useRef(docKey);
  useEffect(() => {
    if (!isReady || !editorRef.current) return;
    if (docKey !== lastDocKeyRef.current) {
      lastDocKeyRef.current = docKey;
      reset(valueRef.current ?? DEFAULT_INITIAL_EDITOR);
    }
  }, [docKey, isReady, reset]);

  // Optional: detect external value swaps for the same doc (structural signature)
  const lastSigRef = useRef(JSON.stringify(value?.blocks ?? []));
  useEffect(() => {
    if (!editorRef.current) return;
    const sig = JSON.stringify(value?.blocks ?? []);
    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      reset(value ?? DEFAULT_INITIAL_EDITOR);
    }
  }, [value, reset]);

  // helpers
  const save = useCallback(async () => editorRef.current?.save?.(), []);
  const clear = useCallback(async () => {
    if (!editorRef.current) return;
    programmaticRef.current = true;
    try {
      await editorRef.current.clear();
      onChangeRef.current?.({
        time: Date.now(),
        blocks: [],
        version: "2.30.10",
      });
    } finally {
      setTimeout(() => (programmaticRef.current = false), 0);
    }
  }, []);
  const focus = useCallback(() => editorRef.current?.focus?.(), []);

  return {
    holderRef,
    editor: editorRef.current,
    isReady,
    save,
    clear,
    reset, // <- exposed
    focus,
    destroy,
    internalHolderId,
  };
}
