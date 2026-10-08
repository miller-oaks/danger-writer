import React from 'react';
import { Link } from "react-router-dom";
import { readKeepLine, writeKeepLine } from "./keepLine";
import { readNoDelete, writeNoDelete } from "./noDelete";
import { hardcoreQuery, parseHardcore } from "./hardcore";
import { REVEAL_AUTOMATIC, REVEAL_DONE, readReveal, writeReveal } from "./reveal";
import QuickStarts from "./QuickStarts";
var classNames = require('classnames');

export default class WriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hardcore: parseHardcore(this.props.hardcore),
      reveal: readReveal(),
      limit: this.props.limit || 5,
      type: this.props.type || "minutes",
      compact: true,
      hidePanel: this.props.hidePanel,
      keepLine: readKeepLine(),
      noDelete: readNoDelete(),
    };

    this.onExpand = this.onExpand.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.setType = this.setType.bind(this);
    this.toggleHardcore = this.toggleHardcore.bind(this);
    this.setReveal = this.setReveal.bind(this);
    this.toggleKeepLine = this.toggleKeepLine.bind(this);
    this.toggleNoDelete = this.toggleNoDelete.bind(this);
    this.showPanel = this.showPanel.bind(this);
  }

  onExpand() {
    this.setState({compact: false});
  }

  renderCompactChooser() {
    const {limit, type} = this.state;
    const lengthLabel = type === "none" ? "No limit" : `${limit} ${type}`;
    return (
      <div className="session-chooser">
        <div className="compact"  onClick={ this.onExpand }>
          Session length:
          <span className="choice">{lengthLabel} <i className="edit icon-pencil"></i></span>

        </div>
      </div>
    )
  }

  showPanel() { this.setState({hidePanel: false}); }
  setLimit(limit) { this.setState({limit}); }
  setType(type) {
    if (type === "none") {
      this.setState({ type: "none" });
      return;
    }
    this.setState({
      type: type,
      limit: this.props.limits[type][1]
    });
  }
  toggleHardcore() {
    this.setState((prev) => ({ hardcore: !parseHardcore(prev.hardcore) }));
  }
  setReveal(reveal) { this.setState({ reveal: writeReveal(reveal) }); }
  toggleKeepLine() {
    const keepLine = writeKeepLine(!this.state.keepLine);
    this.setState({ keepLine });
  }
  toggleNoDelete() {
    const noDelete = writeNoDelete(!this.state.noDelete);
    this.setState({ noDelete });
  }

  renderOptions() {
    const options = this.props.limits[this.state.type];
    if (this.state.type === this.props.type && !options.includes(this.props.limit)) {
      options.push(this.props.limit);
      options.sort((a, b) => a - b);
    }
    return options.map((limit) => {
      const classes = classNames('radio', {active: limit === this.state.limit});
      return <span key={limit} className={classes} onClick={() => this.setLimit(limit)}>{limit}</span>
    }
    );
  }

  renderFullChooser() {
    const classes = classNames('full', this.state.type)
    return (
      <div className="session-chooser">
        <div className={classes}>
          <div className="tabs">
              <span className="minutes" onClick={() => this.setType("minutes")}>Minutes</span>
              &nbsp;/&nbsp;
              <span className="words" onClick={() => this.setType("words")}>Words</span>
              &nbsp;/&nbsp;
              <span className="none" onClick={() => this.setType("none")}>No limit</span>
          </div>
          { this.state.type !== "none" && (
            <div className="radios">
              { this.renderOptions() }
            </div>
          )}
            <div onClick={this.toggleHardcore} className={classNames("hardcore", { checked: this.state.hardcore })}>Hardcore mode</div>
            <div className="reveal-at-end">
              <span className="label">Reveal at end</span>
              <span
                className={classNames("level", { active: this.state.reveal === REVEAL_AUTOMATIC })}
                onClick={() => this.setReveal(REVEAL_AUTOMATIC)}
              >
                automatically
              </span>
              <span
                className={classNames("level", { active: this.state.reveal === REVEAL_DONE })}
                onClick={() => this.setReveal(REVEAL_DONE)}
              >
                when I press Done
              </span>
            </div>
            <div onClick={this.toggleKeepLine} className={classNames('hardcore', {checked: this.state.keepLine})}>Keep current line at top</div>
            <div onClick={this.toggleNoDelete} className={classNames('hardcore', {checked: this.state.noDelete})}>No deleting</div>
        </div>
      </div>
    )
  }

  render() {
    const wrapperWlasses = classNames("writeButton", {small: this.props.small})
    const buttonClasses = classNames(this.props.color, {
      small: this.props.small,
      ghost: this.props.ghost
    })
    const {limit, type, hardcore} = this.state;
    const startContinuing = () => {
      this.props.onStart({ limit, type, hardcore });
    };
    return (
      <div className={wrapperWlasses}>
        { !this.props.noPanel && !this.state.hidePanel && (this.state.compact ? this.renderCompactChooser() : this.renderFullChooser()) }
        { this.props.onStart ? (
          <button
            type="button"
            className={buttonClasses}
            onMouseOver={this.showPanel}
            onClick={startContinuing}
          >
            { this.props.label }
          </button>
        ) : (
          <Link
            to={{
              pathname: "/write",
              search: (type === "none" ? "?type=none" : `?limit=${limit}&type=${type}`) + hardcoreQuery(hardcore)
            }}
            className={buttonClasses}
            onMouseOver={this.showPanel}
          >
            { this.props.label }
          </Link>
        )}
        {!this.props.onStart && !this.props.small && this.props.label === "Start Writing" && <QuickStarts />}
      </div>
    )
  }
}

WriteButton.defaultProps = {
  label: "Start Writing",
  small: false,
  hidePanel: false,
  limits: {
    minutes: [3, 5, 10, 15, 20, 30, 60],
    words: [150, 250, 500, 750, 1667]
  }
}
