import { setRooms } from "../redux/actions/roomActions";

export const fetchReservation = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/reservation", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Błąd pobierania rezerwacji");
    }

    const text = await response.text();
    const data = JSON.parse(text);

    dispatch(setRooms(data));  

    return data; 

  } catch (error) {
    console.error("Błąd:", error);
  }
};
