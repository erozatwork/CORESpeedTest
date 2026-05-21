import { AsteriskSimple, File, Upload, X } from "@phosphor-icons/react";

import { useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@shared/components/ui/label";

import {
  getFileIcon,
  formatFileSize,
  fileStringCreator,
} from "@shared/utils/files";

const defaultAcceptTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
];

export const RHFSingleFileUpload = ({
  name,
  label = "Upload Files",
  accept = defaultAcceptTypes,
}) => {
  const { control, watch, setError, clearErrors } = useFormContext();
  const files = watch(name) || [];

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "File is required" }}
      render={({ field: { onChange }, fieldState: { error } }) => {
        const handleDrop = useCallback(
          (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file && !accept.includes(file.type)) {
              setError(name, {
                type: "manual",
                message: `Only ${accept
                  .map((t) => t.split("/")[1])
                  .join(", ")} files are allowed.`,
              });
              return;
            }

            clearErrors(name);
            onChange(file ? [file] : []);
          },
          [accept, name, onChange, setError, clearErrors]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          multiple: false,
          accept: accept.reduce((acc, type) => {
            acc[type] = [];
            return acc;
          }, {}),
        });

        return (
          <div className="flex flex-col xl:flex-row gap-2 w-full">
            {/* Drop area */}
            <div
              {...getRootProps()}
              className={`bg-gray-50 dark:bg-white/5 text-gray-600 text-sm font-semibold p-8 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer min-h-[160px] ${isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300"
                } ${error && "border-red-500 bg-red-50"}`}
            >
              <input {...getInputProps()} />
              <div className={`p-4 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700`}>
                <Upload
                  size={40}
                  weight="duotone"
                  className={`${error ? "text-red-500" : "text-primary group-hover:text-primary-active"}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-base font-bold ${error ? "text-red-600" : "text-[#1a2b4b]"}`}>
                  {label}
                </span>
                <span className={`text-xs font-medium text-gray-500 max-w-[200px] leading-relaxed ${error && "text-red-500"}`}>
                  Click to browse or drag a file from your device
                </span>
              </div>
            </div>

            {/* File preview */}
            <div
              className={`w-full rounded-2xl p-4 min-h-[160px] border ${files.length > 0 ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50/50 border-gray-100 border-dashed border-2 items-center justify-center flex"
                } ${error && "border-red-500 bg-red-50/30"}`}
            >
              {Array.isArray(files) && files.length > 0 && (
                <ul className="text-sm text-gray-700 w-full space-y-2">
                  {files.map((file, i) => (
                    <li
                      key={i}
                      className="border bg-white dark:bg-black/10 dark:text-white rounded-md p-3 flex justify-between items-center"
                    >
                      <figure className="flex items-start space-x-3">
                        {getFileIcon(file)}
                        <figcaption>
                          <span className="font-semibold block">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </span>
                        </figcaption>
                      </figure>

                      <button
                        type="button"
                        onClick={() => onChange([])}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={20} weight="light" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!Array.isArray(files) && files.length > 0 && (
                <ul className="text-sm text-gray-700 w-full space-y-2">
                  {fileStringCreator(files)?.map((file, i) => (
                    <li
                      key={i}
                      className="border bg-white rounded-md p-3 flex justify-between items-center"
                    >
                      <figure className="flex items-start space-x-3">
                        {getFileIcon(file)}
                        <figcaption>
                          <span className="font-semibold block">
                            {file.name}
                          </span>
                        </figcaption>
                      </figure>

                      <button
                        type="button"
                        onClick={() => onChange([])}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={20} weight="light" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {files.length === 0 && (
                <div className="flex flex-row items-center justify-center rounded-lg h-full">
                  <File
                    size={30}
                    className={`text-gray-400 ${error && "text-red-500"}`}
                  />
                  <span
                    className={`ml-2 font-medium ${error && "text-red-500"}`}
                  >
                    No files attached yet.
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};


export const RHFFileUploadList = ({ name, label, error }) => {
  const { watch, control } = useFormContext();
  const files = watch(name) || [];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <div className={`bg-smoke dark:bg-black/10 w-full rounded-xl p-4 border border-gray-100 ${files.length >= 2 ? "max-h-40 overflow-y-auto" : ""} ${error && "border-dashed border-2 border-red-500"}`}>
          {Array.isArray(files) && files.length > 0 && (
            <ul className="text-sm text-gray-700 dark:text-white w-full space-y-2">
              {files.map((file, i) => {
                const isFile = typeof File !== "undefined" && Object.prototype.toString.call(file) === "[object File]";
                return (
                  <li key={i} className="border border-gray-100 bg-white dark:bg-black/10 rounded-xl p-3 flex justify-between items-center shadow-sm">
                    <figure className={`flex items-start space-x-3 ${!isFile && `items-center`}`}>
                      {isFile ? getFileIcon(file) : getFileIcon(fileStringCreator(file.fileName)[0])}
                      <figcaption>
                        <span className="font-bold block text-gray-900">{isFile ? file.name : file.fileName}</span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{isFile && formatFileSize(file.size)}</span>
                      </figcaption>
                    </figure>
                    <button type="button" onClick={() => onChange(files.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <X size={18} weight="bold" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {files.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg h-32 border border-dashed border-gray-200">
              <File size={32} className={`text-gray-300 ${error && "text-red-500"}`} />
              <span className={`mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ${error && "text-red-500"}`}>No files attached yet.</span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export const RHFMultiFileUpload = ({
  name,
  label = "Upload Files",
  accept = defaultAcceptTypes,
  hideFileList = false,
  className = "",
}) => {
  const { control, watch } = useFormContext();
  const files = watch(name) || [];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => {
        const handleDrop = useCallback(
          (acceptedFiles) => {
            const filteredFiles = acceptedFiles.filter((file) =>
              accept.includes(file.type)
            );

            const newFiles = [...files, ...filteredFiles].filter(
              (file, index, self) =>
                index ===
                self.findIndex(
                  (f) => f.name === file.name && f.size === file.size
                )
            );

            onChange(newFiles);
          },
          [files, onChange, accept]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          multiple: true,
          accept: Array.isArray(accept)
            ? accept.reduce((acc, type) => {
              acc[type] = [];
              return acc;
            }, {})
            : accept,
        });

        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Upload size={18} weight="bold" className="text-red-700" />
              <Label className="text-sm font-semibold m-0 p-0 tracking-normal text-gray-900">
                {label}
              </Label>
              <AsteriskSimple
                size={10}
                weight="duotone"
                className="text-red-700 ml-0.5"
              />
            </div>
            <div className="flex flex-col gap-3">
              {/* Dropzone */}
              <div>
                <div
                  {...getRootProps()}
                  className={`bg-smoke dark:bg-white/10 text-gray text-sm font-semibold p-6 border-dashed border-2 rounded-xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${isDragActive
                    ? "border-primary-dark bg-primary-light"
                    : "border-gray-500"
                    } ${error && "border-red-500"}`}
                >
                  <input {...getInputProps()} />
                  <Upload
                    size={42}
                    weight="bold"
                    className="text-[#d0d5dd] mb-1"
                  />
                  <span className="text-sm font-semibold text-gray-900 mt-1">
                    Click to upload receipt or invoice
                  </span>
                  <span
                    className={`text-xs font-light leading-tight ${error && "text-red-500"
                      }`}
                  >
                    PDF, JPEG, or PNG (Max 10MB)
                  </span>
                </div>
                {error &&
                  (Array.isArray(error) ? (
                    error.map((err, idx) =>
                      err?.message ? (
                        <p key={idx} className="text-xs text-red-600 mt-1">
                          {err.message}
                        </p>
                      ) : null
                    )
                  ) : (
                    <p className="text-xs text-red-600 mt-1">
                      {error.message || String(error)}
                    </p>
                  ))}
              </div>

              {/* File List */}
              {!hideFileList && (
                <div
                  className={`bg-smoke dark:bg-black/10 w-full rounded-xl p-2 ${files.length >= 2
                    ? "max-h-40 scrollable-y-hover scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                    : ""
                    } ${error && "border-dashed border-2 border-red-500"}`}
                >
                  {Array.isArray(files) && files.length > 0 && (
                    <ul className="text-sm text-gray-700 dark:text-white w-full space-y-2">
                      {files.map((file, i) => {
                        const isFile =
                          typeof File !== "undefined" &&
                          Object.prototype.toString.call(file) ===
                          "[object File]";

                        return (
                          <li
                            key={i}
                            className="border bg-white dark:bg-black/10 rounded-md p-3 flex justify-between items-center"
                          >
                            <figure
                              className={`flex items-start space-x-3 ${!isFile && `items-center`
                                }`}
                            >
                              {isFile
                                ? getFileIcon(file)
                                : getFileIcon(
                                  fileStringCreator(file.fileName)[0]
                                )}
                              <figcaption>
                                <span className="font-semibold block">
                                  {isFile ? file.name : file.fileName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {isFile && formatFileSize(file.size)}
                                </span>
                              </figcaption>
                            </figure>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = files.filter(
                                  (_, idx) => idx !== i
                                );
                                onChange(updated);
                              }}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <X size={20} weight="light" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* {!Array.isArray(files) && files.length > 0 && ( ... )} */}

                  {files.length === 0 && (
                    <div className="flex flex-row items-center justify-center rounded-lg h-full">
                      <File
                        size={30}
                        className={`text-gray-400 ${error && "text-red-500"}`}
                      />
                      <span
                        className={`ml-2 font-medium ${error && "text-red-500"}`}
                      >
                        No files attached yet.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        );
      }}
    />
  );
};
