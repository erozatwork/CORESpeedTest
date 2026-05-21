import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
//
import { useAuthContext } from "./useAuthContext";
// Path
import { PATH_ACCESS_DENIED } from "@shared/routing";
import { ScreenLoader } from "@shared/components/loaders/ScreenLoader";

// ----------------------------------------------------------------------

RouteBasedGuard.propTypes = {
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default function RouteBasedGuard({ hasContent, routes, children }) {
  const { paths } = useAuthContext();
  const [isPathReady, setIsPathReady] = useState(false);

  useEffect(() => {
    // paths === null  → still loading from backend
    // paths === []    → bypass / no restrictions → treat as ready
    // paths.length > 0 → real backend paths loaded
    if (paths !== null) {
      setIsPathReady(true);
    }
  }, [paths, routes]);

  if (!isPathReady) {
    return <ScreenLoader />;
  }

  // Ensure `routes` is always an array to avoid "routes is not iterable"
  const routeList = Array.isArray(routes) ? routes : routes ? [routes] : [];

  // Empty paths array = bypass / dev mode → allow all routes through
  if (paths !== null && paths.length > 0) {
  const isRouteAccessible = (paths || []).filter((config) => {
    return config === routeList[0];
  });

    function RedirectFallback({ to }) {
      useEffect(() => {
        window.location.replace(to);
      }, [to]);
      return null;
    }

    if (routeList.length > 0 && !routeList.includes(isRouteAccessible[0])) {
      return hasContent ? (
        <Navigate to={PATH_ACCESS_DENIED.access_denied} replace />
      ) : (
        <RedirectFallback to={PATH_ACCESS_DENIED.access_denied} />
      );
    }
  }

  return <> {children} </>;
}
