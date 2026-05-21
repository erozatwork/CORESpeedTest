import clsx from "clsx";
import { CaretLeft } from "@phosphor-icons/react";

import { useMainLayout } from "@app/layouts/main/provider/LayoutProvider";
import { useMatchPath } from "@shared/hooks";

const SidebarToggle = () => {
  const { layout, setSidebarCollapse } = useMainLayout();

  const { match } = useMatchPath("/dark-sidebar");

  const handleClick = () => {
    if (layout.options.sidebar.collapse) {
      setSidebarCollapse(false);
    } else {
      setSidebarCollapse(true);
    }
  };
  const buttonBaseClass = clsx(
    "btn btn-icon btn-icon-md size-[25px] rounded-full border backdrop-blur-lg bg-white/10 text-white hover:text-gray-700 toggle absolute start-full top-2/4 rtl:translate-x-2/4 -translate-x-2/4 -translate-y-2/4 border-2 border-white",
    layout.options.sidebar.collapse && "active"
  );

  const iconClass = clsx(
    "transition-all duration-300 text-dark",
    layout.options.sidebar.collapse ? "ltr:rotate-180" : "rtl:rotate-180"
  );

  const lightToggle = () => {
    return (
      <button
        onClick={handleClick}
        className={clsx(buttonBaseClass, "border-dark dark:border-gray-300")}
        aria-label="Toggle sidebar"
      >
        <CaretLeft size={12} weight="bold" className={iconClass} />
      </button>
    );
  };

  const darkToggle = () => {
    return (
      <div onClick={handleClick}>
        <div className="hidden [html.dark_&]:block">
          <button className={clsx(buttonBaseClass, "border-gray-300")}>
            <CaretLeft weight="bold" size={12} className={iconClass} />
          </button>
        </div>
        <div className="[html.dark_&]:hidden light">{lightToggle()}</div>
      </div>
    );
  };

  return match ? darkToggle() : lightToggle();
};
export { SidebarToggle };
