import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Component Imports
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard'; // Import the new dashboard
import ReportForm from './components/ReportForm';
import WorkerLogin from './components/WorkerLogin';
// import WorkerDashboard from './components/WorkerDashboard';
function App() {
  return (
    <Router>
      {/* Toaster provides pop-up notifications for the entire app */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
      
      <Navbar />
      
      <main className="container">
        <Routes>
          {/* Main and Auth Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} /> {/* ADD THIS NEW ROUTE */}
          
          {/* Action Routes */}
          <Route path="/new-report" element={<ReportForm />} />

          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;