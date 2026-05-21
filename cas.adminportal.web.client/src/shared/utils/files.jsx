import {
    FilePdf,
    FileImage,
    FileText,
    FileDoc,
    FileXls,
    FileArchive,
    File,
} from "@phosphor-icons/react";

const getFileIcon = (file, iconSize = 30) => {
    if (!file) return <File size={iconSize} className="text-gray-400" />;

    if (typeof file === "string") {
        if (file.startsWith("data:image/")) {
            return <FileImage size={iconSize} className="text-blue-500" />;
        }
        return <File size={iconSize} className="text-gray-400" />;
    }

    const type = file.type || "";

    if (type.includes("pdf"))
        return <FilePdf size={iconSize} className="text-red-500" />;
    if (type.includes("image"))
        return <FileImage size={iconSize} className="text-blue-500" />;
    if (type.includes("msword") || type.includes("word"))
        return <FileDoc size={iconSize} className="text-blue-700" />;
    if (type.includes("spreadsheet") || type.includes("excel"))
        return <FileXls size={iconSize} className="text-green-600" />;
    if (type.includes("zip") || type.includes("compressed"))
        return <FileArchive size={iconSize} className="text-yellow-600" />;
    if (type.includes("text"))
        return <FileText size={iconSize} className="text-gray-600" />;

    return <File size={iconSize} className="text-gray-400" />;
};

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
};

const fileStringCreator = (fileString) => {
    const temporary = fileString
        ?.slice(fileString.lastIndexOf("."))
        .toLowerCase();

    const mimeTypeMap = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".doc": "application/msword",
        ".docx":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".zip": "application/zip",
        ".txt": "text/plain",
    };

    return [
        {
            name: fileString,
            type: mimeTypeMap[temporary] || "application/octet-stream",
        },
    ];
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export { getFileIcon, formatFileSize, fileStringCreator, fileToBase64 };
