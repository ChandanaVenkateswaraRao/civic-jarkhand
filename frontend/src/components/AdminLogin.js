import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // 1. IMPORT THE CENTRAL API SERVICE
import toast from 'react-hot-toast'; // 2. Import toast for notifications
import { FaEnvelope, FaLock } from 'react-icons/fa'; // 3. Import icons for inputs

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // This logic is fine, it just redirects if already logged in.
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.role === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Signing in...'); // Show loading notification

    try {
      // 4. USE THE API SERVICE, not axios directly
      const { data } = await API.post('/auth/login', { email, password });

      if (data.role === 'admin') {
        toast.success('Login successful! Redirecting...', { id: toastId });
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/admin');
      } else {
        // Deny access if a non-admin user tries to log in
        toast.error('Access Denied: This portal is for administrators only.', { id: toastId });
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="form-container">
      <h1>Administrator Portal</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Email Address</label>
          {/* 5. Add input-group wrapper and icon */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.gov"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          {/* 6. Add input-group wrapper and icon */}
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

export default AdminLogin;