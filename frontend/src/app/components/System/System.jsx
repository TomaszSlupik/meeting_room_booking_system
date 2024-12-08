"use client"; 
import React, { useState, useEffect } from 'react';
import './System.css';
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { checkTokenUser } from '@/app/utils/auth';
import LoadingDate from '../LoadingDate/LoadingDate';
import Wrapperheader from '@/app/styles/wrapperheader';
import Mybutton from '@/app/styles/mybutton';
import { goToMain } from '@/app/utils/goToMain';
import { fetchReservation } from '@/app/api/reservationService';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { addRoomDatabase } from '@/app/api/addReservationService';
import AlertMessage from '@/app/ui/AlertMessage';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function System() {
  const [rooms, setRooms] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localStorage.getItem("selectedDate") || formattedDate);
  const roomsRedux = useSelector(state => state.rooms);

// Zapis do Local Storage
useEffect(() => {
  if (selectedDate) {
    localStorage.setItem("selectedDate", selectedDate); 
  }
}, [selectedDate]);

// alert
const [message, setMessage] = useState('');
const [showAlert, setShowAlert] = useState(false);


// Dodawanie:
const [openWindowAdd, setOpenWindowAdd] = useState(false);

const handleCloseWindowAdd = () => {
  setOpenWindowAdd(false)
}

const handleAcceptWindowAdd = () => {
  setOpenWindowAdd(false)
  // Przypsianie room id z Postre
  const updatedSchedule = schedule.map(item => {
    const roomData = roomsRedux.find(room => room.name_room === item.room);
    
    return {
      ...item,
      room_id_in_database: roomData ? roomData.room : null 
    };
  });
  

  updatedSchedule.forEach((reservation) => {
    const room = roomsRedux.find((r) => r.name_room === reservation.room); 
    if (room) {

      addRoomDatabase(
        room.room, 
        selectedDate,  
        `${reservation.hour}:00`, 
        setMessage,    
        setShowAlert  
      );
    }
  });

}


  // Pobieranie danych z backendu
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/room", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  
          "Content-Type": "application/json", 
        },
      });

      if (!response.ok) {
        throw new Error("Błąd pobierania sal konferencyjnych");
      }

      const data = await response.json();
      setRooms(data);
      setLoading(false)

    } catch (error) {
      console.error("Błąd:", error);
    }
  };


  const dispatch = useDispatch();

  useEffect(() => {
    const tokenValid = checkTokenUser(); 
    if (tokenValid) {
      fetchRooms();
      fetchReservation(dispatch)
      .then(() => setLoading(false));  
    } 
  }, [dispatch]);

  // Ładowanie danych 
  if (loading) {
    return <LoadingDate />;
  }

  const hours = Array.from({ length: 8 }, (_, i) => 8 + i); // Godziny od 8:00 do 15:00

  const handleDrop = (room, hour) => {
    setSchedule((prev) => {
      // Sprawdź, czy komórka już jest zajęta
      const updatedSchedule = prev.filter(
        (entry) => !(entry.hour === hour && entry.room === room)
      );
      return [...updatedSchedule, { room, hour }];
    });
  };

  const ItemType = {
    ROOM: "ROOM",
  };

  const RoomItem = ({ name }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: ItemType.ROOM,
      item: { name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={dragRef}
        style={{
          padding: "8px",
          margin: "4px 0",
          backgroundColor: isDragging ? "lightgreen" : "white",
          backgroundColor: "gray",
          border: "1px solid gray",
          cursor: "grab",
        }}
      >
        {name}
      </div>
    );
  };

  const DropCell = ({ hour, room, onDrop }) => {
    const [{ isOver }, dropRef] = useDrop({
      accept: ItemType.ROOM,
      drop: (item) => onDrop(item.name, hour), 
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
  
    const selectedDateFormatted = new Date(selectedDate).toISOString().split('T')[0];
  
    const scheduledItem = schedule.find(
      (entry) => entry.hour === hour && entry.room === room
    );
  
    const isReserved = roomsRedux.some(
      (reservation) =>
        new Date(reservation.reservation_date).toISOString().split('T')[0] === selectedDateFormatted &&
        reservation.reservation_time === `${hour}:00` &&
        reservation.name_room === room
    );
  
    const reservedRoom = roomsRedux.find(
      (reservation) =>
        new Date(reservation.reservation_date).toISOString().split('T')[0] === selectedDateFormatted &&
        reservation.reservation_time === `${hour}:00` &&
        reservation.name_room === room
    );
  
    return (
      <div
        ref={dropRef}
        className="drop-cell"
        style={{
          backgroundColor: isReserved ? "red" : isOver ? "lightblue" : "white",
        }}
      >
        {isReserved ? (
          <>
            <div className="cell-info">
              <strong>Sala:</strong> {reservedRoom.name_room}
            </div>
            <div className="cell-info">
              <strong>Użytkownik:</strong> {reservedRoom.username}
            </div>
          </>
        ) : (
          <>
            {scheduledItem ? (
              <div>{scheduledItem.room}</div>
            ) : (
              <div className="available-info">Możesz dodać salę tutaj</div>
            )}
          </>
        )}
      </div>
    );
  };
  

  // Rezerwacja:
  const reservationRoom = () => {
    setOpenWindowAdd(true)
    console.log("Twoje rezerwacje:");
    schedule.forEach((reservation) => {
      console.log(`Sala: ${reservation.room}, Godzina: ${reservation.hour}:00`);
    });
  };

  return (
    <div>
      <div className='wrapper'>
        <Wrapperheader>
          <Mybutton
            style={{
              position: 'absolute',
              left: '1%',
              top: '8%'
            }}
            onClick={goToMain}
          >
            Powrót
          </Mybutton>
        </Wrapperheader>
  
        <div className="wrapper_box">
          <DndProvider backend={HTML5Backend}>
            <div style={{ display: "flex" }}>

              <div style={{ width: "200px", padding: "16px", borderRight: "1px solid gray" }}>
                <label htmlFor="start">Wybierz dzień:</label>
                <input type="date" id="start" name="trip-start" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={formattedDate}
                  required
                />
              </div>
  
              <div style={{ width: "200px", padding: "16px", borderRight: "1px solid gray" }}>
                <h3>Sale konferencyjne</h3>
                {rooms.map((room) => (
                  <RoomItem key={room.name_room} name={room.name_room} />
                ))}
              </div>
  
              <div style={{ flex: 1, padding: "16px" }}>
                <h3>Harmonogram</h3>
                
          
                <div className="legend">
                  <h4>Legenda:</h4>
                  <ul>
                    <li><span className="legend-color reserved"></span> Sala zarezerwowana</li>
                    <li><span className="legend-color available"></span> Możliwość przypisania sali</li>
                  </ul>
                </div>
  
                <div style={{ display: "grid", gridTemplateColumns: `100px repeat(${rooms.length}, 1fr)`, gridGap: '10px' }}>
 
  <div style={{ textAlign: "center", fontWeight: "bold" }}></div>
  {rooms.map((room) => (
    <div key={room.name_room} style={{ textAlign: "center", fontWeight: "bold" }}>
      {room.name_room}
    </div>
  ))}
  

  {hours.map((hour) => (
    <React.Fragment key={hour}>
      <div style={{ textAlign: "center", fontWeight: "bold" }}>{hour}:00</div>
      {rooms.map((room) => (
        <DropCell
          key={`${hour}-${room.name_room}`}
          hour={hour}
          room={room.name_room}
          onDrop={handleDrop}
        />
      ))}
    </React.Fragment>
  ))}
</div>

              </div>
            </div>
          </DndProvider>

          <Mybutton
      style={{
        position: 'absolute',
        right: '2%',
        top: '2%',
        color: "green",  
        border: '2px solid green',
        backgroundColor: "transparent", 
        transition: "background-color 0.3s ease, color 0.3s ease", 
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "green"; 
        e.target.style.color = "#fff"; 
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent"; 
        e.target.style.color = "green"; 
      }}
      onClick={reservationRoom}
          >
              Rezerwuj
          </Mybutton>


          {/* Dodawanie */}
                <React.Fragment>
                <Dialog
                open={openWindowAdd}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseWindowAdd}
                aria-describedby="alert-dialog-slide-description"
              >
                  <DialogTitle>{"Czy chcesz dodać swoje rezerwacje?"}</DialogTitle>
                  <DialogContent>
              
                        <div>
                          <ul>
                            {
                              schedule.map((reservation, index) => (
                                <li key={index}>
                                  Sala: {reservation.room}, Godzina: {reservation.hour}:00
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                 


                  </DialogContent>
                  <DialogActions>
                    <Mybutton
                      style={{
                        color: "red",  
                        border: '2px solid red',
                        backgroundColor: "transparent", 
                        transition: "background-color 0.3s ease, color 0.3s ease", 
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#ff0000"; 
                        e.target.style.color = "#fff"; 
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"; 
                        e.target.style.color = "red"; 
                      }}
                      onClick={handleCloseWindowAdd}
                    >
                      Anuluj
                    </Mybutton>
                    <Mybutton
                      style={{
                        color: "green",  
                        border: '2px solid green',
                        backgroundColor: "transparent", 
                        transition: "background-color 0.3s ease, color 0.3s ease", 
                        cursor: schedule.length === 0 ? "not-allowed" : "pointer", 
                      }}
                      onMouseEnter={(e) => {
                        if (schedule.length > 0) {  
                          e.target.style.backgroundColor = "green"; 
                          e.target.style.color = "#fff"; 
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (schedule.length > 0) {  
                          e.target.style.backgroundColor = "transparent"; 
                          e.target.style.color = "green"; 
                        }
                      }}
                      onClick={handleAcceptWindowAdd}
                      disabled={schedule.length === 0}  
                    >
                      Akceptuję
                    </Mybutton>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
        </div>
      </div>
      <AlertMessage 
        showAlert={showAlert} 
        message={message} 
        setShowAlert={setShowAlert} 
      />
    </div>
  );
  
}
