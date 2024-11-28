"use client"; 
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { setRooms } from "../redux/actions/roomActions";

export default function Main() {
 
  const dispatch = useDispatch();

  const [rooms, setRoomsState] = useState([]);

  // GET dla listy sal
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/rooms");
      if (!response.ok) {
        throw new Error("Błąd pobierania");
      }

      const text = await response.text();
      console.log(text); 
      const data = JSON.parse(text); 

      setRoomsState(data);
      dispatch(setRooms(data));

    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchRooms}>Load Rooms</button>
      <div>
        {rooms.length === 0 ? (
          <p>Brak danych do wyświetlenia.</p>
        ) : (
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>
                {room.name} (ID: {room.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
