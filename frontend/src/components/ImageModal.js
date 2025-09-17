import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Using an icon for the close button

const ImageModal = ({ imageUrl, onClose }) => {
  // If no imageUrl is provided, don't render anything
  if (!imageUrl) {
    return null;
  }

  return (
    // The semi-transparent background overlay
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* The close button */}
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        {/* The image itself */}
        <img src={imageUrl} alt="Report view" className="modal-image" />
      </div>
    </div>
  );
};

export default ImageModal;