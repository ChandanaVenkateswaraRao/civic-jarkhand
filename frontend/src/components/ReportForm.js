import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';
import { FaFileUpload, FaHeading } from 'react-icons/fa';

const ReportForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pothole'); // Default category
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude],
        });
      },
      (error) => toast.error('Please enable location services.')
    );
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await API.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhoto(data); // `data` is the file path, e.g., "/uploads/image-123.jpg"
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed.');
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error('Location data is not yet available. Please wait a moment.');
      return;
    }
    const toastId = toast.loading('Submitting report...');
    try {
      await API.post('/api/reports', { title, description, category, location, photo });
      toast.success('Report submitted successfully!', { id: toastId });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit report.', { id: toastId });
    }
  };

  return (
    <div className="form-container">
      <h1>Report a New Civic Issue</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Title</label>
          <div className="input-group">
            <FaHeading className="input-icon" />
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Large pothole on Main Street" // Add placeholder
              required 
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Provide any additional details..." // Add placeholder
            required 
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Trash">Trash</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Issue Photo (Optional)</label>
          <label htmlFor="image-file" className="file-upload-label">
            <FaFileUpload />
            <span>{fileName || "Select Photo"}</span>
          </label>
          {isUploading && <p className="file-name-display">Uploading...</p>}
          <input 
            type="file" 
            id="image-file" 
            onChange={uploadFileHandler} 
            accept="image/png, image/jpeg"
            style={{ display: 'none' }} 
          />
        </div>

        {/* Add location captured message for better UX */}
        {location && <p style={{ textAlign: 'center', color: 'var(--secondary-color)', marginTop: '-1rem', marginBottom: '1.5rem' }}>Location captured successfully!</p>}
        
        <button type="submit" className="btn" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;