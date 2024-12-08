import { SET_ROOM, EDIT_ROOM, DELETE_ROOM } from '../consts';

const initialState = {
  rooms: [],
  error: null,
};

export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM:
      console.log('New rooms:', action.payload);
      return { ...state, rooms: action.payload };

    case EDIT_ROOM:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.name === action.payload.currentName
            ? { ...room, name: action.payload.newName }
            : room
        ),
      };

    case DELETE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(
          (room) => room.name !== action.payload.roomDelete
        ),
      };

    default:
      return state;
  }
};
