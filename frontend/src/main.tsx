import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><AuthProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route element={<ProtectedRoute/>}><Route path="/" element={<Dashboard/>}/></Route><Route path="*" element={<Login/>}/></Routes></AuthProvider></BrowserRouter></React.StrictMode>
);
