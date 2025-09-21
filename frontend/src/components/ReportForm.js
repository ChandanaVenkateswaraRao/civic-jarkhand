import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api'; // Your pre-configured Axios instance
import { FaFileUpload, FaHeading } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONSTANTS ---
const CATEGORIES = ['Pothole', 'Streetlight', 'Trash', 'Water Leakage', 'Other'];

// --- Gemini API Key Load Balancer ---
const GEMINI_KEYS = (process.env.REACT_APP_GEMINI_API_KEY || "").split(",");

let keyIndex = 0;

// Round robin selection
const getNextKey = () => {
  const key = GEMINI_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GEMINI_KEYS.length;
  return key;
};

// Always create a fresh AI instance with a rotated key
const createAIInstance = () => {
  const key = getNextKey();
  console.log("Using Gemini API Key:", key.slice(0, 6) + "..."); // Debug only
  return new GoogleGenerativeAI(key);
};

const ReportForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState('');
  const [fileName, setFileName] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const navigate = useNavigate();

  // --- Utility: Convert file to Base64 ---
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });

  // --- AI Analysis Function ---
  const analyzePhoto = useCallback(async (file) => {
    if (!file) return;

    setIsAnalyzing(true);
    toast.loading('Analyzing image...', { id: 'ai-toast' });

    try {
      const base64Data = await fileToBase64(file);

      // Create AI instance with rotated key
      const ai = createAIInstance();
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Look at this image. Identify the primary issue from this list: 
      Pothole, Streetlight, Trash, Water Leakage. 
      If none are present or you are unsure, respond with "Other". Respond with only a single word.`;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: file.type } }
      ]);

      const response = await result.response;
      let detectedCategory = response.text().trim();

      if (!CATEGORIES.includes(detectedCategory)) {
        detectedCategory = 'Other';
      }

      setCategory(detectedCategory);
      toast.success(`AI detected: ${detectedCategory}`, { id: 'ai-toast' });

    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('Image analysis failed.', { id: 'ai-toast' });
      setCategory('Other');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // --- Get user location ---
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude],
        });
      },
      () => {
        toast.error('Please enable location services to submit a report.');
      },
      { timeout: 10000 }
    );
  }, []);

  // --- File Upload Handler ---
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhoto(data);
      toast.success('Image uploaded successfully!');

      await analyzePhoto(file);

    } catch (error) {
      toast.error('Image upload failed.');
      setFileName('');
      setPhoto('');
    } finally {
      setIsUploading(false);
    }
  };

  // --- Submit Handler ---
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error('Location data not available yet. Please wait.');
      return;
    }
    const toastId = toast.loading('Submitting report...');
    try {
      await API.post('/reports', {
        title,
        description,
        category,
        location,
        photo,
      });
      toast.success('Report submitted successfully!', { id: toastId });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit report.', { id: toastId });
    }
  };

  const isProcessing = isUploading || isAnalyzing;

  return (
    <div className="form-container">
      <h1>Report a New Civic Issue</h1>
      <form onSubmit={submitHandler}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <div className="input-group">
            <FaHeading className="input-icon" />
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Large pothole on Main Street"
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional details..."
            required
            disabled={isProcessing}
          />
        </div>

        {/* Category */}
        {/* <div className="form-group">
          <label htmlFor="category">Category (auto-filled by image)</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isProcessing}
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div> */}

        {/* File Upload */}
        <div className="form-group">
          <label>Issue Photo (Optional)</label>
          <label htmlFor="image-file" className={`file-upload-label ${isProcessing ? 'disabled' : ''}`}>
            <FaFileUpload />
            <span>{fileName || 'Select Photo'}</span>
          </label>
          {isUploading && <p>Uploading image...</p>}
          {isAnalyzing && <p>Analyzing image...</p>}
          <input
            type="file"
            id="image-file"
            onChange={uploadFileHandler}
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
            disabled={isProcessing}
          />
        </div>

        {location && (
          <p style={{ textAlign: 'center', color: 'var(--secondary-color)', marginTop: '-1rem', marginBottom: '1.5rem' }}>
            Location captured successfully!
          </p>
        )}

        <button type="submit" className="btn" disabled={isProcessing}>
          {isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
