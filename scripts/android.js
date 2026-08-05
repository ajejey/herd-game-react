#!/usr/bin/env node
/**
 * Runs a Gradle task for the Capacitor Android project without Android Studio.
 *
 * Studio is only ever a GUI over three things: a JDK, the Android SDK, and
 * Gradle. Gradle ships with the project (gradlew), so all this script does is
 * point Gradle at a JDK 21 and an SDK, then get out of the way.
 *
 * Paths resolve from env first so a CI runner (which sets JAVA_HOME and
 * ANDROID_HOME itself) needs no changes:
 *   HERD_JDK_HOME / JAVA_HOME   -> JDK 21+ (Capacitor 8 requires 21)
 *   ANDROID_HOME / ANDROID_SDK_ROOT -> Android SDK with platform 36
 *
 * Usage: node scripts/android.js <gradleTask>
 *   node scripts/android.js assembleDebug   -> app-debug.apk  (sideload/testing)
 *   node scripts/android.js bundleRelease   -> app-release.aab (Play upload)
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ANDROID_DIR = path.join(__dirname, '..', 'android');
const IS_WIN = process.platform === 'win32';

// Local fallbacks for this machine, used only when nothing is set in the env.
const DEFAULT_JDK = 'C:\\Users\\user\\dev-tools\\jdk21';
const DEFAULT_SDK = 'C:\\Users\\user\\dev-tools\\android-sdk';

function resolveJdk() {
  const candidates = [process.env.HERD_JDK_HOME, process.env.JAVA_HOME, DEFAULT_JDK];
  for (const dir of candidates) {
    if (!dir) continue;
    const javac = path.join(dir, 'bin', IS_WIN ? 'javac.exe' : 'javac');
    if (!fs.existsSync(javac)) continue;
    // JAVA_HOME on this box points at a JDK 13, which AGP 8.x rejects with a
    // confusing "Unsupported class file major version". Check the version here
    // so the failure is legible instead of surfacing 200 lines into Gradle.
    const out = spawnSync(javac, ['-version'], { encoding: 'utf8' });
    const raw = `${out.stdout || ''}${out.stderr || ''}`;
    const major = parseInt((raw.match(/javac (\d+)/) || [])[1], 10);
    if (major >= 21) return dir;
    console.warn(`  skipping ${dir} (javac ${major}, need 21+)`);
  }
  return null;
}

function resolveSdk() {
  for (const dir of [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT, DEFAULT_SDK]) {
    if (dir && fs.existsSync(path.join(dir, 'platform-tools'))) return dir;
  }
  return null;
}

const task = process.argv[2];
if (!task) {
  console.error('Usage: node scripts/android.js <gradleTask>');
  process.exit(1);
}

const jdk = resolveJdk();
const sdk = resolveSdk();

if (!jdk || !sdk) {
  console.error('\nAndroid toolchain not found.\n');
  if (!jdk) console.error('  JDK 21+  : not found. Set HERD_JDK_HOME or install to ' + DEFAULT_JDK);
  if (!sdk) console.error('  Android SDK: not found. Set ANDROID_HOME or install to ' + DEFAULT_SDK);
  console.error('\nSee ANDROID_BUILD.md for the no-Android-Studio setup.\n');
  process.exit(1);
}

// Gradle reads the SDK location from local.properties. It is gitignored, so
// regenerate it every run rather than expecting it to exist.
fs.writeFileSync(
  path.join(ANDROID_DIR, 'local.properties'),
  `sdk.dir=${sdk.replace(/\\/g, '\\\\')}\n`
);

console.log(`JDK : ${jdk}`);
console.log(`SDK : ${sdk}`);
console.log(`Task: ${task}\n`);

const gradlew = path.join(ANDROID_DIR, IS_WIN ? 'gradlew.bat' : 'gradlew');
// Node refuses to spawn .bat without a shell, and cmd.exe splits the command on
// spaces - which breaks on any path like "F:\Web Dev Projects\...". Quoting the
// executable is the fix; without it Gradle never starts and cmd blames "F:\Web".
const result = spawnSync(IS_WIN ? `"${gradlew}"` : gradlew, [task], {
  cwd: ANDROID_DIR,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, JAVA_HOME: jdk, ANDROID_HOME: sdk, ANDROID_SDK_ROOT: sdk },
});

if (result.status !== 0) process.exit(result.status ?? 1);

const artifacts = {
  assembleDebug: 'app/build/outputs/apk/debug/app-debug.apk',
  assembleRelease: 'app/build/outputs/apk/release/app-release.apk',
  bundleRelease: 'app/build/outputs/bundle/release/app-release.aab',
};
if (artifacts[task]) {
  const out = path.join(ANDROID_DIR, artifacts[task]);
  if (fs.existsSync(out)) {
    const mb = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
    console.log(`\nBuilt: ${out}  (${mb} MB)`);
  }
}
