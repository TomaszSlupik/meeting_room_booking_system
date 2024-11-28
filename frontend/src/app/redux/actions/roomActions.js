import { SET_ROOM, EDIT_ROOM, DELETE_ROOM } from "../consts";

export const setRooms = (room) => {
    return {
        type: SET_ROOM,
        payload: {
            room
        }
    }
}

export const setEditRooms = (currentName, newName) => {
    return {
        type: EDIT_ROOM,
        payload: {
            currentName, 
            newName
        }
    }
}

export const setDeleteEvent = (roomDelete) => {
    return {
        type: DELETE_ROOM,
        payload: {
            roomDelete
        }
    }
}