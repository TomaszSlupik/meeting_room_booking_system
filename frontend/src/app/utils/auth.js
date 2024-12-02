// Funkcja sprawdzająca obecność tokenu
export const checkTokenUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = '/booking/error_token';
      return false; 
    }
    return true; 
  };
  