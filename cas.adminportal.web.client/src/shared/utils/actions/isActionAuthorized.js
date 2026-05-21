import { useEffect, useState } from "react";
// Auth
import { useAuthContext } from "@features/auth/useAuthContext";
import { GETPERMISSION } from "@features/auth/utils";

export const useActionAuthorization = (command) => {
  const { user } = useAuthContext();
  const { permission } = GETPERMISSION();
  const [actionAuthorized, setActionAuthorized] = useState(false);

  useEffect(() => {
    if (!user || !permission) return;

    if (user.emoloyeeId === permission.nameid) {
      setActionAuthorized(permission.permission.includes(command));
    } else {
      setActionAuthorized(false);
    }
  }, [user, permission, command]);

  return { actionAuthorized };
};
