import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";

import { useSettings } from "@app/providers";
import { useMainLayout } from "@app/layouts/main/provider/LayoutProvider";
import { toAbsoluteUrl } from "@shared/utils/assets";

import { SidebarToggle } from "./SidebarToggle";

const SidebarHeader = forwardRef((props, ref) => {
  const { layout, sidebarMouseLeave } = useMainLayout();

  const { settings } = useSettings();

  const sidebarHeaderTitle = () => {
    return (
      <>
        <h1
          className={`${
            settings?.themeLayout === "horizontal"
              ? `text-dark`
              : `text-gray-900`
          } text-lg font-bold hidden md:flex ms-2.5 me-1`}
        >
          <span className="font-bold">ADMIN</span>
          <span className="font-normal ml-1">PORTAL</span>
        </h1>
      </>
    );
  };
  const lightLogo = () => {
    return (
      <>
        <Link
          to="/"
          className="dark:hidden flex items-center justify-center ml-1"
        >
          <img
            src="https://cdn.onecoredevit.com/logos/core-icon.svg"
            className="dark:hidden h-[34px]"
            alt="logo"
          />
          {layout.options.sidebar.collapse
            ? !sidebarMouseLeave && sidebarHeaderTitle()
            : sidebarHeaderTitle()}
        </Link>
      </>
    );
  };
  const darkLogo = () => {
    return (
      <>
        <Link to="/" className="flex items-center justify-center ml-2">
          <img
            src="https://cdn.onecoredevit.com/logos/core-icon.svg"
            className="h-[34px]"
            alt="logo"
          />

          {layout.options.sidebar.collapse
            ? !sidebarMouseLeave && sidebarHeaderTitle()
            : sidebarHeaderTitle()}
        </Link>
      </>
    );
  };
  return (
    <div
      ref={ref}
      className={`sidebar-header ${
        settings?.themeLayout === "horizontal"
          ? `bg-gray-200 `
          : `bg-transparent`
      } hidden lg:flex items-center relative justify-between lg:px-4 shrink-0 gap-2.5 p-6`}
    >
      {settings.themeMode === "light" ? lightLogo() : darkLogo()}
      {settings.themeLayout === "horizontal" && <SidebarToggle />}
    </div>
  );
});
export { SidebarHeader };
