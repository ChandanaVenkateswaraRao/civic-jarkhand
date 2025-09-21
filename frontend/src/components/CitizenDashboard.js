// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import API from '../api'; // 1. IMPORT THE CENTRAL API SERVICE
// import MapView from './MapView';
// import { FaTags, FaClock, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';
// import ImageModal from './ImageModal';
// import Spinner from './Spinner'; // Import Spinner for loading state
// import toast from 'react-hot-toast'; // Import toast for error notifications
// import Leaderboard from './Leaderboard';
// const CitizenDashboard = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const [selectedImage, setSelectedImage] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchReports = async () => {
//       setLoading(true);
//       try {
//         // 2. USE THE API SERVICE, not axios. No need for config.
//         const { data } = await API.get('/api/reports');
//         setReports(data);
//       } catch (error) {
//         toast.error('Could not fetch your reports.');
//         console.error('Failed to fetch reports', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, [navigate]);

//   return (
//     <div>
//       <div className="dashboard-header">
//         <h1>My Submitted Reports</h1>
//         <Link to="/new-report" className="btn btn-secondary" style={{ width: 'auto' }}>
//           Report a New Issue
//         </Link>
//       </div>

//       {loading ? (
//         <Spinner />
//       ) : (
//         <>
//           {reports.length > 0 && <MapView reports={reports} />}
//           <div className="report-grid">
//             {reports.length > 0 ? (
//               reports.map((report) => (
//                 <div key={report._id} className="report-card">
//                   {report.photo && (
//                     <img
//                       // 3. USE THE API BASE URL for the image source
//                       src={`${process.env.REACT_APP_API_URL}${report.photo}`}
//                       alt={report.title}
//                       className="card-image"
//                       onClick={() => setSelectedImage(`${process.env.REACT_APP_API_URL}${report.photo}`)}
//                     />
//                   )}
//                   <div className="card-header">
//                     <h3>{report.title}</h3>
//                   </div>
//                   <div className="card-body">
//                     <p><FaTags className="icon" /> <strong>Category:</strong> {report.category}</p>
//                     <p><FaClock className="icon" /> <strong>Submitted:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
//                     <p><FaExclamationTriangle className="icon" /> <strong>Status:</strong> <span className={`status-badge status-${report.status.replace(/\s+/g, '')}`}>{report.status}</span></p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="empty-state">
//                 <FaClipboardList className="empty-state-icon" />
//                 <h3>No Reports Submitted Yet</h3>
//                 <p>Click "Report a New Issue" to get started.</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
//     </div>
//   );
// };

// export default CitizenDashboard;

// src/components/CitizenDashboard.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import MapView from "./MapView";
import { FaTags, FaClock, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import ImageModal from "./ImageModal";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
// import Chatbot from "./Chatbot"; // Import Chatbot

const CitizenDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/reports");
        setReports(data);
      } catch (error) {
        toast.error("Could not fetch your reports.");
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [navigate]);

  return (
    <div>
      <div className="dashboard-header">
        <h1>My Submitted Reports</h1>
        <Link to="/new-report" className="btn btn-secondary" style={{ width: "auto" }}>
          Report a New Issue
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {reports.length > 0 && <MapView reports={reports} />}
          <div className="report-grid">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report._id} className="report-card">
                  {report.photo && (
                    <img
                      src={report.photo}
                      alt={report.title}
                      className="card-image"
                      onClick={() => setSelectedImage(report.photo)}
                    />
                  )}
                  <div className="card-header">
                    <h3>{report.title}</h3>
                  </div>
                  <div className="card-body">
                    <p>
                      <FaTags className="icon" /> <strong>Category:</strong> {report.category}
                    </p>
                    <p>
                      <FaClock className="icon" /> <strong>Submitted:</strong>{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <FaExclamationTriangle className="icon" /> <strong>Status:</strong>{" "}
                      <span className={`status-badge status-${report.status.replace(/\s+/g, "")}`}>
                        {report.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaClipboardList className="empty-state-icon" />
                <h3>No Reports Submitted Yet</h3>
                <p>Click "Report a New Issue" to get started.</p>
              </div>
            )}
          </div>
        </>
      )}

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />

      {/* --- Chatbot Fixed Bottom-Right --- */}
      {/* <Chatbot /> */}
    </div>
  );
};

export default CitizenDashboard;
