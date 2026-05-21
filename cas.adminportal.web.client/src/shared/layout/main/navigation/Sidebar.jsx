import clsx from "clsx";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive, useViewport } from "@shared/hooks";
import { usePathname } from "@app/providers";

import { useMainLayout } from "@app/layouts/main/provider/LayoutProvider";
import { getHeight } from "@shared/utils/index";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { Button } from "@shared/components/ui/button";
import { ArrowBendUpLeft } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@shared/components/ui/sheet";

const Sidebar = ({ defaultThemeLayout = "horizontal" }) => {
  const selfRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const scrollableOffset = 10;

  const [viewportHeight] = useViewport();

  const { pathname, prevPathname } = usePathname();

  const desktopMode = useResponsive("up", "lg");

  const navigate = useNavigate();

  const { mobileSidebarOpen, setSidebarMouseLeave, setMobileSidebarOpen } =
    useMainLayout();

  const { layout } = useMainLayout();

  const themeClass =
    layout.options.sidebar.theme === "dark" || pathname === "/dark-sidebar"
      ? "dark [&.dark]:bg-themeColorDarkMode-page"
      : "dark:bg-themeColorDarkMode-page";

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  // const handleMouseEnter = () => {
  //   setSidebarMouseLeave(false);
  // };

  // const handleMouseLeave = () => {
  //   setSidebarMouseLeave(true);
  // };

  const renderContent = () => {
    if (defaultThemeLayout === "horizontal") {
      return (
        <div
          ref={selfRef}
          // onMouseLeave={handleMouseLeave}
          // onMouseEnter={handleMouseEnter}
          className={clsx(
            "sidebar bg-light lg:border-e lg:border-e-gray-200 dark:border-e-gray-200 lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0",
            themeClass
          )}
        >
          {desktopMode && <SidebarHeader ref={headerRef} />}
          <div className="flex-1 overflow-auto">
            <SidebarContent
              {...(desktopMode && {
                height: scrollableHeight - 45,
              })}
            />
          </div>
          <div className="flex flex-center shrink-0 px-4 my-2 ">
            <Button
              onClick={() =>
                (window.location.href =
                  "https://system.onecoredevit.com/cas/app/dashboard")
              }
              weight="thin"
              className="w-full rounded-lg [&_svg:not([class*='size-'])]:size-5"
            >
              <ArrowBendUpLeft size={32} weight="bold" />
              Back To Main Menu
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="fixed top-0 bottom-0 z-20 lg:flex flex-col shrink-0 w-[--tw-sidebar-width] bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]">
        <SidebarHeader ref={headerRef} />
        <SidebarContent
          defaultThemeLayout={defaultThemeLayout}
          height={scrollableHeight}
        />
        <SidebarFooter ref={footerRef} />
      </div>
    );
  };

  useEffect(() => {
    if (headerRef.current && footerRef.current) {
      const headerHeight = getHeight(headerRef.current);
      const footerHeight = getHeight(footerRef.current);
      const availableHeight =
        viewportHeight - headerHeight - footerHeight - scrollableOffset;
      setScrollableHeight(availableHeight);
    } else {
      const headerHeight = getHeight(headerRef.current);
      const availableHeight = viewportHeight - headerHeight - scrollableOffset;
      setScrollableHeight(availableHeight);
    }
  }, [viewportHeight, desktopMode]);

  useEffect(() => {
    // Hide drawer on route chnage after menu link click
    if (!desktopMode && prevPathname !== pathname) {
      handleMobileSidebarClose();
    }
  }, [desktopMode, pathname, prevPathname]);

  if (desktopMode) {
    return renderContent();
  }

  return (
    <>
      <Sheet open={mobileSidebarOpen} onOpenChange={handleMobileSidebarClose}>
        <SheetContent
          className="border-0 p-0 w-[--tw-sidebar-width] scrollable-y-auto"
          forceMount={true}
          side="left"
          close={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Mobile Menu</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    </>
  );
};

export { Sidebar };
