import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';
import { FaSync, FaCheckCircle, FaFileUpload, FaHeading } from 'react-icons/fa';

const ReportForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(null);
  
  // --- STATE CHANGES ---
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the actual File object
  const [photoPath, setPhotoPath] = useState(''); // State for the server path
  // --- END OF STATE CHANGES ---

  const [isProcessing, setIsProcessing] = useState(false);
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
      (error) => {
        console.error("Error fetching location: ", error);
        toast.error('Please enable location services to submit a report.');
      }
    );
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset state for new upload
    setCategory('');
    setPhotoPath('');
    setSelectedFile(file); // *** SAVE THE FILE OBJECT ***
    setFileName(file.name);
    setIsProcessing(true);
    const toastId = toast.loading('Uploading and analyzing image...');

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const { data } = await API.post('/api/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setCategory(data.category);
      setPhotoPath(data.filePath); // Save the path returned from the backend

      toast.success(`AI detected category: ${data.category}`, { id: toastId, duration: 4000 });

    } catch (error) {
      console.error(error);
      toast.error('Could not analyze image. Please try another one.', { id: toastId });
      setFileName('');
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SUBMIT HANDLER CHANGES ---
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error('Location data is not yet available.');
      return;
    }
    if (!category || !photoPath) {
      toast.error('Please upload an image and wait for AI analysis.');
      return;
    }
    
    const toastId = toast.loading('Submitting your report...');
    
    try {
      // We send the path we got from the AI classification step
      await API.post('/api/reports', { 
        title, 
        description, 
        category, 
        location, 
        photo: photoPath // Use the saved path
      });
      toast.success('Report submitted successfully!', { id: toastId });
      navigate('/dashboard');
    } catch (error) {
      console.error('Report submission failed', error);
      toast.error('Failed to submit report.', { id: toastId });
    }
  };
  // --- END OF SUBMIT HANDLER CHANGES ---

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
              placeholder="e.g., Large pothole on Main Street"
              required 
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Provide any additional details..."
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Issue Photo</label>
          <label htmlFor="image-file" className="file-upload-label">
            <FaFileUpload />
            <span>{fileName ? "Change Photo" : "Select Photo"}</span>
          </label>
          {fileName && !isProcessing && <p className="file-name-display">{fileName}</p>}
          <input 
            type="file" 
            id="image-file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
          />
        </div>

        {isProcessing && (
          <div className="processing-indicator">
            <FaSync className="processing-icon" />
            <p>AI is analyzing your image...</p>
          </div>
        )}

        {category && !isProcessing && (
          <div className="category-display">
            <FaCheckCircle className="category-icon" />
            <p><strong>Detected Category:</strong> {category}</p>
          </div>
        )}

        {location && <p style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>Location captured successfully!</p>}
        
        <button type="submit" className="btn" disabled={isProcessing || !category}>
          {isProcessing ? 'Processing...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;