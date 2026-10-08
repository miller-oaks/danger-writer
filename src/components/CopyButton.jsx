import React, { useRef, useState } from "react";

function copyWithFallback(value) {
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  if (!ok) throw new Error("copy failed");
}

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  async function copy() {
    const value = text || "";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        copyWithFallback(value);
      }
    } catch (err) {
      copyWithFallback(value);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" onClick={copy} className="tiny ghost">
      {copied ? "Copied" : "Copy to clipboard"}
    </button>
  );
}
