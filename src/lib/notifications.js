/**
 * Notifications for the native app. Every export is a no-op on the web, so
 * callers never need their own platform checks.
 *
 * Two independent mechanisms, deliberately:
 *
 *   LOCAL  — the daily reminder. Scheduled on the device, repeating, needs no
 *            server, no Firebase, and works with no connection. The daily drop
 *            happens at a known time, so nothing has to be pushed for it.
 *   PUSH   — event-driven things the device cannot know in advance: someone
 *            joined your room, the herd result is in. Needs Firebase.
 *
 * The split matters because it means daily reminders work before any Firebase
 * project exists, and keep working if push delivery is throttled or the token
 * goes stale.
 */
import { Capacitor } from '@capacitor/core';

const native = () => Capacitor.isNativePlatform();

const PREF_KEY = 'herd.reminder.v1';
const DAILY_REMINDER_ID = 1001;

// Read the saved reminder preference. Shape: { enabled, hour, minute }.
export function getReminderPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return { enabled: false, hour: 9, minute: 0 };
    const p = JSON.parse(raw);
    return {
      enabled: !!p.enabled,
      hour: Number.isInteger(p.hour) ? p.hour : 9,
      minute: Number.isInteger(p.minute) ? p.minute : 0,
    };
  } catch {
    return { enabled: false, hour: 9, minute: 0 };
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode / quota — the schedule still applies for this install */
  }
}

/** True only where we can actually deliver a notification. */
export function notificationsAvailable() {
  return native();
}

/**
 * Android 8+ refuses to show a notification that has no channel, and the
 * channel's importance is fixed at creation — it cannot be raised later, only
 * lowered by the user. Create it before the first schedule so the reminder
 * arrives with sound rather than silently in the shade.
 */
let channelReady = null;
function ensureChannel() {
  if (!native()) return Promise.resolve();
  if (channelReady) return channelReady;
  channelReady = (async () => {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.createChannel({
        id: 'herd_daily',
        name: 'Daily games',
        description: "A nudge when the day's new games are live",
        importance: 4, // HIGH — shows a heads-up banner
        visibility: 1, // public on the lock screen
        lights: true,
        lightColor: '#3D8B5A',
        vibration: true,
      });
    } catch (err) {
      // createChannel is Android-only and absent elsewhere; not fatal.
      console.warn('[notifications] channel setup skipped:', err?.message || err);
    }
  })();
  return channelReady;
}

/**
 * Ask for permission. Android 13+ requires the runtime POST_NOTIFICATIONS
 * grant; below that it is implicit and this resolves immediately.
 */
export async function requestReminderPermission() {
  if (!native()) return false;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    let status = await LocalNotifications.checkPermissions();
    if (status.display !== 'granted') {
      status = await LocalNotifications.requestPermissions();
    }
    return status.display === 'granted';
  } catch (err) {
    console.warn('[notifications] permission request failed:', err?.message || err);
    return false;
  }
}

/**
 * Schedule (or reschedule) the repeating daily reminder. Cancels first so the
 * user changing their time does not leave the old one armed — `on` with a fixed
 * id replaces, but cancelling makes that explicit and survives plugin changes.
 */
export async function scheduleDailyReminder(hour, minute) {
  if (!native()) return false;
  const granted = await requestReminderPermission();
  if (!granted) return false;

  const notification = (allowWhileIdle) => ({
    id: DAILY_REMINDER_ID,
    title: "Today's Herd games are live",
    body: 'A new Daily Herd, Trivia, Hot Takes and Aura are waiting.',
    // `on` without a day/month field repeats every day at this time.
    schedule: { on: { hour, minute }, allowWhileIdle },
    channelId: 'herd_daily',
    smallIcon: 'ic_stat_herd',
    extra: { route: '/daily' },
  });

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await ensureChannel();
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });

    try {
      await LocalNotifications.schedule({ notifications: [notification(true)] });
    } catch (exactErr) {
      // allowWhileIdle asks for an exact alarm, which needs SCHEDULE_EXACT_ALARM
      // on Android 12+ and can be refused. Without this fallback the refusal
      // takes the whole reminder down and the user gets nothing at all. An
      // inexact alarm may drift by a few minutes, which is irrelevant for a
      // "your daily game is ready" nudge.
      console.warn('[notifications] exact alarm unavailable, using inexact:', exactErr?.message || exactErr);
      await LocalNotifications.schedule({ notifications: [notification(false)] });
    }

    savePrefs({ enabled: true, hour, minute });
    return true;
  } catch (err) {
    console.warn('[notifications] schedule failed:', err?.message || err);
    return false;
  }
}

export async function cancelDailyReminder() {
  const prefs = getReminderPrefs();
  savePrefs({ ...prefs, enabled: false });
  if (!native()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
  } catch (err) {
    console.warn('[notifications] cancel failed:', err?.message || err);
  }
}

/**
 * Re-arm the reminder on launch.
 *
 * Android drops all scheduled alarms when the app is force-stopped or the
 * device reboots, so a reminder set once would quietly stop firing after the
 * first reboot. Rescheduling on every launch is cheap and makes it durable.
 */
export async function restoreDailyReminder() {
  if (!native()) return;
  const prefs = getReminderPrefs();
  if (!prefs.enabled) return;
  await scheduleDailyReminder(prefs.hour, prefs.minute);
}

/** Fired when the user taps a notification — used to deep link to the game. */
export async function onNotificationTap(handler) {
  if (!native()) return;
  try {
    const [{ LocalNotifications }, { PushNotifications }] = await Promise.all([
      import('@capacitor/local-notifications'),
      import('@capacitor/push-notifications'),
    ]);
    LocalNotifications.addListener('localNotificationActionPerformed', (e) => {
      handler(e?.notification?.extra?.route || '/daily');
    });
    PushNotifications.addListener('pushNotificationActionPerformed', (e) => {
      handler(e?.notification?.data?.route || '/daily');
    });
  } catch (err) {
    console.warn('[notifications] tap listener failed:', err?.message || err);
  }
}
