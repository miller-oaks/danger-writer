import { hardcoreQuery, isHardcore, parseHardcore } from "./hardcore";

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

function lengthLabel(item) {
  if (item.type === "none") return "No limit";
  if (item.type === "words") return `${item.limit} ${item.limit === 1 ? "word" : "words"}`;
  if (item.type === "minutes") return `${item.limit} ${item.limit === 1 ? "minute" : "minutes"}`;
  return `${item.limit} ${item.type}`;
}

export function sessionLabel(setup) {
  const item = normalizeSetup(setup);
  const length = lengthLabel(item);
  return isHardcore(item.hardcore) ? `${length} · Hardcore` : length;
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
    const sessionsOut = sessions.slice(0, 3);
    const stale = parsed.some((setup) => setup && setup.hardcore != null && typeof setup.hardcore !== "boolean");
    if (stale) {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(sessionsOut));
      } catch (err) {
        // Ignore storage failures. The in-memory list is already off unless explicitly on.
      }
    }
    return sessionsOut;
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
