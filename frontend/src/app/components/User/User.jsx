"use client"; 
import Mybutton from '@/app/styles/mybutton';
import Wrapperheader from '@/app/styles/wrapperheader';
import { goToMain } from '@/app/utils/goToMain';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './User.css';
import LoadingDate from '../LoadingDate/LoadingDate';
import { checkTokenUser } from '@/app/utils/auth';
import {formatDate } from '@/app/utils/formatDate';
import { fetchReservation } from '@/app/api/reservationService';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { deleteRoomDatabase } from '@/app/api/deleteReservationService';
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TextField from "@mui/material/TextField";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function User() {

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [counter, setCounter] = useState(0);
  const roomsRedux = useSelector(state => state.rooms);
  const [loading, setLoading] = useState(true);

  // Usuwanie:
  const [openWindowToDelete, setOpenWindowToDelete] = useState(false);
  const [deleteRoom, setDeleteRoom] = useState();
  const [nameRomm, setNameRoomDelete] = useState()
  const [hourRomm, setHourRoomDelete] = useState()
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Eksport:
  const [openExport, setOpenExport] = useState(false);
  const [sheetNameExport, setSheetNameExport] = useState("");
  const [fileName, setFileName] = useState("");


  useEffect(() => {
    const tokenValid = checkTokenUser();  
    if (tokenValid) {
      fetchReservation(dispatch)
        .then(() => setLoading(false));  
    }
  }, [dispatch]); 


  
  useEffect(() => {
 
    if (roomsRedux.length > 0) {
      const userId = localStorage.getItem("user_id");
      const filteredRooms = roomsRedux.filter(user => user.id === parseInt(userId));
  
      const filteredDate = filteredRooms.filter((el) =>
        el.name_room.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredData(filteredDate);
      setCounter(filteredDate.length);
      setCurrentPage(1);
    }
  }, [roomsRedux, searchQuery]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
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
            margin: "0 5px",
            padding: "8px 12px",
            backgroundColor: i === currentPage ? "#ffba00" : "#333",
            border: "1px solid #444",
            cursor: i === currentPage ? "default" : "pointer",
            borderRadius: "5px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {pages}
      </div>
    );
  };

  // Wyszukiwarka
  const styles = {
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: "4px",
      backgroundColor: "#fff",
      padding: "0.5em",
      width: "100%",
      maxWidth: "250px",
      margin: "0 auto",
      marginBottom: "2em",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
    input: {
      flex: 1,
      padding: "0.5em 1em",
      fontSize: "14px",
      border: "1px solid #00796b",
      borderRadius: "4px",
      outline: "none",
      color: "#00796b",
      backgroundColor: "#fff",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#004d40",
    },
    icon: {
      position: "absolute",
      right: "10px",
      color: "#006400",
    },
  };

  // Usuwanie:
  const handleClickOpenDelete = (id_room, name_room, reservation_time) => {
      setOpenWindowToDelete(true);
      setDeleteRoom(id_room)
      setNameRoomDelete(name_room)
      setHourRoomDelete(reservation_time)
  }

  const handleCloseWindowDelete = () => {
     setOpenWindowToDelete(false);
  }

  const handleAcceptDelete = () => {
        deleteRoomDatabase(deleteRoom, setMessage, setShowAlert)
        setOpenWindowToDelete(false);
  }

  // Eksport do excela
  const handleClickOpenExport = () => {
    setOpenExport(true);
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
      sheetNameExport || "Sheet1",
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `${fileName || "data"}.xlsx`);
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
            top: '8%'
          }}
          onClick={goToMain}
        >
          Powrót
        </Mybutton>
      </Wrapperheader>
        <div style={styles.searchContainer}>
        <SearchIcon style={styles.icon} />
          <input
            type="text"
            placeholder="Wyszukaj po Sali"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = styles.inputFocus.borderColor)}
            onBlur={(e) => (e.target.style.borderColor = "#00796b")}
          />

        </div>

        <div>
        <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#8e8d8b",
                      color: "#fff",
                      marginRight: "1em",
                      height: "40px",
                      width: "180px",
                    }}
                    onClick={handleClickOpenExport}
                    startIcon={<FileDownloadIcon />}
                  >
                    Export Excel
                  </Button>
        </div>

        <div>
          Liczba Rezerwacji: 
          {
            counter
          }
        </div>

        <table className="table_room">
          <caption className="table_header">
            Zarządzaj rezerwacjami
          </caption>
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
                <td style={{ textAlign: "center" }}>
                  <Mybutton
                    className='button_edit'
                    style={{
                      color: "#ffba00",
                    }}
                  >
                    Edytuj
                  </Mybutton>
                </td>
                <td style={{ textAlign: "center", maxWidth: "150px" }}>
                  <Mybutton
                   className='button_delete'
                    style={{
                      color: "red",
                    }}
                    onClick={() =>
                      handleClickOpenDelete(el.id_room, el.name_room, el.reservation_time)
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
                  <DialogTitle>{"Czy chcesz rezerwację?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      Pokój: {nameRomm} z godziny: {hourRomm} zostanie usunięty
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="outlined"
                      style={{
                        color: 'black'
                      }}
                      onClick={handleCloseWindowDelete}
                    >
                      Anuluj
                    </Button>
                    <Button
                      style={{
                        color: 'black',
                        backgroundColor: 'green'
                      }}
                      variant="contained"
                      onClick={() => handleAcceptDelete()}
                    >
                      Akceptuję
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>

            {/* Eksport do exela */}
            <React.Fragment>
                <Dialog
                  maxWidth={"90%"}
                  open={openExport}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>
                    {
                      "Podaj nazwę arkusza, gdzie będą wyeksportowane dane w Excelu oraz nazwę pliku"
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
                    <Button variant="outlined" onClick={handleCloseExport}>
                      Anuluj
                    </Button>
                    <Button variant="contained" onClick={handleExport}>
                      Akceptuję
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>

            <Stack
          style={{
            position: "absolute",
            bottom: "2%",
            left: "2%",
            maxHeight: "300px",
            overflow: "scroll",
          }}
          spacing={2}
          sx={{ width: "20%" }}
        >
          {showAlert && (
            <Alert
              variant="filled"
              severity={
                message === "Rekord został usunięty" ||
                message === "Trwa dodawanie wielu rekordów, poczekaj"
                  ? "success"
                  : message === "Trwa usuwanie wielu rekordów, poczekaj" ||
                  message === "Trwa usuwanie rekordu, poczekaj"
                    ? "error"
                    : "warning"
              }
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={() => setShowAlert(false)}
                >
                  <CloseIcon />
                  
                </IconButton>
              }
            >
              {message}
            </Alert>
          )}
        </Stack>  
    </div>
  );
}
