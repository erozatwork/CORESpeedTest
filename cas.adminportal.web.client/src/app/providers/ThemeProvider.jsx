import { useEffect } from "react";
import { useSettings } from "./SettingsProvider";
import { MuiThemeProvider } from "@shared/styles/theme/MuiThemeProvider";

const ThemeProvider = ({ children }) => {
    const { settings } = useSettings();

    useEffect(() => {
        const html = document.documentElement;

        const {
            themeMode = "light",
            themeColor = "red",
            themeLayout = "horizontal",
        } = settings;

        html.classList.remove("light", "dark");

        html.classList.remove("horizontal", "mini");

        html.classList.remove(
            ...["red", "blue", "violet"].map((c) => `theme-${c}`)
        );

        html.classList.add(themeMode);
        html.classList.add(themeLayout);
        html.classList.add(`theme-${themeColor}`);
    }, [settings.themeMode, settings.themeColor, settings.themeLayout]);

    return (
        <>
            <MuiThemeProvider>{children}</MuiThemeProvider>
        </>
    );
};

export { ThemeProvider };
