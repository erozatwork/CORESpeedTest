import { PATH_DASHBOARD } from "@shared/routing";
export const {
  VITE_BASE_URL,
  VITE_SOCKET_URL,
  VITE_STAGING_API,
  VITE_DEVELOPMENT_API,
  VITE_API_KEY,
} = import.meta.env;

export const config = {
  API_URL:
    import.meta.env.MODE === "development"
      ? VITE_DEVELOPMENT_API
      : VITE_STAGING_API,
};

export const HOST_API_KEY = VITE_API_KEY;

export const PATH_AFTER_LOGIN = PATH_DASHBOARD.dashboard;

/** Authentication APIs & Menus */

export const { VITE_VERIFY_TOKEN, VITE_LOGIN, VITE_MENU_LIST, VITE_PATH_LIST } =
  import.meta.env;

export const AUTH_APIs = {
  VERIFY: {
    TOKEN: VITE_VERIFY_TOKEN,
  },
  LOGIN: {
    AUTH: VITE_LOGIN,
  },
};

export const PATH_APIs = {
  MENU: {
    LIST: VITE_MENU_LIST,
  },
  PATH: {
    LIST: VITE_PATH_LIST,
  },
};

/** Socket Connection */

export const PATH_WEB_SOCKET = {
  PATH: VITE_SOCKET_URL,
};
