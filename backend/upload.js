import multer from 'multer';
import cloudinary from './config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

const upload = multer({ storage: storage });

export default upload;