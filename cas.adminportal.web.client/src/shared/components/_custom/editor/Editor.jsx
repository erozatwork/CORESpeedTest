import { forwardRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./editor.css";

import Table from "quill/modules/table";
import TableUI from "quill-table-ui";
import "quill-table-ui/dist/index.css";

// Register table modules only if they are not already registered to avoid Quill overwrite warnings
// Attempt to import existing modules without spamming the console if they are absent
const _suppressConsole = (fn) => {
  const origError = console.error;
  const origWarn = console.warn;
  console.error = () => {};
  console.warn = () => {};
  try {
    return fn();
  } catch (e) {
    return null;
  } finally {
    console.error = origError;
    console.warn = origWarn;
  }
};

if (!_suppressConsole(() => Quill.import("modules/table"))) {
  Quill.register({ "modules/table": Table });
}

if (!_suppressConsole(() => Quill.import("modules/tableUI"))) {
  Quill.register({ "modules/tableUI": TableUI });
}

export const Editor = forwardRef((props, ref) => {
  return (
    <ReactQuill
      ref={ref}
      {...props}
      modules={{
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        table: true,
        tableUI: true,
      }}
    />
  );
});
