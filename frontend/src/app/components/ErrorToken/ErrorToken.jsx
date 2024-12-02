"use client"; 
import React from 'react'
import './ErrorToken.css'
import Mybutton from '@/app/styles/mybutton'
import { goToLogin } from '@/app/utils/goToLogin';

export default function ErrorToken() {
  return (
    <div className="error-container">
    <div className="error-message">
      <h2>Musisz być zalogowany, aby używać aplikacji.</h2>
      <p>Proszę,&nbsp; 
        <Mybutton
        onClick={goToLogin}
        >Zaloguj się</Mybutton>
        &nbsp;,aby kontynuować.</p>
    </div>
  </div>
  )
}
