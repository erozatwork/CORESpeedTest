import { Navigate, useRoutes } from "react-router-dom";

/** Providers */
import { useRouteProvider } from "@app/providers";

// // Configuration
import { RoutesComponentConfig } from "./config/routes.config";

// // Authentication
import AuthGuard from "@features/auth/authGuard";
import RouteBasedGuard from "@features/auth/routeBasedGuard";

/**
 * Page as Elements
 */
import {
  HttpErrorPage,
  
  Dashboard,
  // Commented out - _blank feature doesn't exist
} from "./elements";

// Dashboard
import { Layout } from "@app/layouts/main/Layout";

export default function Router() {
  const { routes } = useRouteProvider();

  return useRoutes([
    {
      path: "/",
      element: (
        <>
          <AuthGuard>
            <Layout />
          </AuthGuard>
        </>
      ),
      children: [
        ...(routes || [])
          ?.filter((path) => path !== "/dashboard")
          ?.map((path) => ({
            path: path?.startsWith("/") ? path?.substring(1) : path,
            element: (
              <RouteBasedGuard hasContent routes={[path]}>
                {RoutesComponentConfig[path]}
              </RouteBasedGuard>
            ),
          })),

        {
          path: "/dashboard",
          element: <Dashboard />,
        },

      ],
    }, // HTTP -- BLOCKED REQUEST PAGE

    // Public Routes

    {
      path: "/error/403",
      element: <HttpErrorPage err="403" />,
    },
    {
      path: "/error/404",
      element: <HttpErrorPage err="404" />,
    },
    // {
    //   path: "*",
    //   element: <Navigate to="/error/404" replace />,
    // },
  ]);
}
