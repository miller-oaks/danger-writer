export const REVEAL_AUTOMATIC = "automatic";
export const REVEAL_DONE = "done";

// Upstream default. personalize may change this one constant.
export const DEFAULT_REVEAL = REVEAL_AUTOMATIC;

export const REVEAL_STORAGE_KEY = "mdwa.reveal-at-end";

export function parseReveal(value) {
  return value === REVEAL_DONE ? REVEAL_DONE : REVEAL_AUTOMATIC;
}

export function readReveal() {
  try {
    const stored = window.localStorage.getItem(REVEAL_STORAGE_KEY);
    if (stored === REVEAL_DONE || stored === REVEAL_AUTOMATIC) return stored;
  } catch (err) {
    // Private mode can throw. Fall through to the default.
  }
  return DEFAULT_REVEAL;
}

export function writeReveal(value) {
  const next = parseReveal(value);
  try {
    window.localStorage.setItem(REVEAL_STORAGE_KEY, next);
  } catch (err) {
    // Ignore storage failures and still use the choice for this view.
  }
  return next;
}
