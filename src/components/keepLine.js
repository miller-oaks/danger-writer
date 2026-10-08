export const KEEP_LINE_KEY = "mdwa.keep-line-at-top";

export function readKeepLine() {
  try {
    return window.localStorage.getItem(KEEP_LINE_KEY) === "true";
  } catch (err) {
    return false;
  }
}

export function writeKeepLine(on) {
  try {
    window.localStorage.setItem(KEEP_LINE_KEY, on ? "true" : "false");
  } catch (err) {
    // Ignore storage failures. The choice still applies to this view.
  }
  return !!on;
}
