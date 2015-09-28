import m from 'mithril';
import {merge, combine, stream} from 'kefir';

import KComponent from './utils/component';
import KEmitter from './utils/emitter';
import {actions, store} from './redux';

function add (curr, next) {
  return curr + next;
}

function mainStream (props, children) {
  const {delay, store} = props;
  const up = new KEmitter();
  const down = new KEmitter();
  const text = new KEmitter();

  const dispatchStream = merge([
    up.createStream().delay(delay).map(actions.incrementCount),
    down.createStream().delay(delay).map(actions.decrementCount),
    text.createStream().delay(delay).map(actions.updateText),
  ]).map(store.dispatch);

  const storeStream = stream(emitter => store.subscribe(emitter.emit))
    .map(store.getState).toProperty(store.getState);

  const viewHandler = (state) => {
    const currentCounter = state.counter;
    const currentText = state.text;

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

  const inputStreams = [
    storeStream.map(viewHandler),
    dispatchStream.toProperty(() => {}),
  ];

  return combine(inputStreams);
}

m.mount(document.body, (<KComponent delay={500} store={store} stream={mainStream} />));
