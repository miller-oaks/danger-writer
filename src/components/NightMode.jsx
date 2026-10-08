import React, { useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "mdwa.night-mode";

const NightModeContext = React.createContext({
  nightMode: false,
  toggleNightMode: () => {},
  applyNightMode: () => {},
});

function readStoredNightMode() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "true") return true;
    if (value === "false") return false;
  } catch (e) {}
  return null;
}

function systemPrefersNight() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function NightModeProvider({ children }) {
  const [nightMode, setNightMode] = useState(() => {
    const stored = readStoredNightMode();
    if (stored !== null) return stored;
    return systemPrefersNight();
  });

  useEffect(() => {
    document.body.classList.toggle("night-mode", nightMode);
  }, [nightMode]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredNightMode() !== null) return;
      setNightMode(media.matches);
    };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
    return () => {
      if (media.removeEventListener) media.removeEventListener("change", onChange);
      else if (media.removeListener) media.removeListener(onChange);
    };
  }, []);

  const applyNightMode = useCallback((value, persist) => {
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
      } catch (e) {}
    }
    setNightMode(value);
  }, []);

  const toggleNightMode = useCallback(() => {
    setNightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "true" : "false");
      } catch (e) {}
      return next;
    });
  }, []);

  return (
    <NightModeContext.Provider value={{ nightMode, toggleNightMode, applyNightMode }}>
      {children}
    </NightModeContext.Provider>
  );
}

export function useNightMode() {
  return useContext(NightModeContext);
}

export function NightModeToggle() {
  const { toggleNightMode } = useNightMode();
  return (
    <div className="buttons">
      <i className="icon-night-mode" onClick={toggleNightMode} />
    </div>
  );
}

export { NightModeContext };
