import { filesize } from "filesize";

const getSize = (bytes) => {
  return filesize(bytes, { round: 0 });
};

export { getSize };
