import {combineReducers, createStore} from 'redux';

const reducers = combineReducers({
  text (state = '', {type, text}) {
    switch (type) {
      case 'MOD_TEXT':
        return text;

      default:
        return state;
    }
  },

  counter (state = 0, {type}) {
    switch (type) {
      case 'INC_COUNT':
        return state + 1;

      case 'DEC_COUNT':
        return state - 1;

      default:
        return state;
    }
  },
});

export const actions = {
  incrementCount () {
    return {type: 'INC_COUNT'};
  },

  decrementCount () {
    return {type: 'DEC_COUNT'};
  },

  updateText (text) {
    return {type: 'MOD_TEXT', text};
  },
}

export const store = createStore(reducers);
