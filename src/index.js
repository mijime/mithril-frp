import m from 'mithril';
import {merge, combine} from 'kefir';

import KComponent from './utils/component';
import KEmitter from './utils/emitter';

function add (curr, next) {
  return curr + next;
}

function mainStream (props, children) {
  const delay = 1000;
  const up = new KEmitter();
  const down = new KEmitter();
  const text = new KEmitter();

  const counterStream = merge([
    up.createStream().delay(delay).map(() => 1),
    down.createStream().delay(delay).map(() => -1),
  ]).scan(add, 0);

  const textStream = text.createStream().toProperty(() => '').delay(delay);

  const inputStreams = [counterStream, textStream];

  const viewHandler = (currentCounter, currentText) => {
    return (
      <div>
        <button onclick={up.handleEmit()}>up</button>
        <button onclick={down.handleEmit()}>down</button>
        <span>{currentCounter}</span>
        <input type='text'
          oninput={m.withAttr('value', text.handleEmit())} />
        <p>{currentText}</p>
        {children}
      </div>
    );
  }

  return combine(inputStreams, viewHandler);
}

m.mount(document.body, (<KComponent stream={mainStream} />));
