/**
 * One share entry point for the website and the Android app.
 *
 * Two different bugs were being papered over by the "fall back to clipboard"
 * branch at every call site, and neither is obvious:
 *
 * 1. ANDROID APP — `navigator.share` DOES NOT EXIST in an Android WebView. The
 *    Web Share API is a Chrome-the-browser feature, not a WebView feature. So
 *    every `if (navigator.share)` check was simply false in the app and users
 *    only ever got a clipboard copy. The fix is @capacitor/share, which fires
 *    the real Android share intent.
 *
 * 2. MOBILE WEB — `navigator.share()` must be called while a *transient user
 *    activation* is still live, i.e. synchronously within the click. Any
 *    `await` first spends it and Chrome throws NotAllowedError. The daily card
 *    awaited `document.fonts.ready` and a 1080x1080 canvas render before
 *    sharing, so the first tap always failed. `navigator.clipboard.writeText`
 *    has the same requirement, which is why the fallback in the catch block
 *    often did nothing either.
 *
 * Hence the shape below: `share()` is deliberately NOT an async function. On
 * web it reaches `navigator.share(...)` synchronously. Anything expensive — like
 * rendering the share image — must be done BEFORE the click and passed in as
 * `file`.
 */
import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();

/** Blob -> base64 payload for Filesystem.writeFile (which takes a string). */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.readAsDataURL(blob);
  });
}

/**
 * Native path. Awaits freely — Android's share intent has no user-activation
 * requirement, so the web restriction simply does not apply here.
 */
async function shareNative({ title, text, url, file, dialogTitle }) {
  const { Share } = await import('@capacitor/share');

  if (file) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const name = file.name || `herd-${Date.now()}.png`;
      // Cache, not Documents: this is a transient artefact for the share sheet,
      // and Android reclaims Cache automatically. Writing to Documents would
      // quietly grow the app's storage every time someone shares.
      await Filesystem.writeFile({
        path: name,
        data: await blobToBase64(file),
        directory: Directory.Cache,
      });
      const { uri } = await Filesystem.getUri({ path: name, directory: Directory.Cache });
      await Share.share({ title, text, url, files: [uri], dialogTitle });
      return { ok: true, via: 'native-file' };
    } catch (err) {
      // Fall through to a text share rather than failing outright — losing the
      // image is much better than losing the share.
      console.warn('[share] native file share failed, sending text:', err?.message || err);
    }
  }

  await Share.share({ title, text, url, dialogTitle });
  return { ok: true, via: 'native' };
}

/** Last resort on both platforms. */
async function copyFallback(value) {
  if (!value) return { ok: false, via: 'none' };
  if (isNative()) {
    try {
      const { Clipboard } = await import('@capacitor/clipboard');
      await Clipboard.write({ string: value });
      return { ok: true, via: 'clipboard' };
    } catch { /* fall through to the web API */ }
  }
  try {
    await navigator.clipboard.writeText(value);
    return { ok: true, via: 'clipboard' };
  } catch {
    return { ok: false, via: 'none' };
  }
}

/**
 * Share something. Returns a promise resolving to { ok, via }, where `via` is
 * 'native' | 'native-file' | 'web' | 'web-file' | 'clipboard' | 'none'.
 * `via === 'clipboard'` is the caller's cue to show a "copied!" confirmation.
 *
 * NOT async by design — see the note at the top of this file. Do not add an
 * `await` before the navigator.share calls below or web sharing breaks again.
 *
 * @param {object}  opts
 * @param {string} [opts.title]
 * @param {string} [opts.text]
 * @param {string} [opts.url]
 * @param {File}   [opts.file]  Must already be built. Never build it in the handler.
 * @param {string} [opts.dialogTitle] Android chooser title.
 */
export function share({ title, text, url, file, dialogTitle } = {}) {
  const copyValue = url || text;

  if (isNative()) {
    return shareNative({ title, text, url, file, dialogTitle })
      .catch(async (err) => {
        // The user dismissing the Android sheet surfaces as an error; that is
        // not a failure and must not trigger a surprise clipboard write.
        if (isDismissal(err)) return { ok: true, via: 'dismissed' };
        console.warn('[share] native share failed:', err?.message || err);
        return copyFallback(copyValue);
      });
  }

  // ---- web: everything below must stay synchronous up to navigator.share ----
  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], text, title })
        .then(() => ({ ok: true, via: 'web-file' }))
        .catch((err) => (isDismissal(err) ? { ok: true, via: 'dismissed' } : copyFallback(copyValue)));
    }
    if (navigator.share) {
      return navigator.share({ title, text, url })
        .then(() => ({ ok: true, via: 'web' }))
        .catch((err) => (isDismissal(err) ? { ok: true, via: 'dismissed' } : copyFallback(copyValue)));
    }
  } catch (err) {
    // navigator.share can throw synchronously on a malformed payload.
    console.warn('[share] web share threw:', err?.message || err);
  }

  return copyFallback(copyValue);
}

function isDismissal(err) {
  const name = err?.name || '';
  const msg = String(err?.message || err || '');
  return name === 'AbortError' || /abort|cancel|dismiss/i.test(msg);
}

/** True where a real share sheet exists, so UI can label the button honestly. */
export function hasShareSheet() {
  return isNative() || (typeof navigator !== 'undefined' && !!navigator.share);
}

/**
 * Copy text to the clipboard. Resolves true on success.
 *
 * Worth going through Capacitor in the app: `navigator.clipboard` is patchy in
 * an Android WebView, and when it fails it rejects silently, so the UI shows
 * "copied!" for something that was never copied.
 */
export async function copyText(value) {
  if (!value) return false;
  const res = await copyFallback(value);
  return res.ok;
}

/**
 * Save an image the user asked to keep.
 *
 * The web trick — an <a download> pointed at a blob: URL — does NOTHING in an
 * Android WebView. A WebView has no download manager attached unless the host
 * app registers a DownloadListener, which Capacitor does not, so the click is
 * swallowed with no error and no file. That is why "download image" appeared to
 * do nothing in the app.
 *
 * Native path writes the bytes through Filesystem instead. If scoped storage
 * refuses the write, it falls back to the share sheet, whose "Save to Files" and
 * Photos targets get the user to the same place.
 *
 * Returns { ok, via } where via is 'download' | 'file' | 'share' | 'none'.
 */
export async function saveImage(file) {
  if (!file) return { ok: false, via: 'none' };

  if (isNative()) {
    const name = file.name || `herd-${Date.now()}.png`;
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const data = await blobToBase64(file);
      await Filesystem.writeFile({ path: name, data, directory: Directory.Documents, recursive: true });
      const { uri } = await Filesystem.getUri({ path: name, directory: Directory.Documents });
      return { ok: true, via: 'file', uri, name };
    } catch (err) {
      console.warn('[share] filesystem save failed, offering the share sheet:', err?.message || err);
      try {
        await shareNative({ title: 'Daily Herd', file, dialogTitle: 'Save image' });
        return { ok: true, via: 'share' };
      } catch {
        return { ok: false, via: 'none' };
      }
    }
  }

  try {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'herd.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return { ok: true, via: 'download' };
  } catch (err) {
    console.warn('[share] download failed:', err?.message || err);
    return { ok: false, via: 'none' };
  }
}
