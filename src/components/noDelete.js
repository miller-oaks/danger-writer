export const NO_DELETE_KEY = "mdwa.no-deleting";

export function readNoDelete() {
  try {
    return window.localStorage.getItem(NO_DELETE_KEY) === "true";
  } catch (err) {
    return false;
  }
}

export function writeNoDelete(on) {
  try {
    window.localStorage.setItem(NO_DELETE_KEY, on ? "true" : "false");
  } catch (err) {
    // Ignore storage failures. The choice still applies to this view.
  }
  return !!on;
}

export function preservesText(previous, next) {
  let index = 0;
  for (const char of next) {
    if (char === previous[index]) index += 1;
  }
  return index === previous.length;
}
