import React from "react";
import WriteButton from "./WriteButton";
import Space from "./Space";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { NightModeToggle, useNightMode } from "./NightMode";

const Welcome = () => {
  const { nightMode } = useNightMode();
  return (
    <div className={classNames("Welcome", { "night-mode": nightMode })}>
      <NightModeToggle />
      <Link to="/help" className="navButton helpButton">
        Help
      </Link>
      <Space xl />
      <div>
        <div className="logo">
          <div className="mark"></div>
          <h1>
            <span>The Most</span>
            <span>Dangerous</span>
            <span>Writing App</span>
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
        This is a fork of{" "}
        <a
          href="https://github.com/maebert/themostdangerouswritingapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Most Dangerous Writing App
        </a>
        . Manu Ebert is amazing for building it.
      </p>
    </div>
  );
};

export default Welcome;
