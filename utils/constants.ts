export const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
export const UPLOAD_STATUS_PATH = process.env.UPLOAD_STATUS_PATH || "/documents/upload";
export const DELETE_API_PATH = process.env.DELETE_API_PATH || "/documents";
export const PROCESS_API_PATH = process.env.PROCESS_API_PATH || "/documents/process";
export const defaultFileName = "sample1.txt";
export const unsupportedFileFormat = `unsupported_file_format.exe`;
export const sameFilesDifferentFormats = ["sample1.txt", "sample1.pdf"];
export const manyFilesVariety = ["sample1.txt", "sample2.txt"];