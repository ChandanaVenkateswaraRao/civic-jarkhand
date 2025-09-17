import React from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaTasks, FaCheckCircle, FaUserShield, FaUserEdit, FaHardHat } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page-container">
      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Building a Cleaner, Greener Jharkhand, Together.</h1>
          <p className="hero-subtitle">
            Your direct line to report civic issues like potholes, non-functional streetlights, or overflowing bins, and help us build a more responsive and efficient government.
          </p>
          {/* This button now smoothly scrolls down to the portal choices */}
          <a href="#portals" className="btn btn-cta">
            Get Started
          </a>
        </div>
      </section>

      {/* --- Portal Selection Section (NEW) --- */}
      <section id="portals" className="portals-section">
        <h2 className="section-title">Choose Your Portal</h2>
        <div className="choice-container">
          {/* Admin Portal Card */}
          <Link to="/admin/login" className="choice-card">
            <FaUserShield className="choice-icon" />
            <h2>Administrator</h2>
            <p>Login for municipal staff to manage and assign reports.</p>
          </Link>
          {/* Worker Portal Card */}
          <Link to="/worker/login" className="choice-card">
            <FaHardHat className="choice-icon" />
            <h2>Field Worker</h2>
            <p>Login to view and resolve your assigned civic issues.</p>
          </Link>
          {/* Citizen Portal Card */}
          <Link to="/login" className="choice-card">
            <FaUserEdit className="choice-icon" />
            <h2>Citizen</h2>
            <p>Login or Register here to report and track issues.</p>
          </Link>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="how-it-works-section">
        <h2 className="section-title">A Simple Three-Step Process</h2>
        <div className="steps-container">
          <div className="step-card">
            <FaCamera className="step-icon" />
            <h3>1. Report the Issue</h3>
            <p>Snap a photo, and our AI will categorize it. Your location is automatically tagged for accuracy.</p>
          </div>
          <div className="step-card">
            <FaTasks className="step-icon" />
            <h3>2. Track its Progress</h3>
            <p>Follow your report's journey in real-time, from submission and acknowledgment to final resolution.</p>
          </div>
          <div className="step-card">
            <FaCheckCircle className="step-icon" />
            <h3>3. See the Resolution</h3>
            <p>The relevant department and workers are notified instantly, leading to faster action for everyone.</p>
          </div>
        </div>
      </section>

      {/* --- Mission Statement Section --- */}
      <section className="mission-section">
        <h2 className="section-title">Our Commitment</h2>
        <p>
          This platform, an initiative under the "Clean & Green Technology" theme by the Department of Higher and Technical Education, Government of Jharkhand, aims to foster greater civic engagement and government accountability. By leveraging technology, we empower every citizen to become an active partner in creating a more sustainable and well-maintained environment.
        </p>
      </section>
    </div>
  );
};

export default HomePage;