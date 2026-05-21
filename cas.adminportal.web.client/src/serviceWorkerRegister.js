import { registerSW } from 'virtual:pwa-register';

/**
 * Registers the service worker and sets up periodic update checks.
 * @param {Object} options - Registration options.
 * @param {number} options.period - Interval in milliseconds to check for updates.
 */
export const serviceWorkerRegister = (options = {}) => {
  const { period = 3600000 } = options;

  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        console.log('New content available, please refresh.');
        // In autoUpdate mode, the service worker usually handles the skipWaiting.
        // You can add a toast notification here if desired.
      },
      onOfflineReady() {
        console.log('App is ready to work offline.');
      },
      onRegisterError(error) {
        console.error('Service worker registration failed:', error);
      },
    });

    if (period > 0) {
      setInterval(() => {
        updateSW(true);
      }, period);
    }

    return updateSW;
  }
};
