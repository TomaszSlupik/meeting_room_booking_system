import { SET_ROOM } from '../consts';

const initialState = {
  rooms: [],
  error: null
};

export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM:
        return { ...state, rooms: action.payload.room };
    default:
      return state;
  }
};