import React, { Component } from "react";
import Welcome from "./Welcome";
import Help from "./Help";
import WritingApp from "./App";

import {
  createHashRouter,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";

const App = (props) => {
  let [searchParams] = useSearchParams();
  let parse = (p) => {
    if (typeof p !== "string") return null;
    switch (p.toLowerCase()) {
      case "true":
        return true;
      case "1":
        return true;
      case "false":
        return false;
      case "0":
        return false;
      default:
        return null;
    }
  };

  let appProps = {
    limit: parseInt(searchParams.get("limit"), 10) || 5,
    type: searchParams.get("type") || "minutes",
    hardcore: parse(searchParams.get("hardcore")),
    nightmode: parse(searchParams.get("nightmode")),
  };
  // Setting a random key forces the component to re-mount even if
  // the route didn't change. That's useful for when we click the
  // Write button from withing <WritingApp />
  return <WritingApp key={Math.random()} {...appProps} />;
};

// Hash URLs stay on index.html, so a static host can serve the app from
// /write/ with no rewrites. PUBLIC_URL prefixes assets only; it is not
// part of the hash path, so the router has no basename.
const router = createHashRouter([
  { path: "/", element: <Welcome /> },
  { path: "/write", element: <App /> },
  { path: "/help", element: <Help /> },
]);

export default class MDWA extends Component {
  render() {
    return <RouterProvider router={router} />;
  }
}
