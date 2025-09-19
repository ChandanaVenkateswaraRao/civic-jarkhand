import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import hamburger and close icons

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // State to manage the mobile menu's visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to handle logging out a user
  const logoutHandler = () => {
    setIsMobileMenuOpen(false); // Ensure menu closes on logout
    localStorage.removeItem('userInfo');
    navigate('/'); // Redirect to the main home page
  };

  // An effect that runs whenever the page location changes (i.e., user navigates).
  // This ensures the mobile menu automatically closes when a link is clicked.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          CivicTracker
        </Link>
        
        {/* --- Desktop Menu --- */}
        {/* This list is targeted by CSS to be hidden on mobile screens. */}
        {/* The key fix is adding the "desktop-menu" class here. */}
        <ul className="navbar-links desktop-menu">
          {userInfo ? (
            // Links shown when a user IS logged in
            <>
              <li><span className="navbar-welcome">Welcome, {userInfo.name}</span></li>
              {userInfo.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
              {userInfo.role === 'worker' && <li><Link to="/worker/dashboard">Worker Dashboard</Link></li>}
              {userInfo.role === 'citizen' && <li><Link to="/dashboard">My Reports</Link></li>}
              <li><button onClick={logoutHandler} className="logout-btn">Logout</button></li>
            </>
          ) : (
            // Links shown when a user IS LOGGED OUT
            <>
              <li><Link to="/admin/login">Admin Portal</Link></li>
              <li><Link to="/worker/login">Worker Portal</Link></li>
              <li><Link to="/login" className="nav-link--primary">Citizen Portal</Link></li>
            </>
          )}
        </ul>

        {/* --- Mobile Menu Hamburger Icon --- */}
        {/* This button is only visible on mobile screens (controlled by CSS). */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label="Toggle menu"
        >
          {/* Shows a close icon (X) when the menu is open, and a hamburger icon otherwise */}
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* --- Mobile Menu Overlay --- */}
      {/* This full-screen menu is conditionally rendered based on the state. */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-links mobile-menu-links">
        {userInfo ? (
            // Mobile links for a LOGGED IN user
            <>
              {userInfo.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
              {userInfo.role === 'worker' && <li><Link to="/worker/dashboard">Worker Dashboard</Link></li>}
              {userInfo.role === 'citizen' && <li><Link to="/dashboard">My Reports</Link></li>}
              <li><button onClick={logoutHandler} className="logout-btn">Logout</button></li>
            </>
          ) : (
            // Mobile links for a LOGGED OUT user
            <>
              <li><Link to="/admin/login">Admin Portal</Link></li>
              <li><Link to="/worker/login">Worker Portal</Link></li>
              <li><Link to="/login" className="nav-link--primary">Citizen Portal</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;