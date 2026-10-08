import React, { useState } from "react";
import { Link } from "react-router-dom";
import { readRecentSessions, sessionKey, sessionLabel, sessionSearch } from "./recentSessions";

export default function QuickStarts() {
  const [sessions] = useState(() => readRecentSessions());
  if (!sessions.length) return null;
  return (
    <div className="quick-starts">
      {sessions.map((session) => (
        <Link
          key={sessionKey(session)}
          to={{ pathname: "/write", search: sessionSearch(session) }}
        >
          {sessionLabel(session)}
        </Link>
      ))}
    </div>
  );
}
