import express from 'express';
import upload from '../upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Upload an image file
 * @route   POST /api/upload
 * @access  Private (requires user to be logged in)
 */
router.post('/', protect, upload.single('image'), (req, res) => {
  // The 'protect' middleware runs first. If the user is not logged in,
  // this part of the code will never be reached.

  if (req.file) {
    // The 'upload' middleware saves the file and adds a 'file' object to the request.
    // We send back the public URL path to the uploaded file.
    res.status(201).send(req.file.path);
  } else {
    // This case would typically only be hit if something went wrong with multer.
    res.status(400).send({ message: 'No file was uploaded.' });
  }
});

export default router;