// Exaxmples of usage:
// 1. In a background image: <div style={{backgroundImage: `url('${toAbsoluteUrl('/media/misc/pattern-1.jpg')}')`}}>...
// 2. In img tag: <img src={toAbsoluteUrl('/media/avatars/300-2.jpg')} />

// config
import { VITE_BASE_URL } from "@shared/config/api.config";

const toAbsoluteUrl = pathname => {
  const baseUrl = VITE_BASE_URL;
  // import.meta.env.VITE_BASE_URL; 
  if (baseUrl && baseUrl !== '/') {
    return VITE_BASE_URL+ pathname;
  } else {
    return pathname;
  }
};
export { toAbsoluteUrl };