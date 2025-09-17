import express from 'express';
import upload from '../upload.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, "/")}`); // Format path for web
});

export default router;