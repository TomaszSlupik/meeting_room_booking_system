export const editRoomDatabase = async (editRoomId, editReservationDate, editHour, setMessage, setShowAlert, oldHour, oldReservationDate, roomsRedux) => {

    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 1);
  
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();
      currentDate.setHours(currentHour, currentMinute);


      // console.log(user_id, editRoomId, oldReservationDate)
      console.log(roomsRedux)

      const response = await fetch('http://localhost:5000/edit', {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            user_id: user_id,
            room_id:  editRoomId,
            reservation_date: editReservationDate,
            reservation_time: editHour,
            created_at: currentDate,
            oldHour: oldHour,
            oldReservationDate: oldReservationDate
        }),
      });

      

      if (response.ok) {
        setMessage('Edycja nastąpiła pomyślnie');
        setShowAlert(true)
      } else {
        const result = await response.json();
        setMessage(result.message || 'Brak edycji');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error');
    }
  };