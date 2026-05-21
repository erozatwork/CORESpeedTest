import { CloudMoon, ExclamationMark } from "@phosphor-icons/react";

import MiniLayoutIcon from "@shared/core_icons/svgs/Mini";
import PresetsIcon from "@shared/core_icons/svgs/PresetsIcon";
import DefaultLayoutIcon from "@shared/core_icons/svgs/defaultLayoutIcon";

import { ThemeSettings } from "@shared/styles/theme/overrides/ThemeSettings";

import { Switch } from "@shared/components/ui/switch";
import { Button } from "@shared/components/ui/button";

const useThemeSettings = () => {
  const { settings, handleThemeMode, handleThemeLayout, handleThemeColor } =
    ThemeSettings();

  // Theme Color Mode
  const supportedThemeColors = ["red", "blue", "violet"];

  const colorClasses = {
    red: "bg-red-100/10 text-red-500",
    blue: "bg-blue-100/10 text-blue-500",
    violet: "bg-violet-100/10 text-violet-500",
  };

  const ThemeLayout = () => {
    return (
      <>
        <div className="flex flex-col p-4 gap-4">
          <div className="flex gap-4 mb-5">
            <div className="flex text-xs card p-4 gap-2 w-fit dark:bg-transparent dark:border-gray-400">
              <div className="flex flex-row justify-between items-center gap-4">
                <div>
                  <CloudMoon size={20} />
                </div>
                <div>
                  <Switch
                    checked={settings?.themeMode === "dark"}
                    onCheckedChange={(checked) => {
                      handleThemeMode(checked ? "dark" : "light");
                    }}
                  />
                </div>
              </div>
              <span className="font-semibold">Dark Mode</span>
            </div>
          </div>
          <div className="relative card shadow p-6 mb-5 dark:bg-transparent dark:border-gray-400">
            <div className="absolute -top-3 left-4 bg-gray-900 dark:text-black text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
              Nav
              <ExclamationMark size={15} weight="fill" />
            </div>
            <span className="text-xs font-semibold my-2">Layout</span>
            <div className="flex gap-4">
              <Button
                onClick={() => handleThemeLayout("horizontal")}
                className="bg-transparent card shadow-lg [&_svg:not([class*='size-'])]:size-15 border-gray-400"
                size="size-10"
              >
                <DefaultLayoutIcon />
              </Button>
              <Button
                onClick={() => handleThemeLayout("mini")}
                className="bg-transparent card shadow-lg [&_svg:not([class*='size-'])]:size-15 border-gray-400"
                size="size-10"
              >
                <MiniLayoutIcon />
              </Button>
            </div>
          </div>
          <div className="relative card shadow p-6 dark:bg-transparent dark:border-gray-400">
            <div className="absolute -top-3 left-4 bg-gray-900 dark:text-black text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
              Presets
              <ExclamationMark size={15} weight="fill" />
            </div>
            <div className="flex gap-4">
              {supportedThemeColors.map((color) => (
                <Button
                  key={color}
                  onClick={() => handleThemeColor(color)}
                  className={`w-26 h-26 ${colorClasses[color].split(" ")[0]}`}
                >
                  <PresetsIcon
                    className={`size-10 ${colorClasses[color].split(" ")[1]}`}
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return { ThemeLayout };
};

export { useThemeSettings };
