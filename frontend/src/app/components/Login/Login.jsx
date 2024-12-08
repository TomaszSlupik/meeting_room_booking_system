'use client';
import React, { useState } from 'react';
import './Login.css';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Mybutton from '@/app/styles/mybutton';
import AlertMessage from '@/app/ui/AlertMessage';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Alert
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      const { access_token, user_id } = response.data;
      localStorage.setItem('token', access_token);

      localStorage.setItem('user_id', user_id);

      window.location.href = '/booking/main';
    } catch (err) {
      setMessage('Błąd logowania: Sprawdź dane logowania');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="box">
          <h3>Logowanie</h3>
          <div className="form">
            <div className="form_login">
              <TextField
                label="Login"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ color: 'white' }}
                InputProps={{
                  style: { color: 'white', borderColor: 'white' },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
            </div>
            <div className="form_password">
              <TextField
                type="password"
                label="Hasło"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ color: 'white' }}
                InputProps={{
                  style: { color: 'white', borderColor: 'white' },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
            </div>
          </div>

          <Mybutton
            style={{
              position: 'absolute',
              bottom: '4%',
              right: '4%',
            }}
            onClick={handleLogin}
          >
            Zaloguj się
          </Mybutton>
        </div>
      </div>

      <AlertMessage
        showAlert={showAlert}
        message={message}
        setShowAlert={setShowAlert}
      />
    </div>
  );
}
