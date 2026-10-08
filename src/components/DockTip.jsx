import React, { useState } from "react";

const DISMISS_KEY = "mdwa.dock-tip-dismissed";

export function shouldShowDockTip() {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const safariMac =
    /Macintosh/.test(ua) &&
    /Safari\//.test(ua) &&
    !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|Firefox/.test(ua) &&
    (navigator.maxTouchPoints || 0) <= 1;
  if (!safariMac) return false;
  const standalone =
    window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
  if (standalone) return false;
  try {
    if (window.localStorage.getItem(DISMISS_KEY) === "true") return false;
  } catch (err) {
    return true;
  }
  return true;
}

export function dismissDockTip() {
  try {
    window.localStorage.setItem(DISMISS_KEY, "true");
  } catch (err) {
    // The note still closes for this view.
  }
}

export default function DockTip() {
  const [visible, setVisible] = useState(shouldShowDockTip);
  if (!visible) return null;

  function dismiss() {
    dismissDockTip();
    setVisible(false);
  }

  return (
    <aside className="dock-tip">
      <p>
        <strong>Pro tip:</strong> In Safari, choose <strong>File › Add to Dock…</strong> to
        make Danger Writer a Dock app that works offline.
      </p>
      <button type="button" aria-label="Dismiss" onClick={dismiss}>
        ×
      </button>
    </aside>
  );
}
