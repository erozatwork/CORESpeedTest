// Optimized useEditorJs hook for Editor.js (URL-upload version)
// - Consolidated dynamic imports with a single loader
// - Robust StrictMode/HMR-safe registry (no module-scoped mutable singles)
// - Ref-based observers/listeners (no leaked globals)
// - Safer destroy & cleanup path; flush debounced onChange
// - Debounced save with trailing flush on blur/unmount
// - SSR guards and lighter effect churn
// - Extensible: pass additional tools; override endpoints per-tool
// - Minimal PDF tool retained (fixed height)

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import debounce from "lodash.debounce";

/** -------------------------- Helpers & Registry --------------------------- */
const DEFAULT_VERSION = "2.30.10";

export const DEFAULT_INITIAL_EDITOR = {
  time: Date.now(),
  blocks: [
    { id: "hdr_welcome", type: "header", data: { text: "New Page", level: 2 } },
    {
      id: "p_welcome",
      type: "paragraph",
      data: { text: "Start writing here…" },
    },
  ],
  version: DEFAULT_VERSION,
};

// Global registry shared across HMR/StrictMode cycles (attached to window)
function getReg() {
  if (typeof window === "undefined") return null;
  const w = window;
  if (!w.__EJS_REG__) {
    w.__EJS_REG__ = {
      byEl: new WeakMap(), // HTMLElement -> instance
      byId: new Map(), // holderId -> instance
      creating: new Map(), // holderId -> Promise<instance>
      holders: new Set(), // holderIds currently mounted
    };
  }
  return w.__EJS_REG__;
}

function hardCleanHolder(el) {
  if (!el) return;
  el.querySelectorAll(".codex-editor").forEach((n) => n.remove());
  el.innerHTML = "";
}

/** Generic binary uploader to your API (multipart/form-data). */
async function uploadBinaryToApi({ endpoint, file, headers }) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(endpoint, {
    method: "POST",
    body: fd,
    headers: headers || undefined,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  const url =
    data?.url || data?.file?.url || data?.data?.url || data?.data?.link;
  if (!url) throw new Error("Upload API did not return a URL");
  return url;
}

/** Optional: tell the API to fetch a remote URL and store it server-side. */
async function uploadRemoteUrlToApi({ endpoint, url, headers }) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: JSON.stringify({ url }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Upload-by-URL failed: ${res.status}`);
  const data = await res.json();
  const storedUrl =
    data?.url || data?.file?.url || data?.data?.url || data?.data?.link;
  return storedUrl || url; // fallback
}

/** ------------------------------ PDF Tool -------------------------------- */
class PdfTool {
  static get isReadOnlySupported() {
    return true;
  }
  static get toolbox() {
    return {
      title: "PDF",
      icon: "<svg width=18 height=18 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' fill='currentColor'/><path d='M14 2v6h6' fill='none' stroke='currentColor' stroke-width='2'/><text x='7' y='16' font-size='7' font-family='monospace' fill='currentColor'>PDF</text></svg>",
    };
  }
  constructor({ data, api, readOnly, config }) {
    this.api = api;
    this.readOnly = !!readOnly;
    this.config = config || {};
    this.data = {
      url: data?.url || "",
      filename: data?.filename || "",
      height: 500,
    };
    this.nodes = { wrapper: null, embed: null, link: null, title: null };
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "ejs-pdf block px-4 py-3 border rounded";

    const title = document.createElement("div");
    title.className = "ejs-pdf-title";
    title.contentEditable = this.readOnly ? "false" : "true";
    title.innerText = this.data.filename || "Untitled.pdf";

    const embed = document.createElement("embed");
    embed.type = "application/pdf";
    embed.style.width = "100%";
    embed.style.height = "500px";

    const link = document.createElement("a");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerText = "Open in new tab";

    if (this.data.url) {
      embed.src = this.data.url;
      link.href = this.data.url;
    }

    if (!this.readOnly) {
      const controls = document.createElement("div");
      controls.className = "ejs-pdf-controls mt-2 flex gap-2";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf,application/pdf";
      fileInput.addEventListener("change", async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        try {
          const result = await this.config?.uploader?.uploadByFile?.(f);
          const url =
            typeof result === "string"
              ? result
              : result?.file?.url || result?.url;
          if (url) {
            this.data.url = url;
            this.data.filename = f.name;
            embed.src = url;
            link.href = url;
            title.innerText = f.name;
          }
        } catch (err) {
          console.error(err);
        }
      });

      controls.appendChild(fileInput);
      wrapper.appendChild(controls);
    }

    wrapper.appendChild(title);
    wrapper.appendChild(embed);
    wrapper.appendChild(link);

    this.nodes = { wrapper, embed, link, title };
    return wrapper;
  }
  async save() {
    const titleText = this.nodes.title?.innerText?.trim();
    return {
      url: this.data.url,
      filename: titleText || this.data.filename || "",
      height: 500,
    };
  }
  validate(savedData) {
    if (!savedData) return false;
    if (savedData.url && typeof savedData.url !== "string") return false;
    return true;
  }
}

/** ------------------------------ useEditorJs ------------------------------ */
export default function useEditorJs(opts = {}) {
  const {
    docKey,
    holderId,
    value = DEFAULT_INITIAL_EDITOR,
    readOnly,
    placeholder = "Write something…",
    linkToolEndpoint = "/api/link",
    imageUploadEndpoint = "/api/upload",
    imageAdditionalHeaders,
    onChange,
    tools, // optional: override/merge
    pdfUploadEndpoint, // optional dedicated endpoint for PDFs
    pdfAdditionalHeaders,
  } = opts;

  // Holder element and editor instance
  const holderRef = useRef(null);
  const editorRef = useRef(null);

  // State & lifecycle guards
  const [isReady, setIsReady] = useState(false);
  const generationRef = useRef(0);
  const mountedRef = useRef(false);
  const programmaticRef = useRef(false); // suppress onChange during renders

  // Stable IDs / latest props as refs (avoid re-subscribing effects)
  const internalHolderId = useMemo(
    () => holderId ?? `editorjs_${Math.random().toString(36).slice(2)}`,
    [holderId]
  );

  const onChangeRef = useRef(onChange);
  const readOnlyRef = useRef(!!readOnly);
  const valueRef = useRef(value);
  const linkRef = useRef(linkToolEndpoint);
  const imgEndpointRef = useRef(imageUploadEndpoint);
  const imgHdrRef = useRef(imageAdditionalHeaders);
  const placeholderRef = useRef(placeholder);
  const toolsRef = useRef(tools);
  const pdfEndpointRef = useRef(pdfUploadEndpoint || imageUploadEndpoint);
  const pdfHdrRef = useRef(pdfAdditionalHeaders || imageAdditionalHeaders);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    readOnlyRef.current = !!readOnly;
  }, [readOnly]);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  useEffect(() => {
    linkRef.current = linkToolEndpoint;
  }, [linkToolEndpoint]);
  useEffect(() => {
    imgEndpointRef.current = imageUploadEndpoint;
  }, [imageUploadEndpoint]);
  useEffect(() => {
    imgHdrRef.current = imageAdditionalHeaders;
  }, [imageAdditionalHeaders]);
  useEffect(() => {
    placeholderRef.current = placeholder;
  }, [placeholder]);
  useEffect(() => {
    toolsRef.current = tools;
  }, [tools]);
  useEffect(() => {
    pdfEndpointRef.current = pdfUploadEndpoint || imageUploadEndpoint;
  }, [pdfUploadEndpoint, imageUploadEndpoint]);
  useEffect(() => {
    pdfHdrRef.current = pdfAdditionalHeaders || imageAdditionalHeaders;
  }, [pdfAdditionalHeaders, imageAdditionalHeaders]);

  // Debounced save emitter (trailing)
  const debouncedEmit = useMemo(
    () =>
      debounce(async () => {
        if (programmaticRef.current) return;
        const ed = editorRef.current;
        if (!ed) return;
        const saved = await ed.save();
        onChangeRef.current?.(saved, { holderId: internalHolderId });
      }, 300),
    [internalHolderId]
  );

  const flushEmit = useCallback(async () => {
    try {
      debouncedEmit.flush?.();
    } catch {}
    const ed = editorRef.current;
    if (!ed) return;
    const saved = await ed.save();
    onChangeRef.current?.(saved, { holderId: internalHolderId });
  }, [debouncedEmit, internalHolderId]);

  // ------------------------ Inline Toolbar: Bullet -------------------------
  const INLINE_BULLET_CLASS = "ejs-inline-bullet-btn";
  const bulletInjectingRef = useRef(false);
  const bulletStateRef = useRef("");
  const bulletObsRef = useRef(null);
  const bulletRafRef = useRef(false);

  const isInsideTableCell = useCallback(
    (el) => !!(el && el.closest && el.closest(".tc-table")),
    []
  );

  const insertTextAtCursor = useCallback((text) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const buildBulletButtonEl = useCallback(() => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = INLINE_BULLET_CLASS;
    btn.title = "Insert bullet (• )";
    btn.textContent = "•";
    btn.style.fontSize = "14px";
    btn.style.padding = "2px 8px";
    btn.style.border = "1px solid #e5e7eb";
    btn.style.borderRadius = "6px";
    btn.style.background = "white";
    btn.style.cursor = "pointer";
    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      insertTextAtCursor("• ");
    });
    return btn;
  }, [insertTextAtCursor]);

  const inlineToolbarShown = (t) =>
    t?.classList?.contains("ce-inline-toolbar--shown");
  const isToolbarForTable = () => {
    const sel = window.getSelection?.();
    const el =
      sel?.anchorNode instanceof Node ? sel.anchorNode.parentElement : null;
    return isInsideTableCell(el);
  };

  const injectBulletIntoInlineToolbar = useCallback(() => {
    if (bulletInjectingRef.current) return;
    const toolbar = document.querySelector(".ce-inline-toolbar");
    if (!toolbar) return;

    const shown = inlineToolbarShown(toolbar);
    const inside = isToolbarForTable();
    const want = shown && inside;
    const has = !!toolbar.querySelector(`.${INLINE_BULLET_CLASS}`);

    const stateKey = `${shown ? 1 : 0}-${inside ? 1 : 0}-${has ? 1 : 0}`;
    if (stateKey === bulletStateRef.current) return;
    bulletStateRef.current = stateKey;

    bulletInjectingRef.current = true;
    try {
      if (!want && has)
        toolbar.querySelector(`.${INLINE_BULLET_CLASS}`)?.remove();
      else if (want && !has) toolbar.appendChild(buildBulletButtonEl());
    } finally {
      bulletInjectingRef.current = false;
    }
  }, [buildBulletButtonEl]);

  const scheduleBulletInject = useCallback(() => {
    if (bulletRafRef.current) return;
    bulletRafRef.current = true;
    requestAnimationFrame(() => {
      bulletRafRef.current = false;
      injectBulletIntoInlineToolbar();
    });
  }, [injectBulletIntoInlineToolbar]);

  const startInlineBulletObserver = useCallback(() => {
    const toolbar = document.querySelector(".ce-inline-toolbar");
    if (!toolbar) return;
    bulletObsRef.current?.disconnect?.();
    bulletObsRef.current = new MutationObserver((muts) => {
      if (
        !muts.some(
          (m) => m.type === "attributes" && m.attributeName === "class"
        )
      )
        return;
      injectBulletIntoInlineToolbar();
    });
    bulletObsRef.current.observe(toolbar, {
      attributes: true,
      attributeFilter: ["class"],
    });
    injectBulletIntoInlineToolbar();
  }, [injectBulletIntoInlineToolbar]);

  const stopInlineBulletObserver = useCallback(() => {
    bulletObsRef.current?.disconnect?.();
    bulletObsRef.current = null;
  }, []);

  const attachBulletGlobalListeners = useCallback(() => {
    document.addEventListener("selectionchange", scheduleBulletInject);
    document.addEventListener("mouseup", scheduleBulletInject);
    document.addEventListener("keydown", scheduleBulletInject);
  }, [scheduleBulletInject]);

  const detachBulletGlobalListeners = useCallback(() => {
    document.removeEventListener("selectionchange", scheduleBulletInject);
    document.removeEventListener("mouseup", scheduleBulletInject);
    document.removeEventListener("keydown", scheduleBulletInject);
  }, [scheduleBulletInject]);

  // ----------------------------- Table helpers ----------------------------
  const insertLineBreakAtCursor = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const br = document.createElement("br");
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const getTableContext = useCallback(() => {
    const sel = window.getSelection?.();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

    const td = node.closest?.("td");
    const table = node.closest?.(".tc-table, table");
    if (!td || !table) return null;

    const tr = td.parentElement;
    const rowIndex = Array.from(tr.parentElement.children).indexOf(tr);
    const cellIndex = Array.from(tr.children).indexOf(td);

    return { table, td, tr, rowIndex, cellIndex };
  }, []);

  const clearCellContent = (td) => {
    td.innerHTML = "";
    td.appendChild(document.createElement("br"));
  };
  const cloneEmptyRowFrom = (tr) => {
    const n = tr.cloneNode(true);
    Array.from(n.children).forEach((c) => clearCellContent(c));
    return n;
  };

  const insertRowBelow = useCallback(() => {
    const ctx = getTableContext();
    if (!ctx) return;
    const { tr } = ctx;
    const newTr = cloneEmptyRowFrom(tr);
    tr.parentElement.insertBefore(newTr, tr.nextSibling);
  }, [getTableContext]);
  const insertRowAbove = useCallback(() => {
    const ctx = getTableContext();
    if (!ctx) return;
    const { tr } = ctx;
    const newTr = cloneEmptyRowFrom(tr);
    tr.parentElement.insertBefore(newTr, tr);
  }, [getTableContext]);
  const insertCol = useCallback(
    (dir) => {
      const ctx = getTableContext();
      if (!ctx) return;
      const { table, cellIndex } = ctx;
      const tbody = table.tBodies?.[0] || table.querySelector("tbody") || table;
      Array.from(tbody.rows).forEach((row) => {
        const refCell = row.cells[cellIndex];
        const td = document.createElement("td");
        td.setAttribute("contenteditable", "true");
        clearCellContent(td);
        if (dir === "left") row.insertBefore(td, refCell);
        else row.insertBefore(td, refCell?.nextSibling || null);
      });
    },
    [getTableContext]
  );
  const insertColLeft = useCallback(() => insertCol("left"), [insertCol]);
  const insertColRight = useCallback(() => insertCol("right"), [insertCol]);

  // Keyboard shortcuts in table cells
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    const onKeyDown = (e) => {
      if (!isInsideTableCell(e.target)) return;
      if (e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        insertLineBreakAtCursor();
        return;
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        insertLineBreakAtCursor();
        insertTextAtCursor("• ");
        return;
      }
    };
    holder.addEventListener("keydown", onKeyDown);
    return () => holder.removeEventListener("keydown", onKeyDown);
  }, [isInsideTableCell, insertLineBreakAtCursor, insertTextAtCursor]);

  // ----------------------------- Editor init ------------------------------
  const destroy = useCallback(async () => {
    try {
      debouncedEmit.flush?.();
    } catch {}
    const reg = getReg();
    const inst = editorRef.current;

    // Reset local state first to prevent races
    editorRef.current = null;
    setIsReady(false);
    generationRef.current += 1;
    reg?.creating.delete(internalHolderId);

    if (inst?.destroy) {
      try {
        await inst.destroy();
      } catch {}
    }

    if (holderRef.current) {
      reg?.byEl.delete(holderRef.current);
      hardCleanHolder(holderRef.current);
    }
    reg?.byId.delete(internalHolderId);

    // Cleanup inline-toolbar listeners
    try {
      stopInlineBulletObserver();
    } catch {}
    try {
      detachBulletGlobalListeners();
    } catch {}
  }, [
    debouncedEmit,
    internalHolderId,
    stopInlineBulletObserver,
    detachBulletGlobalListeners,
  ]);

  const loadToolModules = useCallback(async () => {
    // Load core + built-in tools once in parallel
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
      import("@editorjs/editorjs").then((m) => m.default),
      import("@editorjs/header").then((m) => m.default),
      import("@editorjs/list").then((m) => m.default),
      import("@editorjs/checklist").then((m) => m.default),
      import("@editorjs/table").then((m) => m.default),
      import("@editorjs/quote").then((m) => m.default),
      import("@editorjs/code").then((m) => m.default),
      import("@editorjs/inline-code").then((m) => m.default),
      import("@editorjs/delimiter").then((m) => m.default),
      import("@editorjs/embed").then((m) => m.default),
      import("@editorjs/link").then((m) => m.default),
      import("@editorjs/image").then((m) => m.default),
      import("@editorjs/paragraph").then((m) => m.default),
    ]);

    return {
      EditorJSCore,
      defaultTools: {
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
          config: { services: { youtube: true, vimeo: true, twitter: true } },
        },
        linkTool: { class: LinkTool, config: { endpoint: linkRef.current } },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const url = await uploadBinaryToApi({
                  endpoint: imgEndpointRef.current,
                  file,
                  headers: imgHdrRef.current,
                });
                return { success: 1, file: { url } };
              },
              async uploadByUrl(url) {
                try {
                  const stored = await uploadRemoteUrlToApi({
                    endpoint: imgEndpointRef.current,
                    url,
                    headers: imgHdrRef.current,
                  });
                  return { success: 1, file: { url: stored } };
                } catch {
                  return { success: 1, file: { url } };
                }
              },
            },
          },
        },
        pdf: {
          class: PdfTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const url = await uploadBinaryToApi({
                  endpoint: pdfEndpointRef.current,
                  file,
                  headers: pdfHdrRef.current,
                });
                return url;
              },
              async uploadByUrl(url) {
                try {
                  const stored = await uploadRemoteUrlToApi({
                    endpoint: pdfEndpointRef.current,
                    url,
                    headers: pdfHdrRef.current,
                  });
                  return stored;
                } catch {
                  return url;
                }
              },
            },
          },
        },
      },
    };
  }, []);

  const init = useCallback(async () => {
    if (typeof window === "undefined" || !holderRef.current) return;

    const reg = getReg();
    if (!reg) return;

    if (reg.holders.has(internalHolderId)) {
      if (import.meta?.env?.MODE !== "production") {
        console.warn(
          `[useEditorJs] Duplicate holderId "${internalHolderId}" detected.`
        );
      }
    } else {
      reg.holders.add(internalHolderId);
    }

    const myGen = ++generationRef.current;
    mountedRef.current = true;

    if (reg.creating.has(internalHolderId)) {
      try {
        const existing = await reg.creating.get(internalHolderId);
        if (myGen !== generationRef.current || !mountedRef.current) {
          await existing?.destroy?.();
          return;
        }
        editorRef.current = existing;
        reg.byEl.set(holderRef.current, existing);
        reg.byId.set(internalHolderId, existing);
        setIsReady(true);
        startInlineBulletObserver();
        attachBulletGlobalListeners();
        return;
      } catch {}
    }

    const leaked = reg.byId.get(internalHolderId);
    if (leaked) {
      try {
        await leaked.destroy?.();
      } catch {}
      reg.byId.delete(internalHolderId);
    }

    hardCleanHolder(holderRef.current);

    const createPromise = (async () => {
      const { EditorJSCore, defaultTools } = await loadToolModules();
      if (myGen !== generationRef.current || !mountedRef.current) return null;

      const instance = new EditorJSCore({
        holder: internalHolderId,
        data: valueRef.current ?? DEFAULT_INITIAL_EDITOR,
        readOnly: readOnlyRef.current,
        placeholder: placeholderRef.current,
        onReady: () => {
          if (myGen !== generationRef.current || !mountedRef.current) return;
          setIsReady(true);
          startInlineBulletObserver();
          attachBulletGlobalListeners();
        },
        onChange: debouncedEmit,
        tools: toolsRef.current ? toolsRef.current : defaultTools,
      });

      await instance.isReady;
      if (myGen !== generationRef.current || !mountedRef.current) {
        try {
          await instance.destroy?.();
        } catch {}
        return null;
      }
      return instance;
    })();

    reg.creating.set(internalHolderId, createPromise);
    try {
      const instance = await createPromise;
      if (!instance) return;
      editorRef.current = instance;
      reg.byEl.set(holderRef.current, instance);
      reg.byId.set(internalHolderId, instance);
    } finally {
      reg.creating.delete(internalHolderId);
    }
  }, [
    attachBulletGlobalListeners,
    debouncedEmit,
    internalHolderId,
    loadToolModules,
    startInlineBulletObserver,
  ]);

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

  // Toggle readOnly when prop changes
  useEffect(() => {
    const e = editorRef.current;
    if (!e) return;
    readOnly ? e.readOnly?.enable?.() : e.readOnly?.disable?.();
  }, [readOnly]);

  // Explicit reset API (clear + render) with onChange suppression
  const reset = useCallback(async (data = DEFAULT_INITIAL_EDITOR) => {
    const e = editorRef.current;
    if (!e) return;
    programmaticRef.current = true;
    try {
      await e.clear();
      await e.render(data);
    } finally {
      queueMicrotask(() => (programmaticRef.current = false));
    }
  }, []);

  // React to docKey changes by re-rendering current value
  const lastDocKeyRef = useRef(docKey);
  useEffect(() => {
    if (!isReady || !editorRef.current) return;
    if (docKey !== lastDocKeyRef.current) {
      lastDocKeyRef.current = docKey;
      reset(valueRef.current ?? DEFAULT_INITIAL_EDITOR);
    }
  }, [docKey, isReady, reset]);

  // Detect external value swaps (compare block signatures)
  const lastSigRef = useRef(JSON.stringify(value?.blocks ?? []));
  useEffect(() => {
    if (!editorRef.current) return;
    const sig = JSON.stringify(value?.blocks ?? []);
    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      reset(value ?? DEFAULT_INITIAL_EDITOR);
    }
  }, [value, reset]);

  // Flush debounced changes on window blur/unmount for data safety
  useEffect(() => {
    const onBlur = () => {
      flushEmit();
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [flushEmit]);

  // Public helpers
  const save = useCallback(async () => editorRef.current?.save?.(), []);
  const clear = useCallback(async () => {
    if (!editorRef.current) return;
    programmaticRef.current = true;
    try {
      await editorRef.current.clear();
      onChangeRef.current?.(
        { time: Date.now(), blocks: [], version: DEFAULT_VERSION },
        { holderId: internalHolderId }
      );
    } finally {
      queueMicrotask(() => (programmaticRef.current = false));
    }
  }, [internalHolderId]);
  const focus = useCallback(() => editorRef.current?.focus?.(), []);

  return {
    holderRef,
    editor: editorRef.current,
    isReady,
    save,
    clear,
    reset,
    focus,
    destroy,
    internalHolderId,
    insertRowBelow,
    insertRowAbove,
    insertColLeft,
    insertColRight,
  };
}
