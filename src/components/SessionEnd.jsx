import React, { useEffect, useRef, useState } from "react";
import WriteButton from "./WriteButton";

export default function SessionEnd({ text, limit, type, hardcore, onNewSession, onContinue }) {
  const [confirming, setConfirming] = useState(false);
  const [setup, setSetup] = useState(false);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (confirming && cancelRef.current) cancelRef.current.focus();
  }, [confirming]);

  useEffect(() => {
    if (!confirming) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setConfirming(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  function requestNew() {
    if (text && text.trim()) setConfirming(true);
    else onNewSession();
  }

  if (setup) {
    return (
      <WriteButton
        small
        ghost
        label="Continue Session"
        limit={limit}
        type={type}
        hardcore={hardcore}
        onStart={onContinue}
      />
    );
  }

  return (
    <div className="writeButton small session-actions">
      <button type="button" className="small ghost" onClick={requestNew}>
        New Session
      </button>
      <button type="button" className="small ghost" onClick={() => setSetup(true)}>
        Continue Session
      </button>
      {confirming && (
        <div
          className="wipe-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wipe-title"
        >
          <div className="panel">
            <p id="wipe-title">
              Start a new session? The text from this one will be wiped.
            </p>
            <button type="button" className="small ghost" onClick={onNewSession}>
              New Session
            </button>
            <button
              type="button"
              className="small"
              ref={cancelRef}
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
