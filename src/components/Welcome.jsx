import React from "react";
import WriteButton from "./WriteButton";
import Space from "./Space";
import { Link } from "react-router-dom";
import Mark from "./Mark";

const Welcome = () => (
  <div className="Welcome">
    <Link to="/help" className="navButton helpButton">
      Help
    </Link>
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
        href="https://github.com/miller-oaks/themostdangerouswritingapp"
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

export default Welcome;
