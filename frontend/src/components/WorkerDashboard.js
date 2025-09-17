import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import MapView from './MapView';
import ImageModal from './ImageModal';
import { 
  FaUserCheck, 
  FaTags, 
  FaExclamationTriangle, 
  FaClipboardList 
} from 'react-icons/fa';

const WorkerDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // This function fetches data from the `reports` collection based on the logged-in worker's role and category.
  const fetchWorkerReports = useCallback(async () => {
    try {
      // This single API call executes the entire backend workflow you described.
      const { data } = await API.get('/api/reports/worker');
      setReports(data);
    } catch (error) {
      toast.error('Could not fetch your assigned reports.');
      // This handles cases where the login token is invalid or the worker has no category assigned.
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('userInfo');
        navigate('/worker/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Adding `navigate` makes this function stable and prevents the infinite loop.

  useEffect(() => {
    setLoading(true);
    fetchWorkerReports();
  }, [fetchWorkerReports]); // Because the function is stable, this now runs only once on component load.

  return (
    <div>
      <div className="dashboard-header">
        <h1>My Assigned Tasks</h1>
      </div>
      
      {loading ? (
        <Spinner />
      ) : (
        <>
          <MapView reports={reports} />
          
          {reports.length > 0 ? (
            <div className="report-grid">
              {reports.map((report) => (
                <div key={report._id} className="report-card">
                  {report.photo && (
                    <img 
                      src={`${process.env.REACT_APP_API_URL}${report.photo}`} 
                      alt={report.title} 
                      className="card-image"
                      onClick={() => setSelectedImage(`${process.env.REACT_APP_API_URL}${report.photo}`)}
                    />
                  )}
                  <div className="card-header">
                    <h3>{report.title}</h3>
                  </div>
                  <div className="card-body">
                    <p><FaTags className="icon" /> <strong>Category:</strong> {report.category}</p>
                    <p><FaUserCheck className="icon" /> <strong>Submitted By:</strong> {report.submittedBy.name}</p>
                    <p><FaExclamationTriangle className="icon" /> <strong>Status:</strong> <span className={`status-badge status-${report.status.replace(/\s+/g, '')}`}>{report.status}</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaClipboardList className="empty-state-icon" />
              <h3>No Assigned Reports</h3>
              <p>You currently have no tasks assigned to your category.</p>
            </div>
          )}
        </>
      )}

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default WorkerDashboard;