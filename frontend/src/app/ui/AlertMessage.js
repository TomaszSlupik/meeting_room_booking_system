import React from 'react';
import { Stack, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AlertMessage = ({ showAlert, message, setShowAlert }) => {
  return (
    <Stack
      style={{
        position: 'absolute',
        bottom: '2%',
        left: '2%',
        zIndex: 10,
        width: 'auto',
        maxHeight: '300px',
      }}
      spacing={2}
      sx={{ width: '20%' }}
    >
      {showAlert && (
        <Alert
          variant="filled"
          severity={
            message === 'Rekord został usunięty' ||
            message === 'Edycja nastąpiła pomyślnie' ||
            message == 'Twoje rezerwacja przebiegła pomyślnie'
              ? 'success'
              : message === 'Trwa usuwanie wielu rekordów, poczekaj' ||
                  message === 'Trwa usuwanie rekordu, poczekaj'
                ? 'error'
                : 'error'
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
  );
};

export default AlertMessage;
