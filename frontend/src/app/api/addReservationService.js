export const addRoomDatabase = async (
  room_id_in_database,
  reservationDate,
  reservationTime,
  setMessage,
  setShowAlert
) => {
  try {
    console.log(
      room_id_in_database,
      reservationDate,
      reservationTime,
      setMessage,
      setShowAlert
    );
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);

    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    currentDate.setHours(currentHour, currentMinute);

    const response = await fetch('http://localhost:5000/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        room_id: room_id_in_database,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        created_at: currentDate,
      }),
    });

    if (response.ok) {
      setMessage('Twoje rezerwacja przebiegła pomyślnie');
      setShowAlert(true);
    } else {
      const result = await response.json();
      setMessage(result.message || 'Error');
      setShowAlert(true);
    }
  } catch (error) {
    console.error('Error:', error);
    setMessage('Error');
  }
};
