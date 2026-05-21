import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { AsteriskSimple, X, UploadSimple } from "@phosphor-icons/react";
import PropTypes from "prop-types";

import { useFormContext, Controller } from "react-hook-form";

import { Label } from "@shared/components/ui/label";
import { formatFileSize, getFileIcon, fileToBase64 } from "@shared/utils/files";

RHFSimpleUpload.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  accept: PropTypes.array,
  multiple: PropTypes.bool,
  isRequired: PropTypes.bool,
  showImagePreview: PropTypes.bool,
};

const defaultAcceptTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
];

export default function RHFSimpleUpload({
  name,
  label,
  accept = defaultAcceptTypes,
  multiple = false,
  isRequired = true,
  showImagePreview = false,
}) {
  const { control, setError, clearErrors, watch } = useFormContext();

  const files = watch(name) || [];

  // Generate image preview URL when showImagePreview is enabled
  const imagePreviewUrl = useMemo(() => {
    if (!showImagePreview || !Array.isArray(files) || files.length === 0) return null;
    const file = files[0];
    if (typeof file === "string" && file.startsWith("data:image/")) {
      return file;
    }
    if (file instanceof File && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [showImagePreview, files]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleDrop = useCallback(
          (acceptedFiles) => {
            const validFiles = acceptedFiles.filter((file) =>
              accept.includes(file.type)
            );

            const invalidFiles = acceptedFiles.filter(
              (file) => !accept.includes(file.type)
            );

            if (invalidFiles.length > 0) {
              setError(name, {
                type: "manual",
                message: `Only ${accept
                  .map((t) => t.split("/")[1])
                  .join(", ")} files are allowed.`,
              });
            } else {
              clearErrors(name);
            }

            if (validFiles.length > 0) {
              if (multiple) {
                // Merge new files, avoid duplicates by name
                const existing = Array.isArray(value) ? value : [];
                const existingNames = new Set(existing.map((f) => f.name));
                const newUnique = validFiles.filter(
                  (f) => !existingNames.has(f.name)
                );
                onChange([...existing, ...newUnique]);
              } else {
                onChange([validFiles[0]]);
              }
            }
          },
          [accept, name, onChange, setError, clearErrors, value]
        );

        const handleRemove = (fileName, e) => {
          e.stopPropagation();
          const updated = (Array.isArray(value) ? value : []).filter(
            (f) => f.name !== fileName
          );
          onChange(updated);
          if (updated.length === 0) {
            setError(name, {
              type: "manual",
              message: isRequired ? "At least one document is required" : undefined,
            });
          }
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          multiple: multiple,
          accept: accept.reduce((acc, type) => {
            acc[type] = [];
            return acc;
          }, {}),
        });

        const currentFiles = Array.isArray(files) ? files : [];

        return (
          <div className="w-full space-y-2">
            {label && (
              <Label className="text-sm inline-flex items-center gap-0">
                <span>{label}</span>
                {isRequired && (
                  <AsteriskSimple
                    size={10}
                    weight="duotone"
                    className="text-red-700 ml-0.5"
                  />
                )}
              </Label>
            )}

            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 px-4 py-3 text-left
                ${isDragActive
                  ? "border-primary bg-primary/5"
                  : error
                    ? "border-red-400 bg-red-50/50"
                    : "border-slate-200 bg-slate-50/50 hover:border-primary/40 hover:bg-primary/5"
                }`}
            >
              <input {...getInputProps()} />

              <div className={`rounded-full p-2 flex-shrink-0 ${isDragActive ? "bg-primary/10" : "bg-slate-100"} transition-colors`}>
                <UploadSimple
                  size={16}
                  weight="duotone"
                  className={isDragActive ? "text-primary" : "text-slate-400"}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isDragActive ? "text-primary" : "text-slate-600"}`}>
                  {isDragActive ? "Drop files here..." : (
                    multiple
                      ? "Click to browse or drag & drop multiple files"
                      : "Click to browse or drag & drop a file"
                  )}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {accept.includes("application/pdf")
                    ? multiple ? "PDF · Multiple files allowed" : "PDF files only"
                    : accept.map((t) => `.${t.split("/")[1]}`).join(", ")}
                </p>
              </div>
            </div>

            {/* File List */}
            {currentFiles.length > 0 && (
              <div className="mt-1.5 max-h-[88px] overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {currentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-lg shadow-sm group hover:border-slate-200 transition-all"
                  >
                    <div className="flex-shrink-0 text-slate-500">
                      {getFileIcon(file, 20)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(file.name, e)}
                      className="flex-shrink-0 p-1.5 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={13} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="ml-1 text-red-600 text-xs font-semibold">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
