import { hardcoreQuery, parseHardcore } from "./hardcore";

const KEY = "mdwa.recent-sessions";

export function normalizeSetup(setup) {
  const type = setup && setup.type === "none" ? "none" : setup && setup.type === "words" ? "words" : "minutes";
  return {
    type,
    limit: type === "none" ? 0 : Number(setup && setup.limit) || 5,
    hardcore: parseHardcore(setup && setup.hardcore),
  };
}

export function sessionKey(setup) {
  const item = normalizeSetup(setup);
  return `${item.type}:${item.limit}:${item.hardcore}`;
}

export function sessionSearch(setup) {
  const item = normalizeSetup(setup);
  const base = item.type === "none" ? "?type=none" : `?limit=${item.limit}&type=${item.type}`;
  return base + hardcoreQuery(item.hardcore);
}

export function sessionLabel(setup) {
  const item = normalizeSetup(setup);
  const length = item.type === "none" ? "No limit" : `${item.limit} ${item.type}`;
  if (item.hardcore === "letter") return `${length} · Letter`;
  if (item.hardcore === "word") return `${length} · Word`;
  return length;
}

export function readRecentSessions() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    const seen = new Set();
    const sessions = [];
    parsed.forEach((setup) => {
      const item = normalizeSetup(setup);
      const key = sessionKey(item);
      if (seen.has(key)) return;
      seen.add(key);
      sessions.push(item);
    });
    return sessions.slice(0, 3);
  } catch (err) {
    return [];
  }
}

export function rememberSession(setup) {
  const next = normalizeSetup(setup);
  const key = sessionKey(next);
  const recent = [next, ...readRecentSessions().filter((item) => sessionKey(item) !== key)].slice(0, 3);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(recent));
  } catch (err) {
    // Ignore storage failures.
  }
  return recent;
}
