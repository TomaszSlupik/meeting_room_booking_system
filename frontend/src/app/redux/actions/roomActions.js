import { SET_ROOM, EDIT_ROOM, DELETE_ROOM } from '../consts';

export const setRooms = (rooms) => {
  return {
    type: SET_ROOM,
    payload: rooms,
  };
};

export const setEditRooms = (currentName, newName) => {
  return {
    type: EDIT_ROOM,
    payload: {
      currentName,
      newName,
    },
  };
};

export const setDeleteEvent = (roomDelete) => {
  return {
    type: DELETE_ROOM,
    payload: {
      roomDelete,
    },
  };
};
