import React, { Component, useEffect } from "react";
import Welcome from "./Welcome";
import Help from "./Help";
import WritingApp from "./App";
import { parseHardcore } from "./hardcore";
import { NightModeProvider, useNightMode } from "./NightMode";

import {
  createBrowserRouter,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";

const parseFlag = (p) => {
  if (typeof p !== "string") return null;
  switch (p.toLowerCase()) {
    case "true":
    case "1":
      return true;
    case "false":
    case "0":
      return false;
    default:
      return null;
  }
};

const NightModeQuery = () => {
  const [searchParams] = useSearchParams();
  const { applyNightMode } = useNightMode();
  const nightmode = parseFlag(searchParams.get("nightmode"));
  useEffect(() => {
    if (nightmode !== null) applyNightMode(nightmode, false);
  }, [nightmode, applyNightMode]);
  return null;
};

const App = (props) => {
  let [searchParams] = useSearchParams();

  let appProps = {
    limit: parseInt(searchParams.get("limit"), 10) || 5,
    type: searchParams.get("type") || "minutes",
    hardcore: parseHardcore(searchParams.get("hardcore")),
  };
  // Setting a random key forces the component to re-mount even if
  // the route didn't change. That's useful for when we click the
  // Write button from withing <WritingApp />
  return (
    <>
      <NightModeQuery />
      <WritingApp key={Math.random()} {...appProps} />
    </>
  );
};

const router = createBrowserRouter(
  [
    { path: "/", element: <Welcome /> },
    { path: "/write", element: <App /> },
    { path: "/help", element: <Help /> },
  ],
  { basename: process.env.PUBLIC_URL }
);

export default class MDWA extends Component {
  render() {
    return (
      <NightModeProvider>
        <RouterProvider router={router} />
      </NightModeProvider>
    );
  }
}
