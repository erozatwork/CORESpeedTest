import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawArg = process.argv[2];
const isPrivate = process.argv.includes("private");
const routeArg = process.argv.find((arg) => arg.startsWith("route:"));
const useSubFolder = process.argv.includes("--folder");
const customRoute = routeArg ? routeArg.replace("route:", "") : null;

if (!rawArg) {
  console.error(
    "Please provide a module path. Example: npm run create:module admin/Administration private route:/admin/administration --folder"
  );
  process.exit(1);
}

const parts = rawArg.split("/");
const module = parts[0].toLowerCase();
const folderName = parts[1];
const pascalCase = folderName;
const camelCase = folderName.charAt(0).toLowerCase() + folderName.slice(1);
const lowerCase = folderName.toLowerCase();
const routePath = customRoute || `/${module}/${lowerCase}`;

const projectRoot = process.cwd();
const pageDir = path.join(
  projectRoot,
  "src/pages/dashboard",
  module,
  pascalCase,
  ...(useSubFolder ? [pascalCase] : [])
);

const componentDir = path.join(pageDir, "components");
const formsDir = path.join(componentDir, "forms");
const modalDir = path.join(componentDir, "modal");
const schemasDir = path.join(componentDir, "schemas");

const filesToCreate = [
  {
    path: path.join(pageDir, `${pascalCase}Page.jsx`),
    content: `// ${pascalCase}Page.jsx
import { useEffect, useState } from "react";
import { useSearchDebounce } from "@shared/utils";
import { useStoreQuery } from "@/zustand/store/useStoreQuery";
import { initializeSocket } from "@shared/realtime";
import { CardContainer } from "@shared/components/_custom/container/CardContainer";
import { useTable } from "@shared/components/_custom/table/useTable";
import { useModalState } from "@shared/components/_custom/modal/useModalState";
import { Table } from "./components/Table";
import { CreateEditModal } from "./components/modal/CreateEditModal";
import { APIs } from "@/shared/config/api.config";
import { TableHeader } from "./components/TableHeader";

export default function ${pascalCase}Page() {
    const { modalState, changeModalState, closeModal } = useModalState();
    const openCreateEditModal = modalState["openCreateEditModal"] || {};
    const [${camelCase}, set${pascalCase}] = useState();

    const { order, orderBy, page, rowsPerPage, onSort, onChangePage, onChangeRowsPerPage } = useTable({ defaultOrderBy: "id" });
    const { headerColumns } = TableHeader(changeModalState, set${pascalCase});
    const { search, useDebounce } = useSearchDebounce();

    const { getData, isLoading, load } = useStoreQuery({
        payload: { search, columns: headerColumns, sortColumnKey: orderBy, sortDirection: order, draw: page, start: (page - 1) * rowsPerPage, length: rowsPerPage },
        url: "API-ROUTE",
        queryKey: "${camelCase}",
    });

    useEffect(() => () => useDebounce.cancel(), []);
    initializeSocket(load, "load page", "${camelCase} page");

    return (
        <>
            <CreateEditModal id={openCreateEditModal.key} open={openCreateEditModal.isOpen} method={openCreateEditModal.method} load={load} onCloseModal={() => closeModal("openCreateEditModal")} />
            <CardContainer>
                <Table changeModalState={() => changeModalState("openCreateEditModal", "Create")} setSearchFilter={useDebounce} columns={headerColumns} order={order} onSort={onSort} orderBy={orderBy} isLoading={isLoading} data={getData?.data?.data} rowsPerPage={rowsPerPage} onRowsPerPageChange={onChangeRowsPerPage} onChangePage={onChangePage} count={getData?.data?.recordsFiltered} page={page} />
            </CardContainer>
        </>
    );
}`,
  },
  {
    path: path.join(formsDir, `CreateEdit${pascalCase}.jsx`),
    content: `// CreateEdit${pascalCase}.jsx
export const CreateEdit${pascalCase} = () => {
    return <div>Form content here</div>;
};`,
  },
  {
    path: path.join(modalDir, `CreateEditModal.jsx`),
    content: `// CreateEditModal.jsx
import { useEffect } from "react";
import { toast } from "sonner";
import { useSocketStore } from "@shared/realtime";
import { use${pascalCase}Schema } from "../schemas/${pascalCase}Schema";
import { Modal } from "@shared/components/_custom/modal/Modal";
import { CreateEdit${pascalCase} } from "../forms/CreateEdit${pascalCase}";
import { APIs } from "@/shared/config/api.config";
import { useDataStore } from "@/pages/_apis/request";

const CreateEditModal = ({ id, method, load, open, onCloseModal }) => {
    const socket = useSocketStore((state) => state.socket);
    const { defaultValues, methods, container, resetContainer } = use${pascalCase}Schema({ id });
    const { actionCreate, actionUpdate } = useDataStore();

    const { handleSubmit, reset, setError, formState: { isSubmitting } } = methods;

    useEffect(() => reset(defaultValues), [defaultValues]);
    useEffect(() => { reset(defaultValues); resetContainer(); }, [open]);

    const onSubmit = async (data) => {
        try {
            const res = method === "Create" ? await actionCreate("API-ROUTE", data) : await actionUpdate("API-ROUTE", data);
            toast.success(res?.responseText);
            load();
            socket.emit("load", { page: "${camelCase} page" });
            onCloseModal();
        } catch (error) {
            reset();
            toast.error(method === "Create" ? "Create Failed" : "Update Failed");
            setError("afterSubmit", { ...error, message: error.message });
        }
    };

    return (
        <Modal open={open} onCloseModal={onCloseModal} maxWidth="xs" modalTitle={\`\${method} ${pascalCase}\`} isSubmitting={isSubmitting} methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <CreateEdit${pascalCase} />
        </Modal>
    );
};

export { CreateEditModal };`,
  },
  {
    path: path.join(schemasDir, `${pascalCase}Schema.js`),
    content: `// ${pascalCase}Schema.js
import * as Yup from "yup";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContainer } from "@shared/utils";

const use${pascalCase}Schema = ({ id = null }) => {
    const { container, fetch, resetContainer } = useFormContainer();
    const defaultValues = useMemo(() => ({
        ${camelCase}Name: container?.${camelCase}?.name || "",
    }), [container]);

    const schema = Yup.object().shape({
        ${camelCase}Name: Yup.string().max(100).required("${pascalCase} Name is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        if (id !== null) {
            // fetch info
        }
    }, [id]);

    return { defaultValues, methods, container, fetch, resetContainer };
};

export { use${pascalCase}Schema };`,
  },
  {
    path: path.join(componentDir, `Table.jsx`),
    content: `// Table.jsx
import { TableToolbar } from "./TableToolbar";
import { Table as ${pascalCase}Table } from "@shared/components/_custom/table/Table";

const Table = ({ changeModalState, setSearchFilter, ...props }) => {
    return (
        <>
            <TableToolbar changeModalState={changeModalState} setSearchFilter={setSearchFilter} />
            <${pascalCase}Table {...props} />
        </>
    );
};

export { Table };`,
  },
  {
    path: path.join(componentDir, `TableHeader.jsx`),
    content: `// TableHeader.jsx
import { NotePencil, Trash } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "@shared/components/ui/button";

const TableHeader = (changeModalState, get${pascalCase}) => {
    const headerColumns = [
        { Header: "${pascalCase} ID", accessor: "id", sortable: true },
        { Header: "${pascalCase} Name", accessor: "name", sortable: true },
        {
            Header: "Created At",
            accessor: "createdDate",
            sortable: true,
            Cell: (row) => format(new Date(row.createdDate), "MMMM d, yyyy"),
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (row) => (
                <div className="flex justify-end gap-1">
                    <Button onClick={() => changeModalState("openCreateEditModal", "Edit", row.id)}>
                        <NotePencil />
                    </Button>
                    <Button onClick={() => changeModalState("openDeleteModal", "Delete", row.id)}>
                        <Trash />
                    </Button>
                </div>
            ),
        },
    ];

    return { headerColumns };
};

export { TableHeader };`,
  },
  {
    path: path.join(componentDir, `TableToolbar.jsx`),
    content: `// TableToolbar.jsx
import { TextField } from "@shared/components/_custom/fields/norms/TextField";
import { Button } from "@shared/components/ui/button";

export const TableToolbar = ({ changeModalState, setSearchFilter }) => {
    return (
        <div className="flex justify-between items-center pb-4">
            <TextField placeholder="Search..." onChange={setSearchFilter} />
            <Button onClick={changeModalState}>Create ${pascalCase}</Button>
        </div>
    );
};`,
  },
];

[pageDir, componentDir, formsDir, modalDir, schemasDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

filesToCreate.forEach(({ path: filePath, content }) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Skipped (already exists): ${filePath}`);
  }
});
if (isPrivate) {
  const routesFile = path.join(
    projectRoot,
    "src/app/routes/config/routes.config.jsx"
  );
  const routeCode = `  "${routePath}": <${pascalCase}Page />`;
  const routeComment = `  // ${
    module.charAt(0).toUpperCase() + module.slice(1)
  }`;

  if (fs.existsSync(routesFile)) {
    let content = fs.readFileSync(routesFile, "utf8");
    const configPattern =
      /export const RoutesComponentConfig = \{([\s\S]*?)\n\};/;
    const match = configPattern.exec(content);

    if (match && !content.includes(routeCode.trim())) {
      let inner = match[1];
      if (!inner.includes(routeComment)) {
        inner += `\n${routeComment}`;
      }
      inner += `\n${routeCode}`;
      content = content.replace(
        configPattern,
        `export const RoutesComponentConfig = {${inner}\n};`
      );

      const importPattern =
        /(import\s*\{[\s\S]*?)(\}\s*from\s*"\.\.\/elements";)/;
      const importMatch = importPattern.exec(content);
      if (importMatch && !importMatch[1].includes(`${pascalCase}Page`)) {
        let importBlock = importMatch[1].trim();
        if (!importBlock.endsWith(",")) importBlock += ",";
        importBlock += `\n  ${pascalCase}Page`;
        content = content.replace(importPattern, `${importBlock}\n$2`);
      }

      fs.writeFileSync(routesFile, content, "utf8");
      console.log("Route and import inserted into routes.config.jsx");
    }
  }
}

// Insert import in elements.jsx
const elementsFile = path.join(projectRoot, "src/app/routes/elements.jsx");
const relativePath = path.join(
  module,
  pascalCase,
  ...(useSubFolder ? [pascalCase] : []),
  `${pascalCase}Page`
);

const importLine = `export const ${pascalCase}Page = Loadable(lazy(() => import("../pages/dashboard/${relativePath}")));`;
const marker = `// ${module.charAt(0).toUpperCase() + module.slice(1)}`;

if (fs.existsSync(elementsFile)) {
  let content = fs.readFileSync(elementsFile, "utf8");
  if (!content.includes(`${pascalCase}Page`)) {
    if (content.includes(marker)) {
      const lines = content.split("\n");
      const index = lines.findIndex((line) => line.trim() === marker.trim());
      if (index !== -1) {
        lines.splice(index + 1, 0, importLine);
        content = lines.join("\n");
      }
    } else {
      content += `\n\n${marker}\n${importLine}`;
    }
    fs.writeFileSync(elementsFile, content, "utf8");
    console.log("Import inserted into elements.jsx");
  }
}
