import { createContext, useContext, useMemo } from "react";
import { RoutesComponentConfig } from "@app/routes/config/routes.config";

import { ROUTE_PATHS } from "@shared/config/menu.config.js";

// Define route paths as a constant that won't be affected by HMR
const RouteContext = createContext({
  routes: ROUTE_PATHS,
  loading: false,
});

const useRouteProvider = () => useContext(RouteContext);

const RouteProvider = ({ children }) => {
  // Use the static route paths, fallback to config keys if available
  const routes = useMemo(() => {
    const configKeys = Object.keys(RoutesComponentConfig || {});
    // Use config keys if available, otherwise use the static list
    const finalRoutes = configKeys.length > 0 ? configKeys : ROUTE_PATHS;
    // console.log("RouteProvider - routes:", finalRoutes); // Debug log
    return finalRoutes;
  }, []);

  const value = useMemo(() => ({ routes, loading: false }), [routes]);

  return (
    <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
  );
};

export { RouteProvider, useRouteProvider };
