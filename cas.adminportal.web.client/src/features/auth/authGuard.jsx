import PropTypes from "prop-types";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Loader
import { ScreenLoader } from "@shared/components/loaders/ScreenLoader";

// Context
import { useAuthContext } from "./useAuthContext";

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && requestedLocation !== pathname) {
      setRequestedLocation(pathname);
    }
  }, [isAuthenticated, pathname, requestedLocation]);

  const BYPASS_AUTH = false;

  if (!isInitialized && !BYPASS_AUTH) {
    return <ScreenLoader />;
  }

  if (!isAuthenticated && !BYPASS_AUTH) {
    const hasCachedSession = Boolean(
      localStorage.getItem("accessToken") && localStorage.getItem("user")
    );

    if (hasCachedSession) {
      return <>{children}</>;
    }

    window.location.href = "https://system.onecoredevit.com/cas/app/auth";
  }

  if (requestedLocation && pathname !== requestedLocation) {
    const to = requestedLocation;
    setRequestedLocation(null);
    return <Navigate to={to} replace />;
  }

  return <>{children}</>;
}
