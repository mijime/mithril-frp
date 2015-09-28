import {EventEmitter} from 'events';
import {fromEvents} from 'kefir';

const DEFAULT_EVENT = 'data';

export default class KEmitter extends EventEmitter {
  handleEmit (name = DEFAULT_EVENT) {
    return (...args) => this.emit.apply(this, [name, ...args]);
  }

  createStream (name = DEFAULT_EVENT) {
    return fromEvents(this, name);
  }
}
