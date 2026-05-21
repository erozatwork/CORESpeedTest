// provider
import { LayoutProvider } from "./provider/LayoutProvider";

import { DashboardLayout } from "./DashboardLayout";

// hooks
import { useBodyClasses } from "@shared/hooks";

const Layout = () => {
  useBodyClasses(`
        [--tw-page-bg:#F6F6F9]
        [--tw-page-bg-dark:var(--tw-themeColorDarkMode-page)]
        one_core 
        sidebar-fixed 
        bg-[--tw-page-bg]
        dark:bg-[--tw-page-bg-dark]
    `);

  return (
    <>
      <LayoutProvider>
        <DashboardLayout />
      </LayoutProvider>
    </>
  );
};

export { Layout };
