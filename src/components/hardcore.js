// Hardcore is one on/off switch. On means the whole current word stays visible
// and everything else is blurred. Letter mode is gone.
//
// Missing, empty, and the old three-way values ("word", "letter") are off.
// Only an explicit true / "true" / "1" / "on" turns it on, so a saved
// three-way choice cannot force Hardcore back on. hardcore=true is the
// on value in the URL.

export function parseHardcore(value) {
  if (value === true) return true;
  if (value === false || value == null || value === "") return false;
  switch (String(value).toLowerCase()) {
    case "true":
    case "1":
    case "on":
      return true;
    default:
      return false;
  }
}

export function isHardcore(level) {
  return parseHardcore(level);
}

export function hardcoreQuery(level) {
  return isHardcore(level) ? "&hardcore=true" : "";
}

export function currentWord(text) {
  const match = String(text || "").match(/\S*$/);
  return match ? match[0] : "";
}
