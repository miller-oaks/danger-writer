import React, { useState, useEffect } from "react";
import WriteButton from "./WriteButton";
import Space from "./Space";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { NightModeToggle, useNightMode } from "./NightMode";
import DockTip from "./DockTip";

const Banner = () => {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  const innerClasses = classNames("inner", { closed, visible });

  useEffect(() => {
    if (!visible) {
      setTimeout(() => setVisible(true), 500);
    }
  }, [visible]);

  const handleClose = (e) => {
    e.preventDefault();
    setClosed(true);
  };

  return (
    <div className="Banner">
      <a
        className={innerClasses}
        href="https://www.theleastdangeroustodolist.com?ref=mdwa"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="logo" />
        Want to feel accomplished? Check out&nbsp;
        <strong>
          The Least <span className="red">Dangerous</span> To-Do List
        </strong>
        .
        <div className="close" onClick={handleClose}>
          ✚
        </div>
      </a>
    </div>
  );
};

const Welcome = () => {
  const { nightMode } = useNightMode();
  return (
  <div className={classNames("Welcome", { "night-mode": nightMode })}>
    <Banner />
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
      <DockTip />
    </div>
    <div className="accolades" />
  </div>
  );
};

export default Welcome;
