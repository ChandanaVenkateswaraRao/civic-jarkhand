import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const WorkerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.role === 'worker') {
      navigate('/worker/dashboard');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Signing in...');

    try {
      const { data } = await API.post('/api/auth/login', { email, password });

      if (data.role === 'worker') {
        toast.success('Login successful! Redirecting...', { id: toastId });
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/worker/dashboard');
      } else {
        toast.error('Access Denied: This portal is for workers only.', { id: toastId });
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="form-container">
      <h1>Worker Portal</h1>
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
              placeholder="your-worker-email@example.com"
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
    </div>
  );
};

export default WorkerLogin;