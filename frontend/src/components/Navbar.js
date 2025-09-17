import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        CivicTracker
      </Link>
      <ul className="navbar-links">
        {userInfo ? (
          // View when a user IS logged in
          <>
            <li>
              <span className="navbar-welcome">Welcome, {userInfo.name}</span>
            </li>

            {/* This is the logic for showing the correct dashboard link */}
            {userInfo.role === 'admin' && (
              <li><Link to="/admin">Admin Dashboard</Link></li>
            )}
            
            {userInfo.role === 'worker' && (
              <li><Link to="/worker/dashboard">Worker Dashboard</Link></li>
            )}

            {userInfo.role === 'citizen' && (
              // --- THIS IS THE FIX ---
              // The link text is "My Reports", and it must point to "/dashboard".
              <li><Link to="/dashboard">My Reports</Link></li>
              // --- END OF FIX ---
            )}

            <li>
              <button onClick={logoutHandler} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          // View when a user is LOGGED OUT
          <>
            <li><Link to="/admin/login">Admin Portal</Link></li>
            <li><Link to="/worker/login">Worker Portal</Link></li>
            <li>
              <Link to="/login" className="nav-link--primary">Citizen Portal</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;