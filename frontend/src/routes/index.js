import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Welcome from '../pages/Welcome';
import Dashboard from '../pages/Dashboard';
import '../App.css';
import ProtectedRoute from '../components/ProtectedRoute';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
    </Routes>
  );
};

export default Router;
