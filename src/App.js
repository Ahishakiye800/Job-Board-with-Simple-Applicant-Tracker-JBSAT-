import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import CreateJob from './pages/employer/CreateJob';
import EditJob from './pages/employer/EditJob';
import ManageApplications from './pages/employer/ManageApplications';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import MyApplications from './pages/seeker/MyApplications';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Employer Routes */}
            <Route
              path="/employer/dashboard"
              element={
                <PrivateRoute role="employer">
                  <EmployerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/create-job"
              element={
                <PrivateRoute role="employer">
                  <CreateJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/edit-job/:id"
              element={
                <PrivateRoute role="employer">
                  <EditJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/applications/:jobId"
              element={
                <PrivateRoute role="employer">
                  <ManageApplications />
                </PrivateRoute>
              }
            />

            {/* Seeker Routes */}
            <Route
              path="/seeker/dashboard"
              element={
                <PrivateRoute role="seeker">
                  <SeekerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/seeker/applications"
              element={
                <PrivateRoute role="seeker">
                  <MyApplications />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;