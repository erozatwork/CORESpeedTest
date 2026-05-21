import { useEffect } from "react";

import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";

import { useMainLayout } from "./provider/LayoutProvider";

// Hooks
import { useMenuCurrentItem } from "@shared/components/menu/hooks/useMenuCurrentItem";

// Providers
import { useMenus, useSettings } from "@app/providers";

import { Sidebar } from "@shared/layout/main/navigation/Sidebar";
import { Breadcrumbs } from "@shared/layout/main/breadcrumbs/Breadcrumbs";
import { Header } from "@shared/layout/main/header/Header";
import { Footer } from "@shared/layout/main/footer/Footer";
import { Main } from "./Main";

const DashboardLayout = () => {
  const { layout, setSidebarCollapse } = useMainLayout();
  const { settings } = useSettings();

  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();

  const menuConfig = getMenuConfig("primary");

  const menuItem = useMenuCurrentItem(menuConfig);

  useEffect(() => {
    const bodyClass = document.body.classList;

    // Add a class to the body element
    bodyClass.add("one_core");
    if (layout.options.sidebar.fixed) bodyClass.add("sidebar-fixed");
    if (layout.options.sidebar.collapse) bodyClass.add("sidebar-collapse");

    if (settings.themeLayout === "horizontal") bodyClass.add("header-fixed");

    // Remove the class when the component is unmounted
    return () => {
      bodyClass.remove(
        "one_core",
        "sidebar-fixed",
        "sidebar-collapse",
        "header-fixed"
      );
    };
  }, [layout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("layout-initialized");
    }, 1000); // 1000 milliseconds

    // Remove the class when the component is unmounted
    return () => {
      document.body.classList.remove("layout-initialized");
      clearTimeout(timer);
    };
  }, []);

  const hasHorizontalNav = settings.themeLayout === "horizontal";

  useEffect(() => {
    if (settings.themeLayout === "horizontal") {
      const bodyClass = document.body.classList;
      bodyClass.add("header-fixed");
    }

    if (settings.themeLayout === "mini") {
      setSidebarCollapse(false);
      const bodyClass = document.body.classList;
      bodyClass.remove("header-fixed", "sidebar-collapse");
    }
  }, [settings.themeLayout]);

  if (hasHorizontalNav) {
    return (
      <>
        <Helmet>
          <title>ADMIN PORTAL - {menuItem?.title || ""}</title>
        </Helmet>
        <Header />
        <Sidebar />

        <Main breadCrumbs={<Breadcrumbs />} footer={<Footer />}>
          <Outlet />
        </Main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>ADMIN PORTAL - {menuItem?.title || ""}</title>
      </Helmet>

      <Sidebar defaultThemeLayout="mini" />

      <Main
        defaultThemeLayout="mini"
        footer={<Footer defaultThemeLayout="mini" />}
      >
        <Outlet />
      </Main>
    </>
  );
};

export { DashboardLayout };
