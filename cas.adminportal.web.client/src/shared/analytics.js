export const trackEvent = ({ name, properties }) => {
  // Track in Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    // GA4 recommended event structure
    window.gtag("event", name, {
      ...properties,
      // GA4 recommended parameters
      event_category: properties?.category || "engagement",
      event_label: properties?.label,
      value: properties?.value,
    });
  }
};

// Helper function to safely get component name
const getComponentName = (componentPath) => {
  const parts = componentPath.split("/");
  return parts.length > 1 ? parts[0] : componentPath;
};

// Function to track code copy events
export const trackCodeCopy = (componentPath) => {
  const componentName = getComponentName(componentPath);
  trackEvent({
    name: "doc_copy",
    properties: {
      component_name: componentName,
      content_type: "code",
      category: "engagement",
      label: `Code Copy - ${componentPath}`,
    },
  });
};

// Function to track theme mode changes
export const trackThemeChange = (componentPath, newTheme) => {
  const componentName = getComponentName(componentPath);
  trackEvent({
    name: "doc_select_theme",
    properties: {
      component_name: componentName,
      theme_mode: newTheme,
      category: "engagement",
      label: `Theme Change - ${componentPath}`,
    },
  });
};

// Function to track RTL/LTR changes
export const trackDirectionChange = (componentPath, newDirection) => {
  const componentName = getComponentName(componentPath);
  trackEvent({
    name: "doc_select_direction",
    properties: {
      component_name: componentName,
      text_direction: newDirection,
      category: "engagement",
      label: `Direction Change - ${componentPath}`,
    },
  });
};

// Function to track view mode changes
export const trackViewChange = (componentPath, newView) => {
  const componentName = getComponentName(componentPath);
  trackEvent({
    name: "doc_select_view",
    properties: {
      component_name: componentName,
      view_mode: newView,
      category: "engagement",
      label: `View Change - ${componentPath}`,
    },
  });
};

// Function to track item creation events
export const trackItemCreate = (module, itemType, itemId) => {
  trackEvent({
    name: "crud_create",
    properties: {
      module,
      item_type: itemType,
      ...(itemId && { item_id: itemId.toString() }),
      category: "crud",
      label: `Create ${itemType} - ${module}`,
    },
  });
};

// Function to track item view/read events
export const trackItemView = (module, itemType, itemId) => {
  trackEvent({
    name: "crud_view",
    properties: {
      module,
      item_type: itemType,
      item_id: itemId.toString(),
      category: "crud",
      label: `View ${itemType} - ${module}`,
    },
  });
};

// Function to track item update events
export const trackItemUpdate = (module, itemType, itemId) => {
  trackEvent({
    name: "crud_update",
    properties: {
      module,
      item_type: itemType,
      item_id: itemId.toString(),
      category: "crud",
      label: `Update ${itemType} - ${module}`,
    },
  });
};

// Function to track item delete events
export const trackItemDelete = (
  module,
  itemType,
  itemId,
  isHardDelete = false
) => {
  trackEvent({
    name: "crud_delete",
    properties: {
      module,
      item_type: itemType,
      item_id: itemId.toString(),
      delete_type: isHardDelete ? "hard" : "soft",
      category: "crud",
      label: `Delete ${itemType} - ${module}`,
    },
  });
};

// Function to track item restore events
export const trackItemRestore = (module, itemType, itemId) => {
  trackEvent({
    name: "crud_restore",
    properties: {
      module,
      item_type: itemType,
      item_id: itemId.toString(),
      category: "crud",
      label: `Restore ${itemType} - ${module}`,
    },
  });
};

// Function to track block code copy events
export const trackBlockCodeCopy = (blockName, blockPath) => {
  trackEvent({
    name: "block_code_copy",
    properties: {
      block_name: blockName,
      block_path: blockPath || "",
      content_type: "code",
      category: "engagement",
      label: `Block Code Copy - ${blockName}`,
    },
  });
};

// Function to track block CLI command copy events
export const trackBlockCliCopy = (blockName, packageManager) => {
  trackEvent({
    name: "block_cli_copy",
    properties: {
      block_name: blockName,
      package_manager: packageManager,
      content_type: "cli_command",
      category: "engagement",
      label: `Block CLI Copy - ${blockName}`,
    },
  });
};
