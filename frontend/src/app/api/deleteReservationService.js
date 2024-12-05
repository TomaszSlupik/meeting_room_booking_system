export const deleteRoomDatabase = async (deleteRoom, setMessage, setShowAlert) => {

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/delete', {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteRoom }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Rekord został usunięty');
        setShowAlert(true)
      } else {
        setMessage('Nie usuenięto');
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error');
    }
  };