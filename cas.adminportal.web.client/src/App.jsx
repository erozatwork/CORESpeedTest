import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Auth
import { AuthProvider } from "./features/auth/jwtContext";

import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  PathnameProvider,
  QueryProvider,
  RouteProvider,
  SettingsProvider,
  ThemeProvider,
} from "@app/providers";

import { Toaster } from "sonner";

import Router from "./app/routes";
import { TooltipProvider } from "@shared/components";

const { BASE_URL } = import.meta.env;

import { serviceWorkerRegister } from "./serviceWorkerRegister";
import { MuiThemeProvider } from "./shared/styles/theme/MuiThemeProvider";

const App = () => {
  return (
    <>
      <AuthProvider>
        <QueryProvider>
          <SettingsProvider>
            <HelmetProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <LayoutProvider>
                  <LoadersProvider>
                    <MenusProvider>
                      <ThemeProvider>
                        <TooltipProvider>
                          <BrowserRouter
                            basename={BASE_URL}
                            future={{
                              v7_relativeSplatPath: true,
                              v7_startTransition: true,
                            }}
                          >
                            <PathnameProvider>
                              <RouteProvider>
                                <Toaster
                                  richColors
                                  expand={true}
                                  position="top-right"
                                />
                                <Router />
                              </RouteProvider>
                            </PathnameProvider>
                          </BrowserRouter>
                        </TooltipProvider>
                      </ThemeProvider>
                    </MenusProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </LocalizationProvider>
            </HelmetProvider>
          </SettingsProvider>
        </QueryProvider>
      </AuthProvider>
    </>
  );
};

serviceWorkerRegister({ period: 3600000 }); // checks every hour

export { App };
