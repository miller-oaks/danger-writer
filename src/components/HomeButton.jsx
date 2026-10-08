import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function HomeLink({ className, onClick }) {
  return (
    <Link to="/" className={className} onClick={onClick}>
      Home
    </Link>
  );
}

export default function HomeButton({ text }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef(null);
  const hasText = !!(text && text.trim());

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

  function requestHome(event) {
    if (!hasText) return;
    event.preventDefault();
    setConfirming(true);
  }

  return (
    <>
      <HomeLink className="navButton backButton homeButton" onClick={requestHome} />
      {confirming && (
        <div
          className="wipe-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-wipe-title"
        >
          <div className="panel">
            <p id="home-wipe-title">
              Go home? The text from this session will be wiped.
            </p>
            <button type="button" className="small ghost" onClick={() => navigate("/")}>
              Go home
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
    </>
  );
}
