import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import OneSignal from 'react-onesignal'

// Initialize OneSignal
OneSignal.init({
  appId: process.env.REACT_APP_ONESIGNAL_APP_ID,
  notifyButton: { enable: true },
  allowLocalhostAsSecureOrigin: true,
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<React.StrictMode><App /></React.StrictMode>)