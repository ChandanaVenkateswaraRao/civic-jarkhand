import React, { useState } from 'react';
import axios from 'axios';
// 1. Import 'Link' from react-router-dom
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        'https://civic-jarkhand.onrender.com/',
        { name, email, password },
        config
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data.message : error.message);
      alert('Registration failed. The email may already be in use.');
    }
  };

  return (
    <div className="form-container">
      <h1>Create Citizen Account</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn">Register</button>
      </form>
      {/* 2. Add the link back to the login page */}
      <div className="form-footer">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;