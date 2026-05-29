// utils
import axios from "@shared/utils/axios";

export function jwtDecode(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert("Token expired");

    localStorage.removeItem("accessToken");

    window.location.href = "https://system.onecoredevit.com/cas/app/auth";
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    localStorage.removeItem("accessToken");

    delete axios.defaults.headers.common.Authorization;
  }
};

export const setUserSession = (user) => {
  if (user) {
    localStorage.setItem("no", user);
  } else {
    localStorage.removeItem("user");
  }
};

//  temporary bypass
export const GETSESSION = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  return `Bearer ${accessToken}`;
};

export const GETPERMISSION = () => {
  const token = localStorage.getItem("accessToken");

  const isTokenVerified = isValidToken(token);

  if (!isTokenVerified) {
    return false;
  }

  const decoded = jwtDecode(token);
  const result = decoded.permissions.split(",");

  const permission = {
    nameid: decoded.nameid,
    permission: result,
  };

  return { permission };
};
