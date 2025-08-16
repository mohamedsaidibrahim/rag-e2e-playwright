const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
const UPLOAD_STATUS_PATH = process.env.UPLOAD_STATUS_PATH || "/documents/upload";
const DELETE_API_PATH = process.env.DELETE_API_PATH || "/documents";
const PROCESS_API_PATH = process.env.PROCESS_API_PATH || "/documents/process";
const defaultFileName = "sample1.txt";
const sameFilesDifferentFormats = ["sample1.txt", "sample1.pdf", "sample1.docx", "sample1.png"];
const manyFilesVariety = ["sample1.txt", "sample2.txt"];