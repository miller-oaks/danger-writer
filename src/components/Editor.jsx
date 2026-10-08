import React, { Component } from 'react';
import classNames from 'classnames';
import {AppContext} from './AppContext';
import { preservesText } from './noDelete';
import { currentWord, isHardcore } from './hardcore';
import { REVEAL_DONE } from './reveal';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onStroke = this.onStroke.bind(this);
    this.clearLetter = this.clearLetter.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onBeforeInput = this.onBeforeInput.bind(this);
    this.onCut = this.onCut.bind(this);
    this.onPaste = this.onPaste.bind(this);
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
    const next = event.target.value;
    if (this.props.noDelete && !preservesText(this.state.text, next)) return;
    this.setState({text: next});
    // keydown reports the value from before this character landed.
    this.props.onStroke("", next);
  }

  selectionReplaces() {
    const input = this.input.current;
    return input && input.selectionStart !== input.selectionEnd;
  }

  blockedEdit(event) {
    if (!this.props.noDelete) return false;
    const key = event.key;
    const ctrl = event.ctrlKey || event.metaKey;
    if (key === "Backspace" || key === "Delete") return true;
    if (ctrl && key.toLowerCase() === "x") return true;
    if (!this.selectionReplaces()) return false;
    const navigation = [
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "Shift", "Control", "Alt", "Meta", "CapsLock", "Home", "End", "Escape", "Tab",
    ];
    return !navigation.includes(key);
  }

  onBeforeInput(event) {
    if (!this.props.noDelete) return;
    const type = (event.nativeEvent && event.nativeEvent.inputType) || "";
    if (type.indexOf("delete") === 0 || type === "deleteByCut") {
      event.preventDefault();
      return;
    }
    if (this.selectionReplaces() && type.indexOf("insert") === 0) event.preventDefault();
  }

  onCut(event) {
    if (this.props.noDelete) event.preventDefault();
  }

  onPaste(event) {
    if (this.props.noDelete && this.selectionReplaces()) event.preventDefault();
  }

  onStroke(event) {
    const key = event.key;
    const ctrl = event.ctrlKey || event.metaKey;
    const alt = event.metaKey || event.altKey;

    if (this.blockedEdit(event)) {
      event.preventDefault();
      return;
    }

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
      <AppContext.Consumer>{ ({danger, hardcore, won, reveal, revealed}) => {
        const hardcoreOn = isHardcore(hardcore);
        const holdBlur = hardcoreOn && won && reveal === REVEAL_DONE && !revealed;
        const active = (hardcoreOn && !won) || holdBlur;
        const shown = currentWord(this.state.text);
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
          {hardcoreOn && !won && (
            <div className="hardcore word">
              {shown}
            </div>
          )}
          <textarea
            placeholder="Start typing..."
            spellCheck="false"
            onKeyDown={this.onStroke}
            onBeforeInput={this.onBeforeInput}
            onCut={this.onCut}
            onPaste={this.onPaste}
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
