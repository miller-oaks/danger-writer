import React from "react";
import WriteButton from "./WriteButton";
import Space from "./Space";
import { Link } from "react-router-dom";
import Mark from "./Mark";

export default class Help extends React.Component {
  render() {
    return (
      <div className="Help">
        <Link to="/" className="navButton backButton">
          Back
        </Link>
        <Space l />
        <div className="content">
          <div className="logo small">
            <Mark />
            <h1>
              <span>Danger</span>
              <span>
                Writer
                <i className="caret icon-cursor" />
              </span>
            </h1>
          </div>

          <h1>Help</h1>
          <h2>What's the point?</h2>
          <p>
            Danger Writer is designed to shut down your inner
            editor and get you into a state of flow. If you stop typing for more
            than five seconds, all progress will be lost. After typing without
            interruption for the length of your session, you'll be able to save
            your work.
          </p>
          <p>
            Because 'tis better to have written and lost, than never to have
            written at all.
          </p>

          <Space m />
          <WriteButton ghost color="red" />

          <h2>Who made this?</h2>
          <p>
            This version is a set of{" "}
            <a
              href="https://github.com/miller-oaks/danger-writer"
              target="_blank"
              rel="noopener noreferrer"
            >
              customizations
            </a>{" "}
            on Manu Ebert's amazing original.
          </p>
          <p>
            <i className="icon-mdwa" />{" "}
            <abbr title="The Most Dangerous Writing App">MDWA</abbr> was written
            by{" "}
            <a
              href="https://www.x.com/maebert"
              rel="noopener noreferrer"
              target="_blank"
              title="Manu Ebert"
            >
              Manu Ebert
            </a>{" "}
            over two glasses of wine on a Sunday afternoon and is{" "}
            <a
              title="MDWA on Github"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.github.com/maebert/themostdangerouswritingapp"
            >
              <i className="icon-github" />open source
            </a>
            .
          </p>

          <p>
            The domain <a href="https://themostdangerouswritingapp.com">themostdangerouswritingapp.com</a> has been acquired by <a href="https://www.squibler.io" title="Squibler">Squibler</a>, who now maintain and continue to develop the app.{" "}
            This is the the original version of the app, which will continue to be available at <a href="https://maebert.github.io/themostdangerouswritingapp">maebert.github.io/themostdangerouswritingapp</a>.
          </p>


          <h2>Can anybody read what I write?</h2>
          <p>
            No, all your writing is private and not submitted to or stored on any
            server.
          </p>

          <Space l />
        </div>
      </div>
    );
  }
};

