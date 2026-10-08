export const HARDCORE_LEVELS = [
  { id: "off", label: "Off" },
  { id: "letter", label: "Letter" },
  { id: "word", label: "Word" },
];

// Upstream default. personalize may change this one constant.
export const DEFAULT_HARDCORE = "off";

export function parseHardcore(value) {
  if (value === true) return "letter";
  if (value === false) return "off";
  if (value == null || value === "") return DEFAULT_HARDCORE;
  switch (String(value).toLowerCase()) {
    case "word":
      return "word";
    case "true":
    case "1":
    case "letter":
      return "letter";
    case "false":
    case "0":
    case "off":
      return "off";
    default:
      return DEFAULT_HARDCORE;
  }
}

export function isHardcore(level) {
  return level === "letter" || level === "word" || level === true;
}

export function hardcoreQuery(level) {
  const parsed = parseHardcore(level);
  if (parsed === "word") return "&hardcore=word";
  if (parsed === "letter") return "&hardcore=true";
  return "";
}

export function currentWord(text) {
  const match = String(text || "").match(/\S*$/);
  return match ? match[0] : "";
}
