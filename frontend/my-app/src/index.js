import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext'; 

import Navbar from './components/navbar';

// pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTickets from './pages/MyTickets';
import Report from './pages/Report';
import TicketDetail from './pages/ticket-detail';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. ✅ หุ้ม <Router> ด้วย <AuthProvider> */}
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Home page with hero, features, footer */}
          <Route path="/" element={<App />} />

          {/* Other pages - Navbar is already rendered above by Router */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/report" element={<Report />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();