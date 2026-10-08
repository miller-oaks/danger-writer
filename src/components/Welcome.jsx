import React from "react";
import WriteButton from "./WriteButton";
import Space from "./Space";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { NightModeToggle, useNightMode } from "./NightMode";
import Mark from "./Mark";
import DockTip from "./DockTip";

const Welcome = () => {
  const { nightMode } = useNightMode();
  return (
    <div className={classNames("Welcome", { "night-mode": nightMode })}>
      <div className="welcome-bar">
        <Link to="/help" className="navButton helpButton">
          Help
        </Link>
        <DockTip />
        <NightModeToggle />
      </div>
      <Space xl />
      <div>
        <div className="logo">
          <Mark />
          <h1>
            <span>Danger</span>
            <span>Writer</span>
          </h1>
        </div>
        <Space m />
        <h2>
          Don’t stop typing, or all progress will be lost.
          <i className="caret icon-cursor" />
        </h2>
        <Space xl />
        <WriteButton ghost color="red" />
      </div>
      <p className="forkCredit">
        This is a{" "}
        <a
          href="https://github.com/miller-oaks/danger-writer"
          target="_blank"
          rel="noopener noreferrer"
        >
          fork
        </a>{" "}
        of{" "}
        <a
          href="https://github.com/maebert/themostdangerouswritingapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-mdwa" aria-hidden="true" /> The Most Dangerous Writing App
        </a>
        . Manu Ebert is amazing for building it.
      </p>
    </div>
  );
};

export default Welcome;
