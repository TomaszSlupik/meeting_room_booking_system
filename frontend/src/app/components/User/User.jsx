'use client';
import Mybutton from '@/app/styles/mybutton';
import Wrapperheader from '@/app/styles/wrapperheader';
import { goToMain } from '@/app/utils/goToMain';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './User.css';
import LoadingDate from '../LoadingDate/LoadingDate';
import { checkTokenUser } from '@/app/utils/auth';
import { formatDate } from '@/app/utils/formatDate';
import { formatDateInput } from '@/app/utils/formatDateInput';
import { fetchReservation } from '@/app/api/reservationService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { deleteRoomDatabase } from '@/app/api/deleteReservationService';
import { editRoomDatabase } from '@/app/api/editReservationService';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AlertMessage from '@/app/ui/AlertMessage';
import Mycard from '@/app/styles/mycard';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function User() {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [counter, setCounter] = useState(0);
  const roomsRedux = useSelector((state) => state.rooms);
  const [loading, setLoading] = useState(true);

  // Usuwanie:
  const [openWindowToDelete, setOpenWindowToDelete] = useState(false);
  const [deleteRoom, setDeleteRoom] = useState();
  const [nameRomm, setNameRoomDelete] = useState();
  const [hourRomm, setHourRoomDelete] = useState();

  // Alert
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Edycja zarezerwowanej sali
  const [openWindowToEdit, setOpenWindowToEdit] = useState(false);
  const [editRoomId, setEditRoomId] = useState('');
  const [editReservationDate, setEditReservationDate] = useState('');
  const [oldReservationDate, setOldReservationDate] = useState('');
  const [editHour, setEditHour] = useState('');
  const [oldHour, setOldHour] = useState('');
  const [editNameRoom, setEditNameRoom] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Eksport:
  const [openExport, setOpenExport] = useState(false);
  const [sheetNameExport, setSheetNameExport] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const tokenValid = checkTokenUser();
    if (tokenValid) {
      fetchReservation(dispatch).then(() => setLoading(false));
    }
  }, [dispatch]);

  // Sprawdzam czy jest to admin:
  const userId = parseInt(localStorage.getItem('user_id'));
  const role = roomsRedux
    .filter((room) => room.id === userId)
    .map((room) => room.role);
  const roleCheck = role[0];

  useEffect(() => {
    if (roomsRedux.length > 0) {
      const userId = localStorage.getItem('user_id');
      const filteredRooms = roomsRedux.filter(
        (user) => user.id === parseInt(userId)
      );

      // Filtracja po nazwie sali
      const filteredByRoom = filteredRooms.filter((el) =>
        el.name_room.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Filtracja po godzinie
      const filteredByTime = filteredByRoom.filter((el) =>
        selectedTime ? el.reservation_time === selectedTime : true
      );

      setFilteredData(filteredByTime);
      setCounter(filteredByTime.length);
      setCurrentPage(1);
    }
  }, [roomsRedux, searchQuery, selectedTime]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (page) => {
      onPageChange(page);
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          disabled={i === currentPage}
          style={{
            margin: '0 5px',
            padding: '8px 12px',
            backgroundColor: i === currentPage ? '#ffba00' : '#333',
            border: '1px solid #444',
            cursor: i === currentPage ? 'default' : 'pointer',
            borderRadius: '5px',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>{pages}</div>
    );
  };

  // Wyszukiwarka
  const styles = {
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '4px',
      backgroundColor: '#fff',
      padding: '0.5em',
      width: '100%',
      maxWidth: '250px',
      margin: '0 auto',
      marginBottom: '2em',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
    input: {
      flex: 1,
      padding: '0.5em 1em',
      fontSize: '14px',
      border: '1px solid #00796b',
      borderRadius: '4px',
      outline: 'none',
      color: '#00796b',
      backgroundColor: '#fff',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: '#004d40',
    },
    icon: {
      position: 'absolute',
      right: '10px',
      color: '#006400',
    },
  };

  // Usuwanie:
  const handleClickOpenDelete = (id_room, name_room, reservation_time) => {
    setOpenWindowToDelete(true);
    setDeleteRoom(id_room);
    setNameRoomDelete(name_room);
    setHourRoomDelete(reservation_time);
  };

  const handleCloseWindowDelete = () => {
    setOpenWindowToDelete(false);
  };

  const handleAcceptDelete = () => {
    deleteRoomDatabase(deleteRoom, setMessage, setShowAlert);
    setOpenWindowToDelete(false);
  };

  // Edycja
  const handleEditClose = () => {
    setOpenWindowToEdit(false);
  };

  const handleEditOpen = (
    id_room,
    reservation_date,
    reservation_time,
    name_room,
    room
  ) => {
    setEditRoomId(room);
    setEditReservationDate(formatDateInput(reservation_date));
    setOldReservationDate(formatDateInput(reservation_date));
    setEditHour(reservation_time);
    setOldHour(reservation_time);
    setEditNameRoom(name_room);
    setOpenWindowToEdit(true);
  };

  const handleAcceptEdit = () => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const editTimeInMinutes = timeToMinutes(editHour);
    const startLimit = timeToMinutes('08:00');
    const endLimit = timeToMinutes('15:00');

    if (editTimeInMinutes > endLimit || editTimeInMinutes < startLimit) {
      setOpenWindowToEdit(false);
      setMessage(
        'Rezerwacje są dostępne w godzinach 08:00 - 15:00. Proszę wybrać odpowiednią godzinę.'
      );
      setShowAlert(true);
    } else {
      console.log('OK', editTimeInMinutes);
      setOpenWindowToEdit(false);
      editRoomDatabase(
        editRoomId,
        editReservationDate,
        editHour,
        setMessage,
        setShowAlert,
        oldHour,
        oldReservationDate,
        roomsRedux
      );
    }
  };

  // Eksport do excela
  const handleClickOpenExport = () => {
    if (roleCheck === 'user') {
      setMessage('Operację eksportu może wykonać tylko Administrator.');
      setShowAlert(true);
    } else {
      setOpenExport(true);
    }
  };

  const handleCloseExport = () => {
    setOpenExport(false);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(roomsRedux);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheetNameExport || 'Sheet1'
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `${fileName || 'data'}.xlsx`);
    handleCloseExport();
  };

  // Ładowanie danych
  if (loading) {
    return <LoadingDate />;
  }

  return (
    <div className="wrapper">
      <Wrapperheader>
        <Mybutton
          style={{
            position: 'absolute',
            left: '1%',
            top: '8%',
          }}
          onClick={goToMain}
        >
          Powrót
        </Mybutton>
      </Wrapperheader>

      <Mycard>
        <div className="wrapper_info">
          <div className="info_user">
            Wszystkie Twoje rezerwacje są teraz dostępne w jednym miejscu.
            Przeglądaj je, edytuj lub usuń w zależności od potrzeb
          </div>
          <div style={styles.searchContainer}>
            <SearchIcon style={styles.icon} />
            <input
              type="text"
              placeholder="Wyszukaj po Sali"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.input}
              onFocus={(e) =>
                (e.target.style.borderColor = styles.inputFocus.borderColor)
              }
              onBlur={(e) => (e.target.style.borderColor = '#00796b')}
            />
          </div>

          <div>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#8e8d8b',
                color: '#fff',
                height: '40px',
                width: '180px',
              }}
              onClick={handleClickOpenExport}
              startIcon={<FileDownloadIcon />}
            >
              Export Excel
            </Button>
          </div>

          <div className="counter_container">Liczba Rezerwacji: {counter}</div>
        </div>
      </Mycard>

      <div className="filter_time">
        <label htmlFor="time-filter">Wybierz godzinę:</label>
        <select
          id="time-filter"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Wszystkie godziny</option>
          <option value="08:00">08:00</option>
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="12:00">12:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
        </select>
      </div>

      <table className="table_room">
        <caption className="table_header">Zarządzaj rezerwacjami</caption>
        <thead className="table_thead">
          <tr>
            <th>Sala konferencyjna</th>
            <th>Godzina rezerwacji</th>
            <th>Data rezerwacji</th>
            <th>EDYCJA</th>
            <th>USUWANIE</th>
          </tr>
        </thead>
        <tbody className="table_value">
          {currentData.map((el, index) => (
            <tr key={index}>
              <td>{el.name_room}</td>
              <td>{el.reservation_time}</td>
              <td>{formatDate(el.reservation_date)}</td>
              <td style={{ textAlign: 'center' }}>
                <Mybutton
                  className="button_edit"
                  style={{
                    color: '#ffba00',
                    border: '2px solid #ffba00',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ffba00';
                    e.target.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ffba00';
                  }}
                  onClick={() =>
                    handleEditOpen(
                      el.id_room,
                      el.reservation_date,
                      el.reservation_time,
                      el.name_room,
                      el.room
                    )
                  }
                >
                  Edytuj
                </Mybutton>
              </td>
              <td style={{ textAlign: 'center', maxWidth: '150px' }}>
                <Mybutton
                  className="button_delete"
                  style={{
                    color: 'red',
                    border: '2px solid red',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ff0000';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'red';
                  }}
                  onClick={() =>
                    handleClickOpenDelete(
                      el.id_room,
                      el.name_room,
                      el.reservation_time
                    )
                  }
                >
                  Usuń
                </Mybutton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Usuwanie okno */}
      <React.Fragment>
        <Dialog
          open={openWindowToDelete}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Czy chcesz rezerwację?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Pokój: {nameRomm} z godziny: {hourRomm} zostanie usunięty
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Mybutton
              style={{
                color: 'red',
                border: '2px solid red',
                backgroundColor: 'transparent',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff0000';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'red';
              }}
              onClick={handleCloseWindowDelete}
            >
              Anuluj
            </Mybutton>
            <Mybutton
              style={{
                color: 'green',
                border: '2px solid green',
                backgroundColor: 'transparent',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'green';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'green';
              }}
              onClick={() => handleAcceptDelete()}
            >
              Akceptuję
            </Mybutton>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {/* Edycja okno */}
      <Dialog
        open={openWindowToEdit}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleEditClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Edycja sali konferencyjnej: {editNameRoom}</DialogTitle>
        <DialogContent>
          <div id="alert-dialog-slide-description" className="edit_form">
            <label className="edit_label" htmlFor="date-input">
              Wybierz datę:
            </label>
            <input
              type="date"
              id="date-input"
              value={editReservationDate}
              onChange={(e) => setEditReservationDate(e.target.value)}
              min={today}
              required
            />

            <label className="edit_label" htmlFor="time-input">
              Wybierz godzinę:
            </label>
            <input
              type="time"
              id="time-input"
              value={editHour}
              onChange={(e) => setEditHour(e.target.value)}
              min="08:00"
              max="15:00"
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Mybutton
            style={{
              color: 'red',
              border: '2px solid red',
              backgroundColor: 'transparent',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff0000';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'red';
            }}
            onClick={handleEditClose}
          >
            Anuluj
          </Mybutton>
          <Mybutton
            style={{
              color: 'green',
              border: '2px solid green',
              backgroundColor: 'transparent',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'green';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'green';
            }}
            onClick={handleAcceptEdit}
          >
            Akceptuję
          </Mybutton>
        </DialogActions>
      </Dialog>

      {/* Eksport do exela */}
      <React.Fragment>
        <Dialog
          maxWidth={'90%'}
          open={openExport}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            {
              'Podaj nazwę arkusza, gdzie będą wyeksportowane dane w Excelu oraz nazwę pliku'
            }
          </DialogTitle>
          <DialogContent>
            <div id="alert-dialog-slide-description">
              <TextField
                autoFocus
                margin="dense"
                label="Nazwa Arkusza w Excelu"
                fullWidth
                value={sheetNameExport}
                onChange={(e) => setSheetNameExport(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Nazwa pliku Excel'owego"
                fullWidth
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Mybutton
              style={{
                color: 'red',
                border: '2px solid red',
                backgroundColor: 'transparent',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff0000';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'red';
              }}
              onClick={handleCloseExport}
            >
              Anuluj
            </Mybutton>
            <Mybutton
              style={{
                color: 'green',
                border: '2px solid green',
                backgroundColor: 'transparent',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'green';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'green';
              }}
              onClick={handleExport}
            >
              Akceptuję
            </Mybutton>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <AlertMessage
        showAlert={showAlert}
        message={message}
        setShowAlert={setShowAlert}
      />
    </div>
  );
}
