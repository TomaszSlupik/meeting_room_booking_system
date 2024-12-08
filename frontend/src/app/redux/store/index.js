import { createStore } from 'redux';
import { roomReducer } from '../reducers/roomReducer';

let store;

if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__) {
  store = createStore(
    roomReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
} else {
  store = createStore(roomReducer);
}

export { store };