import React, { Component } from 'react';
import classNames from 'classnames';
import {AppContext} from './AppContext';
import { preservesText } from './noDelete';
import { currentWord, isHardcore, parseHardcore } from './hardcore';
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
    const input = this.input.current;
    if (this.shouldPin() && input.scrollTop < (this.lockedScroll || 0) - 1) {
      input.scrollTop = this.lockedScroll || 0;
    }
    const { scrollTop, scrollHeight } = input;
    const height = this.wrapper.current.clientHeight;
    this.setState({
      cutTop: scrollTop > 0,
      cutBottom: scrollHeight - 10 > height + scrollTop && scrollHeight > height
    });
  }

  componentDidMount(){
   this.input.current.focus();
   this.blockScroll = (event) => {
     if (this.shouldPin()) event.preventDefault();
   };
   this.input.current.addEventListener("wheel", this.blockScroll, { passive: false });
   this.input.current.addEventListener("touchmove", this.blockScroll, { passive: false });
   if (this.shouldPin()) this.pinLine();
  }

  componentWillUnmount() {
    if (this.input.current && this.blockScroll) {
      this.input.current.removeEventListener("wheel", this.blockScroll);
      this.input.current.removeEventListener("touchmove", this.blockScroll);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.won && !prevProps.won && (this.props.keepLine || this.pinned)) {
      this.releasePin();
      return;
    }
    if (this.shouldPin()) this.pinLine();
    else if (!this.releasing && this.input.current) this.input.current.style.paddingBottom = "";
  }

  shouldPin() {
    return !!this.props.keepLine && !this.props.won && !this.releasing;
  }

  pinLine() {
    const input = this.input.current;
    if (!input) return;
    const lineHeight = parseFloat(window.getComputedStyle(input).lineHeight) || 32;
    const margin = lineHeight * 2;
    const pad = Math.max(0, input.clientHeight - margin);
    input.style.paddingBottom = `${pad}px`;
    const locked = Math.max(0, input.scrollHeight - input.clientHeight);
    input.scrollTop = locked;
    this.lockedScroll = locked;
    this.pinned = true;
  }

  releasePin() {
    const input = this.input.current;
    if (!input) return;
    this.releasing = true;
    this.pinned = false;
    const startPad = parseFloat(input.style.paddingBottom) || 0;
    const duration = 700;
    const t0 = performance.now();
    const step = (now) => {
      if (!this.input.current) return;
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      input.style.paddingBottom = `${Math.max(0, startPad * (1 - eased))}px`;
      const overflows = input.scrollHeight > input.clientHeight + 1;
      input.scrollTop = overflows ? input.scrollHeight - input.clientHeight : 0;
      if (p < 1) requestAnimationFrame(step);
      else {
        input.style.paddingBottom = "";
        const stillOverflows = input.scrollHeight > input.clientHeight + 1;
        input.scrollTop = stillOverflows ? input.scrollHeight - input.clientHeight : 0;
        this.releasing = false;
        this.lockedScroll = 0;
      }
    };
    requestAnimationFrame(step);
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
        const level = parseHardcore(hardcore);
        const holdBlur = isHardcore(level) && won && reveal === REVEAL_DONE && !revealed;
        const active = (isHardcore(level) && !won) || holdBlur;
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
          {isHardcore(level) && !won && (
            <div className={classNames("hardcore", { word: level === "word" })}>
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
