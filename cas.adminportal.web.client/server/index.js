import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OLLAMA_URL = "http://localhost:11434/api/generate";

const readFolder = (dirPath) => {
    let content = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            content = content.concat(readFolder(fullPath));
        } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
            const fileData = fs.readFileSync(fullPath, "utf8");
            content.push(`/** FILE: ${fullPath} **/\n${fileData}`);
        }
    }
    return content.join("\n\n");
};

app.post("/api/summarize-docs", async (req, res) => {
    try {
        const folderPath = path.resolve("../src/pages");
        if (!fs.existsSync(folderPath)) {
            return res.status(400).json({ error: "Folder not found" });
        }

        const folderContent = readFolder(folderPath).slice(0, 5000); // Optional: Limit characters for small models

        const fetchRes = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "codellama:7b-instruct",
                prompt: `Act as a senior software engineer.\n\nYou are given the source code below:\n\n${folderContent}\n\nSummarize how this system works. Focus only on functionality and important logic from the "src/pages" folder.`,
                stream: false,
            }),
        });

        const data = await fetchRes.json();
        res.json({ summary: data.response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
