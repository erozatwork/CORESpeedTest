import { Gear, X } from "@phosphor-icons/react";
import { useMenu } from "@shared/components/_custom/menu/useMenu";

import { Button } from "@shared/components/ui/button";
import { useThemeSettings } from "@shared/components/_custom/settings/useThemeSettings";

const ThemeContent = () => {
    const { ViewMenu } = useMenu();
    const { ThemeLayout } = useThemeSettings();

    return (
        <>
            <ViewMenu
                buttonWeight="thin"
                buttonVariant="ghost"
                buttonClass="text-white rounded-lg [&_svg:not([class*='size-'])]:size-5 w-8"
                icon={
                    <Gear
                        size={32}
                        weight="duotone"
                        className="animate-rotate-clockwise"
                    />
                }
                label={
                    <div className="flex justify-between items-center gap-4 w-full">
                        <span className="text-base font-medium">
                            Theme Settings
                        </span>
                        <Button
                            weight="thin"
                            variant="ghost"
                            className="text-dark rounded-lg [&_svg:not([class*='size-'])]:size-5 w-5 h-5"
                        >
                            <X size={32} weight="duotone" />
                        </Button>
                    </div>
                }
                className="w-96 backdrop-blur-lg bg-white/80 dark:bg-[#141A21]/60"
            >
                <ThemeLayout />
            </ViewMenu>
        </>
    );
};

export { ThemeContent };
