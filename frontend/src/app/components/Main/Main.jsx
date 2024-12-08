'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import Button from '@mui/material/Button';
import 'react-calendar/dist/Calendar.css';
import './Main.css';
import { checkTokenUser } from '@/app/utils/auth';
import LoadingDate from '../LoadingDate/LoadingDate';
import Mybutton from '@/app/styles/mybutton';
import { fetchReservation } from '@/app/api/reservationService';

export default function Main() {
  const dispatch = useDispatch();

  const roomsRedux = useSelector((state) => state.rooms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenValid = checkTokenUser();
    if (tokenValid) {
      fetchReservation(dispatch).then(() => setLoading(false));
    }
  }, [dispatch]);

  // kalendarz:
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const toggleView = () => {
    setView((prevView) => (prevView === 'month' ? 'week' : 'month'));
  };

  // Widok Tygodniowy
  const getWeekDates = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const weekDates = [];
    for (let i = 1; i < 8; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDates.push(day);
    }
    return weekDates;
  };

  // Czy jest rezerwacja
  const isReserved = (day) => {
    return roomsRedux.some((room) => {
      const reservationDate = new Date(room.reservation_date);
      return reservationDate.toDateString() === day.toDateString();
    });
  };

  // Kolory dla zarezerwowanych dni w widoku miesięcznym
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && isReserved(date)) {
      return 'reserved-day';
    }
  };

  // Przejście do rezerwacji:
  const goToReservation = () => {
    window.location.href = '/booking/system';
  };

  // Wylogowanie
  const handleLogout = () => {
    window.location.href = '/';
    ['token', 'ally-supports-cache'].forEach((item) =>
      localStorage.removeItem(item)
    );
  };

  const handleGoToUser = () => {
    window.location.href = '/booking/user';
  };

  // Ładowanie danych
  if (loading) {
    return <LoadingDate />;
  }

  return (
    <div>
      <div className="wrapper">
        <div className="wrapper_login">
          <div className="user_btn">
            <Mybutton onClick={handleGoToUser}>Rezerwacje</Mybutton>
            <Mybutton
              style={{
                marginLeft: '0.4em',
              }}
              onClick={handleLogout}
            >
              Wyloguj się
            </Mybutton>
          </div>
        </div>
        <div className="wrapper_box info_reserve">
          <h3 className="header_book">Informacje o rezerwacji</h3>
          <div className="header_booking-details">
            <div className="date_choice">
              <div className="label_choice">Wybierz datę:</div>
              <p className="selected-date">
                Wybrana data: {date.toLocaleDateString('pl-PL')}
              </p>
            </div>
            <div className="additional-info">
              <p>
                <strong>Godziny dostępności:</strong>
                <span className="additional-main"> 8:00 - 15:00 </span>
              </p>
              <p>
                <strong>Wybierz salę:</strong>
                <span className="additional-main">
                  {' '}
                  Masz możliwość wyboru jednej z pięciu dostępnych sal
                  konferencyjnych.{' '}
                </span>
              </p>
              <p>
                <strong>Informacje kontaktowe:</strong>{' '}
                <a href="slupiktomasz@gmail.com"> slupiktomasz@gmail.com</a>
              </p>
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={toggleView}
            className="toggle-view-button"
          >
            Zmień widok na {view === 'month' ? 'tydzień' : 'miesiąc'}
          </Button>

          <h3 className="header_book">Rezerwacja sali</h3>
          <Button
            className="toggle-reserve-button"
            style={{
              backgroundColor: '#00bcd4',
              display: 'block',
              margin: '0 auto',
              maxWidth: '220px',
            }}
            variant="contained"
            onClick={goToReservation}
          >
            Rezerwuj
          </Button>
        </div>

        <div className="wrapper_box">
          {/* Renderowanie kalendarza w zależności od wybranego widoku */}
          {view === 'month' ? (
            <Calendar
              onChange={onChange}
              value={date}
              tileClassName={tileClassName}
            />
          ) : (
            <div className="view_week">
              <h2>Widok Tygodniowy</h2>
              <div className="view_week-name">
                {getWeekDates().map((day, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: 'center',
                      padding: '10px',
                      color: '#fff',
                    }}
                  >
                    <p
                      style={{
                        color: '#fff',
                        textAlign: 'left',
                      }}
                    >
                      {day.toLocaleDateString()}
                    </p>
                    {isReserved(day) && (
                      <span className="view_isreserved">Zarezerwowane</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
