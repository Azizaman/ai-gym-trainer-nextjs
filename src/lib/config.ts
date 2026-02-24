export const config = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB) || 100,
    SUPPORTED_MIME_TYPES: [
        "video/mp4",
        "video/quicktime", // .mov
        "video/x-msvideo", // .avi
        "video/webm",
        "video/x-matroska", // .mkv
    ],
};
