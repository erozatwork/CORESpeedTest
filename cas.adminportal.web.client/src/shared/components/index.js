// Shared components barrel export
// This file provides centralized exports for all reusable UI components

// Custom components
// export * from './_custom/container/CardContainer'; // File doesn't exist
// export * from './_custom/fields/fields'; // File doesn't exist - use index.js
export * from "./_custom/fields"; // Using index.js
export * from "./_custom/fields/norms/TextField";
export * from "./_custom/hook-form/fields";
export * from "./_custom/hook-form/RHFSignaturePad";
export * from "./_custom/hook-form/RHFTextField";
export * from "./_custom/hook-form/RHFTextArea";
export * from "./_custom/hook-form/RHFUpload";
export * from "./_custom/modal/Modal";
export * from "./_custom/modal/useModalState";
export * from "./_custom/table/CardTable";
export { Table as CustomTable } from "./_custom/table/Table";
export * from "./_custom/table/useTable";

// UI components
// export * from './ui'; // Removed - using individual exports below instead
export * from "./ui/avatar";
export * from "./ui/badge";
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/dialog";
export * from "./ui/dropdown-menu";
export * from "./ui/input-group";
export * from "./ui/progress";
export * from "./ui/select";
export * from "./ui/table";
export * from "./ui/tabs";
export * from "./ui/tooltip";

// Loaders
export * from "./loaders/ScreenLoader";

// Other components
// export { OneIcon } from './OneIcon'; // Commented out - has broken dependencies and appears unused

// Accordion
export * from "./accordion";

// Menu
export * from "./menu";
