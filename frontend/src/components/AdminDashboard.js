import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import ImageModal from './ImageModal';
import Spinner from './Spinner';
import { 
  FaRegBuilding, 
  FaUserCheck, 
  FaTags, 
  FaExclamationTriangle, 
  FaClipboardList,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// --- Sub-component for the Worker Creation Form ---
const CreateWorkerForm = ({ onFormClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assignedCategory, setAssignedCategory] = useState('Pothole');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !assignedCategory) {
      toast.error('Please fill out all fields.');
      return;
    }
    const toastId = toast.loading('Creating worker account...');
    try {
      await API.post('/api/auth/worker', { name, email, password, assignedCategory });
      toast.success('Worker created successfully!', { id: toastId });
      // Clear and close the form after successful creation
      setName('');
      setEmail('');
      setPassword('');
      setAssignedCategory('Pothole');
      onFormClose(); // Tell the parent to hide the form
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create worker.', { id: toastId });
    }
  };

  return (
    <div className="form-container" style={{ margin: '0 auto 2rem auto', animation: 'fadeIn 0.5s ease-out' }}>
      <div className="form-header-with-close">
        <h2><FaUserPlus /> Register New Worker</h2>
        <button onClick={onFormClose} className="close-form-btn" aria-label="Close form">
          <FaTimes />
        </button>
      </div>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Worker's Name</label>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input 
              type="text" 
              placeholder="e.g., Ravi Kumar"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Worker's Email</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              placeholder="worker-email@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Temporary Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Create a strong temporary password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Worker's Assigned Category</label>
          <select value={assignedCategory} onChange={(e) => setAssignedCategory(e.target.value)}>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Trash">Trash</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn">Create Worker Account</button>
      </form>
    </div>
  );
};

// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCreateWorkerForm, setShowCreateWorkerForm] = useState(false);
  const navigate = useNavigate();

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await API.get('/reports');
      setReports(data);
    } catch (error) { 
      toast.error('Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchReports();
  }, [fetchReports]);

  const handleStatusChange = async (id, status) => {
    const toastId = toast.loading('Updating status...');
    try {
      await API.put(`/reports/${id}`, { status });
      toast.success('Status updated successfully!', { id: toastId });
      fetchReports(); // Refresh the list to show the change
    } catch (error) { 
      toast.error('Failed to update status.', { id: toastId });
    }
  };

  const filteredReports = reports.filter(report => filter === 'All' || report.status === filter);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Administrator Dashboard</h1>
        {/* Button to toggle the worker creation form */}
        {!showCreateWorkerForm && (
          <button 
            className="btn btn-secondary" 
            style={{ width: 'auto' }}
            onClick={() => setShowCreateWorkerForm(true)}
          >
            <FaUserPlus style={{ marginRight: '8px' }} />
            Create Worker Account
          </button>
        )}
      </div>

      {/* Conditionally render the worker creation form */}
      {showCreateWorkerForm && (
        <CreateWorkerForm onFormClose={() => setShowCreateWorkerForm(false)} />
      )}
      
      {/* Section for viewing and managing reports */}
      <div className="reports-section" style={{ marginTop: '2rem' }}>
        <div className="dashboard-header">
            <h2>All Submitted Reports</h2>
            <div className="action-bar">
                <label>Filter by status:</label>
                <select onChange={(e) => setFilter(e.target.value)} className="form-group">
                    <option value="All">All</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>
        </div>
        
        {loading ? (
          <Spinner />
        ) : (
          <>
            <MapView reports={filteredReports} />
            
            {filteredReports.length > 0 ? (
              <div className="report-grid">
                {filteredReports.map((report) => (
                  <div key={report._id} className="report-card" >
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
                      <p><FaTags className="icon" /> <strong>Category:</strong> {report.category}</p>
                      <p><FaUserCheck className="icon" /> <strong>Submitted By:</strong> {report.submittedBy.name}</p>
                      <p><FaRegBuilding className="icon" /> <strong>Assigned To:</strong> {report.assignedTo}</p>
                      <p><FaExclamationTriangle className="icon" /> <strong>Status:</strong> <span className={`status-badge status-${report.status.replace(/\s+/g, '')}`}>{report.status}</span></p>
                    </div>
                    <div className="card-footer form-group">
                      <label>Update Status:</label>
                      <select defaultValue={report.status} onChange={(e) => handleStatusChange(report._id, e.target.value)}>
                        <option value="Submitted">Submitted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaClipboardList className="empty-state-icon" />
                <h3>No Reports Found</h3>
                <p>There are no reports matching the current filter.</p>
              </div>
            )}
          </>
        )}
      </div>

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default AdminDashboard;