import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  FileIcon,
  TrashIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { getSize } from "@/utils/helper";
import { nanoid } from "nanoid";
import axios from "axios";
import clsx from "clsx";
import { motion } from "motion/react";

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const addFile = (file) => {
    file.id = nanoid(32);

    file.progress = 0;

    setFiles((files) => [...files, file]);

    uploadFile(file);
  };

  const removeFile = (file) => {
    setFiles((files) => files.filter((oldFile) => oldFile.id !== file.id));
  };

  const updateFile = (file, progress) => {
    setFiles((files) =>
      files.map((oldFile) => {
        if (oldFile.id === file.id) {
          oldFile.progress = progress;
        }

        return oldFile;
      }),
    );
  };

  const uploadFile = (file) => {
    setIsUploading(true);

    axios
      .post(
        `/api/upload`,
        { file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const progress = Math.round((event.loaded * 100) / event.total);

            updateFile(file, progress);
          },
        },
      )
      .catch(() => {
        updateFile(file, null);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="mx-auto max-w-lg flex-1">
      <div className="space-y-4">
        <div
          aria-disabled={isUploading}
          className="group relative rounded-xl border border-gray-200 bg-white transition-colors aria-disabled:pointer-events-none aria-disabled:bg-gray-50"
        >
          <div className="px-6 py-4">
            <div className="text-center">
              <div className="space-y-3">
                <div className="mx-auto flex size-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-xs">
                  <CloudArrowUpIcon size={20} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <button
                      type="button"
                      className="font-semibold text-blue-700 transition-colors group-aria-disabled:text-gray-400 hover:text-blue-800 active:text-blue-600"
                    >
                      Click to upload
                    </button>{" "}
                    or drag and drop
                  </p>

                  <p className="text-xs text-gray-600">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <input
            type="file"
            multiple
            onChange={(event) => {
              Array.from(event.target.files).forEach((file) => {
                addFile(file);
              });

              event.target.value = null;
            }}
            className="absolute inset-0 opacity-0"
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file) => {
              const size = (file.size / 100) * file.progress;

              const status = (() => {
                switch (file.progress) {
                  case null:
                    return {
                      text: "Failed",
                      icon: <XCircleIcon size={16} className="text-red-600" />,
                      color: "text-red-600",
                    };
                  case 0:
                  default:
                    return {
                      text: "Uploading...",
                      icon: (
                        <CloudArrowUpIcon size={16} className="text-gray-400" />
                      ),
                      color: "text-gray-500",
                    };
                  case 100:
                    return {
                      text: "Complete",
                      icon: (
                        <CheckCircleIcon size={16} className="text-green-600" />
                      ),
                      color: "text-green-600",
                    };
                }
              })();

              return (
                <div
                  key={file.id}
                  aria-invalid={status.text === "Failed"}
                  className="group relative"
                >
                  <div className="rounded-xl border border-gray-200 bg-white group-aria-invalid:border-transparent group-aria-invalid:ring-2 group-aria-invalid:ring-red-500">
                    <div className="p-4">
                      <div className="flex gap-x-2">
                        <FileIcon
                          size={20}
                          className="text-gray-400 group-aria-invalid:text-red-500"
                        />

                        <div className="flex-1 space-y-1 group-aria-invalid:space-y-1.5">
                          <div className="space-y-0.5">
                            <h6 className="text-sm font-medium text-gray-700">
                              {file.name}
                            </h6>

                            <div className="flex items-center gap-x-2">
                              <p className="text-sm text-gray-600">
                                {getSize(size)} of {getSize(file.size)}
                              </p>

                              <span className="h-3 w-px bg-gray-300" />

                              <div className="flex items-center gap-x-1">
                                {status.icon}

                                <p
                                  className={clsx(
                                    "text-sm font-medium",
                                    status.color,
                                  )}
                                >
                                  {status.text}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-x-3 group-aria-invalid:hidden">
                            <div className="relative flex-1 overflow-hidden rounded-full">
                              <div className="h-2 bg-gray-200" />

                              <motion.div
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width: `${file.progress}%`,
                                }}
                                className="absolute inset-0 rounded-r-full bg-blue-600"
                              />
                            </div>

                            <div className="shrink-0">
                              <p className="text-sm font-medium text-gray-700">
                                {file.progress}%
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="hidden text-sm font-semibold text-red-600 transition-colors group-aria-invalid:block hover:text-red-700 active:text-red-500"
                          >
                            Try again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="flex size-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 active:bg-gray-50"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
