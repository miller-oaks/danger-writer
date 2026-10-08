import React, { Component } from 'react';
import classNames from 'classnames';
import {AppContext} from './AppContext';
import { currentWord, isHardcore, parseHardcore } from './hardcore';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onStroke = this.onStroke.bind(this);
    this.clearLetter = this.clearLetter.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.input = React.createRef();
    this.wrapper = React.createRef();
    this.state = {
      cutTop: false,
      cutBottom: false,
      text: "",
      letter: "",
      timerId: null
    }

    this.invalid_keys = [
      'Backspace', 'Tab', 'Enter', 'Control', 'Alt', 'Meta', 'Escape',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'CapsLock', 'Shift', 'Delete', 'Home', 'End', ' '
    ];
    this.disabled_keys = ['Tab'];
    this.control_keys = ['a', 'c', 'v', 'x', 'f'];
  }

  onScroll(event) {
    const { scrollTop, scrollHeight } = this.input.current;
    const height = this.wrapper.current.clientHeight;
    this.setState({
      cutTop: scrollTop > 0,
      cutBottom: scrollHeight - 10 > height + scrollTop && scrollHeight > height
    });
  }

  componentDidMount(){
   this.input.current.focus();
  }

  onChange(event) {
    this.setState({text: event.target.value});
  }

  onStroke(event) {
    const key = event.key;
    const ctrl = event.ctrlKey || event.metaKey;
    const alt = event.metaKey || event.altKey;

    if (this.disabled_keys.includes(key)) {
      event.preventDefault();
      return;
    };
    if (this.invalid_keys.includes(key) || event.repeat) return;
    if (!this.props.won && ctrl && this.control_keys.includes(key)) {
      event.preventDefault();
      return;
    }


    if (ctrl && alt && key === 'n') {
      this.props.onNightMode();
    } else if (ctrl && alt && key === 'f') {
      this.props.onFullScreen();
    } else {
      clearInterval(this.state.timerId);
      this.setState({
        letter: key,
        timerId: setInterval(this.clearLetter, 200),
      });
      this.props.onStroke(key, this.state.text);
    }
  }

  clearLetter() {
    clearInterval(this.state.timerId);
    this.setState({letter: ""})
  }

  reset() {
    this.setState({ cutTop: false, cutBottom: false, text: ""});
  }

  render() {
    return (
      <AppContext.Consumer>{ ({danger, hardcore, won}) => {
        const level = parseHardcore(hardcore);
        const active = isHardcore(level) && !won;
        const shown = level === "word" ? currentWord(this.state.text) : this.state.letter;
        return (
        <div
          className={classNames('editor', {
            danger,
            hardcore: active,
            'cut-top': this.state.cutTop,
            'cut-bottom': this.state.cutBottom,
          })}
         ref={this.wrapper}
        >
          {active && (
            <div className={classNames("hardcore", { word: level === "word" })}>
              {shown}
            </div>
          )}
          <textarea
            placeholder="Start typing..."
            spellCheck="false"
            onKeyDown={this.onStroke}
            onChange={this.onChange}
            onScroll={this.onScroll}
            ref={this.input}
            value={this.state.text}
          ></textarea>
        </div>
        );
      }}</AppContext.Consumer>
    )
  }
}
