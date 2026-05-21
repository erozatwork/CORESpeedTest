function path(root, sublink) {
  return `${root}${sublink}`;
}

/*
 * Use this code inside the <Navigate> component to handle asynchronous loading
 * and navigate to the dashboard after the component has finished loading.
 *
 * Example usage:
 * <Navigate to={PATH_DASHBOARD.dashboard} />
 *
 * -- View: Elements.js
 */

const ROOT_PATH = "/";

export const PATH_DASHBOARD = {
  root: ROOT_PATH,
  dashboard: path(ROOT_PATH, "dashboard"),
};

// FIXED AND PUBLIC PAGES/ROUTES

export const PATH_LANDING_PAGE = {
  root: ROOT_PATH,
  core_components: path(ROOT_PATH, "core/components"),
};

export const PATH_ACCESS_DENIED = {
  root: ROOT_PATH,
  access_denied: path(ROOT_PATH, "error/403"),
  not_found: path(ROOT_PATH, "error/404"),
};

export const PATH_PAGE_REDIRECTION = {
  root: ROOT_PATH,
};
