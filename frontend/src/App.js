import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import WorkerLogin from './components/WorkerLogin';
import Register from './components/Register';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import ReportForm from './components/ReportForm';
import Leaderboard from './components/Leaderboard';
import Contact from './components/Contact';
import Profile from './components/Profile'; // Import the Profile component
import About from './components/About'; // Import the About component
import Chatbot from './components/Chatbot'; // Import the Chatbot component
function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} /> {/* Add the About route */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/new-report" element={<ReportForm />} />
          <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
        </Routes>
      </main>
      <Chatbot /> {/* Render Chatbot here to make it visible on all pages */}
    </Router>
  );
}

export default App;