import kefir from 'kefir';
import m from 'mithril';
import {EventEmitter} from 'events';

function add (prev, next) {
  return prev + next;
}

function withEmit (emitter) {
  return (event) => emitter.emit('data', event);
}

function withEmitAttr (attr, emitter) {
  return m.withAttr(attr, withEmit(emitter));
}

function makeModule (viewStream) {
  const view = m.prop([]);
  return {
    controller () {
      viewStream().onValue((newView) => {
        m.startComputation();
        view(newView);
        m.endComputation();
      });
    },
    view () {
      return view();
    },
  };
}

function createViewStream () {
  const up = new EventEmitter();
  const down = new EventEmitter();
  const text = new EventEmitter();
  const counter = kefir.merge([
    kefir.fromEvents(up, 'data').map(() => 1),
    kefir.fromEvents(down, 'data').map(() => -1),
  ]).scan(add, 0);

  return kefir.combine([
    counter,
    kefir.fromEvents(text, 'data').toProperty(() => ''),
  ], (counter, currentText) => {
    return (
      <div>
        <button onclick={withEmit(up)}>up</button>
        <button onclick={withEmit(down)}>down</button>
        <span>{counter}</span>
        <input type='text' oninput={withEmitAttr('value', text)} />
        <p>{currentText}</p>
      </div>
    );
  });
}

const Root = makeModule(createViewStream);
m.mount(document.body, (<Root />));
