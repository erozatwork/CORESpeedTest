import { forwardRef } from "react";

import { AccountContent } from "../components/AccountContent";
import { ThemeContent } from "../components/ThemeContent";
import { NotificationContent } from "../components/NotificationContent";

const HeaderTopbar = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-row-reverse flex-center justify-between shrink-0 gap-2 px-4 my-2"
    >
      <AccountContent />

      <div className="flex items-center justify-center gap-1">
        {/* <ThemeContent /> */}

        <NotificationContent />
      </div>
    </div>
  );
});
export { HeaderTopbar };
