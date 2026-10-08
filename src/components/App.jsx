import React from "react";
import classNames from "classnames";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Progress from "./Progress";
import WordCount from "./WordCount";
import SessionEnd from "./SessionEnd";
import Failure from "./Failure";
import Download from "./Download";
import CopyButton from "./CopyButton";
import Editor from "./Editor";
import { AppContext } from "./AppContext";
import { isHardcore, parseHardcore } from "./hardcore";
import { REVEAL_DONE, readReveal } from "./reveal";
import { NightModeContext } from "./NightMode";

const withFullscreenHook = (Component) => {
  return (props) => {
    const handle = useFullScreenHandle();
    return <Component fullscreenHandler={handle} {...props} />;
  };
};

class WritingApp extends React.Component {
  static contextType = NightModeContext;

  constructor(props) {
    super(props);

    let { limit, type, hardcore, fullscreenHandler } = this.props;
    this.handleStroke = this.handleStroke.bind(this);
    this.fullscreenHandler = fullscreenHandler;
    this.reset = this.reset.bind(this);
    this.newSession = this.newSession.bind(this);
    this.continueSession = this.continueSession.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleNightMode = this.toggleNightMode.bind(this);
    this.revealText = this.revealText.bind(this);
    this.now = this.now.bind(this);
    this.editor = React.createRef();

    this.state = {
      run: false,
      startTime: null,
      fullscreen: false,
      progress: 0,
      timeSinceStroke: 0,
      danger: false,
      won: false,
      lost: false,
      fade: 2,
      kill: 5,
      limit: limit,
      type: type,
      hardcore: parseHardcore(hardcore),
      reveal: readReveal(),
      revealed: false,
    };
  }

  componentDidMount() {
    if (window.plausible) window.plausible("Editor");
  }

  startWriting() {
    if (window.plausible) window.plausible("Start Writing");
    this.setState({
      run: true,
      startTime: this.now(),
      timerID: setInterval(() => this.tick(), 100),
    });
  }

  toggleNightMode() {
    this.context.toggleNightMode();
  }

  toggleFullscreen() {
    if (this.fullscreenHandler.active) this.fullscreenHandler.exit();
    else this.fullscreenHandler.enter();

    this.setState((prevState, props) => ({
      fullscreen: !prevState.fullscreen,
    }));
  }

  handleStroke(char, text) {
    if (!this.state.run && !this.state.won) this.startWriting();
    this.toggleDanger(false);
    const words = text.trim().length && text.trim().split(/\s+/).length;
    this.setState({
      text,
      words,
      timeSinceStroke: 0,
    });
  }

  stopWriting() {
    clearInterval(this.state.timerID);
  }

  toggleDanger(on) {
    if (this.state.danger === on) return;
    this.setState({ danger: on });
  }

  now() {
    return new Date().getTime() / 1000;
  }

  revealText() {
    this.setState({ revealed: true });
  }

  win() {
    this.stopWriting();
    this.setState({
      won: true,
      run: false,
    });
    if (window.plausible) window.plausible("Win");
  }

  fail() {
    this.stopWriting();
    this.setState({ lost: true });
    if (window.plausible) window.plausible("Fail");
  }

  reset(type, limit, hardcore) {
    this.setState({
      type,
      limit,
      hardcore: parseHardcore(hardcore),
      reveal: readReveal(),
      revealed: false,
      won: false,
      lost: false,
      run: false,
      startTime: null,
      progress: 0,
      timeSinceStroke: 0,
      danger: false,
      words: 0,
    });
    this.editor.current && this.editor.current.reset();
  }

  newSession() {
    const { type, limit, hardcore } = this.state;
    this.reset(type, limit, hardcore);
  }

  continueSession({ type, limit, hardcore }) {
    const text =
      (this.editor.current && this.editor.current.state.text) ||
      this.state.text ||
      "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    this.setState({
      type,
      limit,
      hardcore: parseHardcore(hardcore),
      won: false,
      lost: false,
      run: false,
      startTime: null,
      progress: 0,
      timeSinceStroke: 0,
      danger: false,
      words,
      text,
    });
  }

  tick() {
    const { run, words, timeSinceStroke, startTime, fade, type, limit, kill } =
      this.state;
    if (!run) return;
    const danger = timeSinceStroke >= fade;
    if (timeSinceStroke >= kill) return this.fail();
    const duration = this.now() - startTime;
    const progress = (type === "minutes" ? duration / 60.0 : words) / limit;
    if (progress >= 1) this.win();

    this.setState((prevState, props) => ({
      words,
      progress,
      danger,
      timeSinceStroke: prevState.timeSinceStroke + 0.1,
      startTime,
      duration
    }));
  }

  render() {
    const { danger, won, lost, text, limit, type, hardcore, startTime, duration, reveal, revealed } =
      this.state;
    const { nightMode } = this.context;
    const waitingForDone = won && isHardcore(hardcore) && reveal === REVEAL_DONE && !revealed;
    const appClass = classNames("app", {
      "night-mode": nightMode,
      danger: danger,
    });
    return (
      <FullScreen handle={this.fullscreenHandler}>
        <AppContext.Provider value={this.state}>
          <div className={appClass}>
            <Failure />
            <Progress />
            <div className="buttons">
              {won && <Download finishTime={startTime + duration} text={text} />}
              {won && <CopyButton text={text} />}
              <i className="icon-night-mode" onClick={this.toggleNightMode}></i>
              <i
                className="icon-fullscreen"
                onClick={this.toggleFullscreen}
              ></i>
            </div>
            {!lost && (
              <div className="content">
                <Editor
                  ref={this.editor}
                  won={won}
                  onStroke={this.handleStroke}
                  onNightMode={this.toggleNightMode}
                  onFullScreen={this.toggleFullscreen}
                />
                {waitingForDone ? (
                  <button type="button" className="done-reveal" onClick={this.revealText}>
                    Done
                  </button>
                ) : won ? (
                  <SessionEnd
                    text={text}
                    limit={limit}
                    type={type}
                    hardcore={hardcore}
                    onNewSession={this.newSession}
                    onContinue={this.continueSession}
                  />
                ) : (
                  <WordCount />
                )}
              </div>
            )}
          </div>
        </AppContext.Provider>
      </FullScreen>
    );
  }
}

export default withFullscreenHook(WritingApp);
