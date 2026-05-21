import { useMainLayout } from "@app/layouts/main/provider/LayoutProvider";
import { useLayout, useSettings } from "@app/providers";
import { useEffect } from "react";

const ThemeSettings = () => {
  const { settings, storeSettings } = useSettings();

  const handleThemeMode = (string) => {
    storeSettings({
      themeMode: string,
    });
  };

  const handleThemeColor = (string) => {
    storeSettings({
      themeColor: string,
    });
  };

  const handleThemeLayout = (string) => {
    storeSettings({
      themeLayout: string,
    });
  };

  return { settings, handleThemeMode, handleThemeColor, handleThemeLayout };
};

export { ThemeSettings };
