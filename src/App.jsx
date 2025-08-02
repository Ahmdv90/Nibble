import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/InPages/ForgotPassword';
import VerifyCode from './pages/InPages/Verify';
import ResetPass from './pages/InPages/ResetPass';
import Message from './pages/Message';
import Explore from './pages/Explore';
import Favorite from './pages/Favorite';
import Orders from './pages/Orders';
import MainLayout from './Layouts/MainLayout';
import PrivateLayout from './Layouts/PrivateLayout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('__token_'));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('__token_'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<MainLayout />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPass />} />
      </Route>
      <Route element={<PrivateLayout isAuthenticated={isAuthenticated} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}
