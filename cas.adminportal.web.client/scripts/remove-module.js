import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawArg = process.argv[2];
if (!rawArg) {
  console.error(
    "Please provide a module path. Example: npm run delete:module admin/Administration"
  );
  process.exit(1);
}

const parts = rawArg.split("/");
const module = parts[0].toLowerCase();
const folderName = parts[1];
const pascalCase = folderName;

const projectRoot = process.cwd();

const pageDir = path.join(
  projectRoot,
  "src/pages/dashboard",
  module,
  pascalCase
);
const pageFile = path.join(pageDir, `${pascalCase}Page.jsx`);
const componentDir = path.join(pageDir, "components");

const routesFile = path.join(
  projectRoot,
  "src/app/routes/config/routes.config.jsx"
);
const elementsFile = path.join(projectRoot, "src/app/routes/elements.jsx");

const deleteIfEmpty = (dirPath) => {
  if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
    fs.rmdirSync(dirPath);
    console.log(`Removed empty folder: ${dirPath}`);
  }
};

const deleteFolderRecursive = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Deleted folder: ${dirPath}`);
  }
};

// Delete Page File
if (fs.existsSync(pageFile)) {
  fs.unlinkSync(pageFile);
  console.log(`Deleted file: ${pageFile}`);
}

// Delete Components (and forms, modal inside components)
deleteFolderRecursive(componentDir);

// Delete PascalCase folder if empty
deleteIfEmpty(pageDir);

// Delete module folder if empty after PascalCase removal
deleteIfEmpty(path.join(projectRoot, "src/pages/dashboard", module));

// Clean routes.config.jsx
if (fs.existsSync(routesFile)) {
  let content = fs.readFileSync(routesFile, "utf8");

  const lines = content
    .split("\n")
    .filter((line) => !line.includes(`${pascalCase}Page`));

  // Remove comment if no routes follow
  const sectionComment = `// ${
    module.charAt(0).toUpperCase() + module.slice(1)
  }`;
  const commentIndex = lines.findIndex(
    (line) => line.trim() === sectionComment
  );

  if (commentIndex !== -1) {
    let hasFollowingRoute = false;
    for (let i = commentIndex + 1; i < lines.length; i++) {
      if (lines[i].trim().startsWith('"')) {
        hasFollowingRoute = true;
        break;
      }
      if (lines[i].trim() === "" || lines[i].trim().startsWith("//")) continue;
      break;
    }
    if (!hasFollowingRoute) {
      lines.splice(commentIndex, 1);
    }
  }

  fs.writeFileSync(routesFile, lines.join("\n"), "utf8");
  console.log("Cleaned routes.config.jsx");
}

// Clean elements.jsx
if (fs.existsSync(elementsFile)) {
  let content = fs.readFileSync(elementsFile, "utf8");

  const marker = `// ${module.charAt(0).toUpperCase() + module.slice(1)}`;
  const pattern = new RegExp(
    `export const ${pascalCase}Page\\s*=\\s*Loadable\\([\\s\\S]*?import\\(["'\`]\\.\\.\\/pages\\/dashboard\\/${module}\\/${pascalCase}\\/${pascalCase}Page["'\`]\\)[\\s\\S]*?\\);\\n?`,
    "gm"
  );

  content = content.replace(pattern, "");

  if (content.includes(marker)) {
    const lines = content.split("\n");
    const index = lines.findIndex((line) => line.trim() === marker.trim());

    let hasFollowingExport = false;
    for (let i = index + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("export const ")) {
        hasFollowingExport = true;
        break;
      } else if (line === "" || line.startsWith("//")) {
        continue;
      } else {
        break;
      }
    }

    if (!hasFollowingExport) {
      lines.splice(index, 1);
    }

    fs.writeFileSync(elementsFile, lines.join("\n"), "utf8");
    console.log("Cleaned elements.jsx");
  }
}
