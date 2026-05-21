// EditorJS.jsx
import React from "react";
import useEditorJs from "./hook/useEditor";
// import {
//   APIs,
//   config,
// } from "../../../../src/modules/core_wiki/boards/apis/wiki.config"; // Module doesn't exist
const APIs = {}; // Placeholder - this component appears unused
const config = {};

const EditorJS = (
  {
    docKey,
    value,
    onChange,
    holderId,
    readOnly,
    placeholder = "Write something…",
    className,
    minHeight = 220,
    linkToolEndpoint = "/api/link",
    imageUploadEndpoint = `${config.API_URL}${APIs.ATTACHMENT.UPLOAD}`,
    imageAdditionalHeaders,
    tools,
  },
  ref
) => {
  const { holderRef, isReady, save, clear, reset, focus, internalHolderId } =
    useEditorJs({
      docKey,
      value,
      onChange,
      holderId,
      readOnly,
      placeholder,
      linkToolEndpoint,
      imageUploadEndpoint,
      imageAdditionalHeaders,
      tools,
    });

  React.useImperativeHandle(ref, () => ({ save, clear, reset, focus }), [
    save,
    clear,
    reset,
    focus,
  ]);

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <div
        id={internalHolderId}
        ref={holderRef}
        className={[
          `${
            !readOnly &&
            "rounded-md border border-zinc-200 dark:border-zinc-800"
          }`,
          "bg-white/80 dark:bg-[#141A21]/60",
          "p-4",
          "prose prose-neutral dark:prose-invert max-w-none",
          "focus-within:ring-2 focus-within:ring-blue-500/30",
        ].join(" ")}
        style={{ minHeight }}
      />
      {!isReady && (
        <div className="mt-2 text-xs text-zinc-500">Loading editor…</div>
      )}
    </div>
  );
};

export default React.forwardRef(EditorJS);
