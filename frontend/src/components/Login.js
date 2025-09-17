import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      if (userInfo.role === 'citizen') navigate('/dashboard');
      else if (userInfo.role === 'admin') navigate('/admin');
      else if (userInfo.role === 'worker') navigate('/worker/dashboard');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Signing in...');
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      
      // --- THIS IS THE FIX ---
      // Be very specific about who can log in here.
      if (data.role === 'citizen') {
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('Login successful! Redirecting...', { id: toastId });
        navigate('/dashboard'); // Redirect CITIZENS to their dashboard
      } else {
        // If an admin or worker tries to log in here, show an error.
        toast.error('Access Denied. Please use your designated portal.', { id: toastId });
      }
      // --- END OF FIX ---

    } catch (error) {
      toast.error('Invalid credentials. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="form-container">
      <h1>Citizen Portal</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
        </div>
        <button type="submit" className="btn">Sign In</button>
      </form>
      <div className="form-footer">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;