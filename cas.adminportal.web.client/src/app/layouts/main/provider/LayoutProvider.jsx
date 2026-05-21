import { createContext, useContext, useEffect, useState } from "react";

// Auth
import { useAuthContext } from "@features/auth/useAuthContext";

// hooks
import { useScrollPosition } from "@shared/hooks";

// Providers
import { useLayout, useMenus } from "@app/providers";

// Utils
import { deepMerge } from "@shared/utils/data";
import { ScreenLoader } from "@shared/components/loaders/ScreenLoader";
// import { ROUTE_PATHS } from "@shared/config/menu.config.js";
import { MENU_SIDEBAR, ROUTE_PATHS } from "@shared/config/menu.config.js";

// Configuration
const layoutConfig = {
  // one_core-layout
  name: "one_core-layout",
  options: {
    layout: {
      themeLayout: "horizontal",
    },
    sidebar: {
      theme: "light",
      fixed: true,
      collapse: false,
    },
    header: {
      fixed: true,
    },
  },
};

// Default layout properties
const initialLayoutProps = {
  /**one_core-layout || currentLayout?.name === 'one_core-layout' */
  layout: layoutConfig,
  megaMenuEnabled: false,
  headerSticky: false,
  mobileSidebarOpen: false,
  mobileMegaMenuOpen: false,
  sidebarMouseLeave: false,
  // setSidebarMouseLeave: (state) => console.log(`${state}`),
  // setMobileMegaMenuOpen: (open) => console.log(`${open}`),
  // setMobileSidebarOpen: (open) => console.log(`${open}`),
  // setMegaMenuEnabled: (enabled) => console.log(`${enabled}`),
  // setSidebarCollapse: (collapse) => console.log(`${collapse}`),
  // setSidebarTheme: (mode) => console.log(`${mode}`),
};

const LayoutContext = createContext(initialLayoutProps);

const useMainLayout = () => useContext(LayoutContext);

const LayoutProvider = ({ children }) => {
  const { menu, paths } = useAuthContext();
  const { isMenuReady, setIsMenuReady, setMenuConfig } = useMenus();
  const { getLayout, updateLayout, setCurrentLayout } = useLayout();

  const [layout, setLayout] = useState(() =>
    deepMerge(layoutConfig, getLayout(layoutConfig.name))
  );

  const [megaMenuEnabled, setMegaMenuEnabled] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false);
  const [sidebarMouseLeave, setSidebarMouseLeave] = useState(
    layout.options.sidebar.collapse
  );
  const scrollPosition = useScrollPosition();
  const headerSticky = scrollPosition > 0;

  // Menu base on allowed routes

  const transformMenuData = (routes) => {
    const reducedRoutes = [];
    const mergedPaths = [...(paths || []), ...ROUTE_PATHS];

    reducedRoutes.push({
      heading: "ADMIN PORTAL",
    });

    const transform = (items, isRoot = false) => {
      return items
        .map((menu) => {
          const normalizedPath = menu.path?.split("?")[0];

          const item = {
            title:
              normalizedPath === "/accountability-form/management"
                ? "APF Management"
                : menu.menuName,
            icon: menu.icon || undefined,
            path: menu.path !== "#" ? menu.path : undefined,
            children: [],
          };

          if (menu.subMenus && menu.subMenus.length > 0) {
            item.children = transform(menu.subMenus, false);
          }

          // Filtering logic:
          // 1. Root items are always kept (unless they have no path and no children).
          if (isRoot) {
            if (!item.path && item.children.length === 0) return null;
            return item;
          }

          // 2. Items with children are kept to preserve hierarchy for authorized sub-modules.
          if (item.children.length > 0) return item;

          // 3. Leaf items (no children) must have an authorized path.
          const basePath = item.path?.split("?")[0];
          if (item.path && mergedPaths.includes(basePath)) {
            return item;
          }

          return null;
        })
        .filter((item) => item !== null);
    };

    return [...reducedRoutes, ...transform(routes, true)];
  };

  // Sync layout state with layout provider

  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout, setCurrentLayout]);

  useEffect(() => {
    if (menu !== null) {
      // Merge API menus with static MENU_SIDEBAR
      // const mergedMenus = [
      //   ...MENU_SIDEBAR[0].leftSideBarMenus,
      //   ...menu.leftSideBarMenus,
      // ];

    //   setMenuConfig("primary", transformMenuData(mergedMenus));
    //   // setMenuConfig("primary", transformMenuData(MENU_SIDEBAR));
    //   setIsMenuReady(true);
    // }
    
      setMenuConfig("primary", transformMenuData(MENU_SIDEBAR[0].leftSideBarMenus));
      setIsMenuReady(true);
    }
  }, [menu]);

  if (!isMenuReady) {
    return <ScreenLoader />;
  }

  const setSidebarCollapse = (collapse) => {
    const updatedLayout = {
      options: {
        sidebar: {
          collapse,
        },
      },
    };
    updateLayout(layoutConfig.name, updatedLayout);
    setLayout(() => deepMerge(layoutConfig, getLayout(layoutConfig.name)));
  };

  const setSidebarTheme = (mode) => {
    const updatedLayout = {
      options: {
        sidebar: {
          theme: mode,
        },
      },
    };
    setLayout((prev) => deepMerge(prev, updatedLayout));
  };

  return (
    <LayoutContext.Provider
      value={{
        layout,
        headerSticky,
        mobileSidebarOpen,
        mobileMegaMenuOpen,
        megaMenuEnabled,
        sidebarMouseLeave,
        setMobileSidebarOpen,
        setMegaMenuEnabled,
        setSidebarMouseLeave,
        setMobileMegaMenuOpen,
        setSidebarCollapse,
        setSidebarTheme,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, useMainLayout };
