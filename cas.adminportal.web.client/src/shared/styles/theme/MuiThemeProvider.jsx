import {
    createTheme,
    ThemeProvider as Provider,
    CssBaseline,
    GlobalStyles,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export const MuiThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDark ? "dark" : "light",
                },
                components: {
                    MuiOutlinedInput: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                minHeight: 40,
                                backgroundColor: isDark ? "#1C252E" : undefined,
                                color: isDark ? "#ffffff" : undefined,
                                boxShadow: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: isDark
                                            ? "#ffffff"
                                            : "#000000",
                                    },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: isDark ? "#ffffff" : "#000000",
                                },
                            },
                            notchedOutline: {
                                borderColor: isDark ? "#2A2F36" : undefined,
                            },
                            input: {
                                color: isDark ? "#ffffff" : undefined,
                                WebkitTextFillColor: isDark
                                    ? "#ffffff"
                                    : undefined,
                            },
                        },
                    },

                    MuiPickersOutlinedInput: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                minHeight: 40,
                                backgroundColor: isDark ? "#1C252E" : undefined,
                                color: isDark ? "#ffffff" : undefined,
                                boxShadow: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: "#ffffff",
                                    },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: isDark ? "#ffffff" : undefined,
                                },
                            },
                            notchedOutline: {
                                borderColor: isDark ? "#2A2F36" : undefined,
                            },
                            input: {
                                color: isDark ? "#ffffff" : undefined,
                                WebkitTextFillColor: isDark
                                    ? "#ffffff"
                                    : undefined,
                            },
                        },
                    },

                    MuiPickersInputBase: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                color: isDark ? "#ffffff" : undefined,
                            },
                            input: {
                                color: isDark ? "#ffffff" : undefined,
                                WebkitTextFillColor: isDark
                                    ? "#ffffff"
                                    : undefined,
                            },
                        },
                    },

                    MuiPickersPopper: {
                        styleOverrides: {
                            paper: {
                                backgroundColor: isDark ? "#1E293B" : "#ffffff",
                                color: isDark ? "#ffffff" : "#000000",
                                borderRadius: 8,
                                overflow: "hidden",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                            },
                        },
                    },

                    MuiPickersDay: {
                        styleOverrides: {
                            root: {
                                color: isDark ? "#ffffff" : "#000000",
                                "&.Mui-selected": {
                                    backgroundColor: isDark
                                        ? "#2563eb"
                                        : "#1976d2",
                                    color: "#ffffff",
                                },
                                "&:hover": {
                                    backgroundColor: isDark
                                        ? "#2d4ea0"
                                        : "#e0e0e0",
                                },
                                "&.MuiPickersDay-today": {
                                    border: "none",
                                    backgroundColor: isDark
                                        ? "#1E293B"
                                        : "#e3f2fd",
                                },
                            },
                        },
                    },

                    // ⬇️ Day labels (SMTWTFS)
                    MuiDayCalendar: {
                        styleOverrides: {
                            weekDayLabel: {
                                color: isDark ? "#aaaaaa" : "#666666",
                            },
                        },
                    },

                    // ⬇️ Header (Month/Year & Arrows)
                    MuiPickersCalendarHeader: {
                        styleOverrides: {
                            label: {
                                color: isDark ? "#ffffff" : "#000000",
                                fontWeight: 500,
                            },
                            switchViewButton: {
                                color: isDark ? "#ffffff" : "#000000",
                            },
                            iconButton: {
                                color: isDark ? "#ffffff" : "#000000",
                            },
                        },
                    },

                    // ⬇️ Select icon
                    MuiSelect: {
                        styleOverrides: {
                            icon: {
                                color: isDark ? "#ffffff" : undefined,
                            },
                        },
                    },

                    // ⬇️ Autocomplete
                    MuiAutocomplete: {
                        styleOverrides: {
                            inputRoot: {
                                color: isDark ? "#ffffff" : undefined,
                            },
                            paper: {
                                backgroundColor: isDark ? "#1C252E" : "#ffffff",
                                color: isDark ? "#ffffff" : "#000000",
                                borderRadius: 8,
                            },
                            tag: {
                                backgroundColor: isDark ? "#2A2F36" : undefined,
                                color: isDark ? "#ffffff" : undefined,
                            },
                            noOptions: {
                                color: isDark ? "#ffffff" : undefined,
                            },
                        },
                    },
                },
            }),
        [isDark]
    );

    return (
        <Provider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    "::selection": {
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                    },
                    ".dark ::selection": {
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                    },
                    "input:focus": {
                        outline: "none !important",
                        boxShadow: "none !important",
                    },
                    ".MuiOutlinedInput-root:focus-within": {
                        boxShadow: "none !important",
                    },
                }}
            />
            {children}
        </Provider>
    );
};
