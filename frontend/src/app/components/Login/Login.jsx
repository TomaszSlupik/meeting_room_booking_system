"use client"; 
import React, { useState } from 'react';
import './Login.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);  


      window.location.href = '/booking/main';
    } catch (err) {
      setError('Błąd logowania: Sprawdź dane logowania');
    }
  };

    return (
      <div>
        <div className="wrapper">
            <div className="box">
                <h3>Logowanie</h3>
                <div className="form">
                    <div className='form_login'>
                      <TextField
                        label="Login"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ color: 'white' }}
                      />
                    </div>
                    <div
                    className='form_password'
                    >
                        <TextField
                          type="password"
                          label="Hasło"
                          variant="outlined"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ color: 'white' }}
                        />
                    </div>
                </div>
               
                
                <Button 
                style={{
                  position: 'absolute',
                  bottom: '4%',
                  right: '4%'
                }}
                variant="outlined" onClick={handleLogin}>Zaloguj się</Button>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
      </div>
    );
  }