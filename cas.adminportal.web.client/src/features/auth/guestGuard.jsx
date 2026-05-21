import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
// routes
import { PATH_DASHBOARD } from "@shared/routing";
// components
import { ScreenLoader } from "@shared/components/loaders/ScreenLoader";

//
import { useAuthContext } from "./useAuthContext";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.dashboard} />;
  }

  if (!isInitialized) {
    return <ScreenLoader />;
  }

  return <> {children} </>;
}
