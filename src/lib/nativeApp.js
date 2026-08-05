/**
 * Native-app bootstrap. No-op on the web build.
 *
 * Everything here is guarded on Capacitor.isNativePlatform(), so the web bundle
 * pays only the cost of the import — the plugins never initialise in a browser.
 *
 * External links need no handling: Capacitor's WebViewClient already sends any
 * URL outside the app's own origin (and outside server.allowNavigation) to the
 * system browser via an Intent. Adding our own interceptor would double-open.
 */
import { Capacitor } from '@capacitor/core';

export function initNativeApp() {
  if (!Capacitor.isNativePlatform()) return;

  // Lets CSS hide web-only chrome (ad slots, "add to home screen" prompts)
  // with a plain `body.native-app .foo { display: none }`.
  document.body.classList.add('native-app');

  // Each plugin is imported lazily and failures are swallowed per-plugin. A
  // missing or broken plugin must never take the whole app down on launch —
  // the same crash-isolation rule the game engine follows.
  const safely = (label, fn) =>
    fn().catch((err) => console.warn(`[native] ${label} failed:`, err?.message || err));

  safely('statusBar', async () => {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Brand green from the live components (Navigation.js), not the stale
    // purple #6D28D9 still sitting in manifest.json / the theme-color meta.
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#3D8B5A' });
  });

  safely('backButton', async () => {
    const { App } = await import('@capacitor/app');
    App.addListener('backButton', ({ canGoBack }) => {
      // Without this listener Android's back button kills the app from any
      // screen, which reads as a crash. Walk the SPA history instead, and only
      // exit from the entry screen.
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  });

  safely('splashScreen', async () => {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    // launchAutoHide is on in capacitor.config.json as a backstop; hiding here
    // as soon as React has painted avoids a visible gap on fast devices.
    await SplashScreen.hide();
  });

  safely('reminders', async () => {
    const { restoreDailyReminder, onNotificationTap } = await import('./notifications');
    // Android clears scheduled alarms on reboot and on force-stop, so a
    // reminder set once would silently stop firing. Re-arm every launch.
    await restoreDailyReminder();

    onNotificationTap((route) => {
      // History API rather than the router: this fires from outside React and
      // the router is not guaranteed to be mounted yet on a cold start.
      if (route && window.location.pathname !== route) {
        window.history.pushState({}, '', route);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
  });

  safely('pushToken', async () => {
    const { refreshPushToken } = await import('./pushRegistration');
    // Only re-registers if the user already opted in; never prompts on launch.
    await refreshPushToken();
  });
}

/**
 * Short haptic tap. Safe to call from anywhere — silently does nothing on web,
 * so game components don't need their own platform checks.
 */
export async function tapFeedback() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* haptics are a nicety, never worth surfacing an error for */
  }
}
