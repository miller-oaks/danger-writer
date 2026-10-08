import React from 'react';
import { Link } from "react-router-dom";
import { HARDCORE_LEVELS, hardcoreQuery, parseHardcore } from "./hardcore";
import { REVEAL_AUTOMATIC, REVEAL_DONE, readReveal, writeReveal } from "./reveal";
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
      hidePanel: this.props.hidePanel
    };

    this.onExpand = this.onExpand.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.setType = this.setType.bind(this);
    this.setHardcore = this.setHardcore.bind(this);
    this.setReveal = this.setReveal.bind(this);
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
  setHardcore(hardcore) { this.setState({ hardcore: parseHardcore(hardcore) }); }
  setReveal(reveal) { this.setState({ reveal: writeReveal(reveal) }); }

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
            <div className="hardcore-levels">
              <span className="label">Hardcore</span>
              { HARDCORE_LEVELS.map(({ id, label }) => (
                <span
                  key={id}
                  className={classNames("level", { active: this.state.hardcore === id })}
                  onClick={() => this.setHardcore(id)}
                >
                  {label}
                </span>
              )) }
            </div>
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
    return (
      <div className={wrapperWlasses}>
        { !this.props.noPanel && !this.state.hidePanel && (this.state.compact ? this.renderCompactChooser() : this.renderFullChooser()) }
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
