import { forwardRef } from "react";
import { SignOut } from "@phosphor-icons/react";

import { Button } from "@shared/components/ui/button";

import { AccountContent } from "../components/AccountContent";
import { ThemeContent } from "../components/ThemeContent";
import { NotificationContent } from "../components/NotificationContent";

import { useAuthContext } from "@features/auth/useAuthContext";

const SidebarFooter = forwardRef((props, ref) => {
  const { logout } = useAuthContext();

  return (
    <div
      ref={ref}
      className="flex flex-center justify-between shrink-0 px-4 my-2"
    >
      <AccountContent />

      <div className="flex items-center justify-center gap-1">
        <ThemeContent />
        <NotificationContent />

        <Button
          onClick={() => logout()}
          weight="thin"
          variant="ghost"
          className="text-dark rounded-lg [&_svg:not([class*='size-'])]:size-5 w-8"
        >
          <SignOut size={32} weight="duotone" />
        </Button>
      </div>
    </div>
  );
});
export { SidebarFooter };
