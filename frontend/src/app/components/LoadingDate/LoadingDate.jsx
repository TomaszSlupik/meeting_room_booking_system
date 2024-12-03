import React from 'react';
import './LoadingDate.css'; 

const LoadingDate = () => {
  return (
    <div className="loading_container">
      <div className="spinner"></div>
      <p className="loading_text">Ładowanie danych...</p>
    </div>
  );
};

export default LoadingDate;