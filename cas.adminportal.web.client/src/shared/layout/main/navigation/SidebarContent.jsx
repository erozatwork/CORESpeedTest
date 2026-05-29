import { usePathname } from "@app/providers";
import { SidebarMenu } from "./SidebarMenu";
import { lazy, Suspense } from "react";
import { useChecklistContext } from "@features/checklist/context/ChecklistContext";

const ChecklistSidebar = lazy(() =>
  import("@features/checklist/components/ChecklistSidebar").then((m) => ({
    default: m.default,
  }))
);

const SidebarContent = ({ defaultThemeLayout = "horizontal", height = 0 }) => {
  const { pathname } = usePathname();
  const isChecklistPage = pathname === "/checklist";
  let checklistState = null;

  // Safely get checklist context only if available
  try {
    const context = useChecklistContext();
    checklistState = context?.checklistState;
  } catch (e) {
    // Context not available outside of ChecklistProvider
  }

  if (defaultThemeLayout === "horizontal") {
    return (
      <div className="sidebar-content flex grow shrink-0 pe-2">
        <div
          className="scrollable-y-hover grow shrink-0 flex flex-col ps-2 lg:ps-5 pe-1 lg:pe-3"
          style={{
            ...(height > 0 && {
              height: `${height}px`,
            }),
          }}
        >
          <div className="flex-1">
            <SidebarMenu />
          </div>

          {/* Checklist Sidebar - Show when on checklist page */}
          {isChecklistPage && checklistState && (
            <div className="border-t pt-4 mt-4">
              <Suspense fallback={<div className="text-xs text-gray-500 p-4">Loading...</div>}>
                <ChecklistSidebar {...checklistState} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-stretch grow shrink-0 justify-center">
      <div
        className="scrollable-y-auto light:[--tw-scrollbar-thumb-color:var(--tw-content-scrollbar-color)] grow px-3 flex flex-col"
        style={{
          ...(height > 0 && {
            height: `${height}px`,
          }),
        }}
      >
        <div className="flex-1">
          <SidebarMenu />
        </div>

        {/* Checklist Sidebar - Show when on checklist page */}
        {isChecklistPage && checklistState && (
          <div className="border-t pt-4 mt-4">
            <Suspense fallback={<div className="text-xs text-gray-500 p-4">Loading...</div>}>
              <ChecklistSidebar {...checklistState} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};
export { SidebarContent };
