// import { GoogleGenerativeAI } from "@google/generative-ai";
// import fs from 'fs';
// import path from 'path';

// // Initialize the Google Generative AI client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Helper function to convert an image file to a GoogleGenerativeAI.Part object
// function fileToGenerativePart(filePath, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
//       mimeType
//     },
//   };
// }

// // This function maps Gemini's potential text response to our app's categories.
// // It's more robust as it checks for keywords.
// const mapResponseToCategory = (text) => {
//   const t = text.toLowerCase();
//   if (t.includes('pothole') || t.includes('road damage') || t.includes('manhole')) return 'Pothole';
//   if (t.includes('streetlight') || t.includes('street light') || t.includes('lamp')) return 'Streetlight';
//   if (t.includes('trash') || t.includes('garbage') || t.includes('waste') || t.includes('bin')) return 'Trash';
//   if (t.includes('water leak') || t.includes('pipe') || t.includes('sewerage')) return 'Water Leakage';
//   return 'Other';
// };

// export const classifyImage = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No image file uploaded.' });
//   }

//   const imagePath = path.resolve(req.file.path);
//   const mimeType = req.file.mimetype;

//   try {
//     // Get the Gemini Pro Vision model
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // This is the prompt we send to the AI. It's highly specific.
//     const prompt = `Analyze this image of a civic issue. Based on the image, classify it into one of the following categories only: "Pothole", "Streetlight", "Trash", "Water Leakage", or "Other". Provide only the category name as your response.`;

//     // Convert the image file to the format Gemini needs
//     const imagePart = fileToGenerativePart(imagePath, mimeType);

//     // Send the prompt and the image to the AI
//     const result = await model.generateContent([prompt, imagePart]);
//     const response = await result.response;
//     const textResponse = response.text();

//     // Clean up the uploaded file from our server immediately
//     fs.unlinkSync(imagePath);

//     // Map the AI's text response to our category system
//     const category = mapResponseToCategory(textResponse);
    
//     res.json({ category });

//   } catch (error) {
//     console.error("Gemini AI classification failed:", error);
//     fs.unlinkSync(imagePath); // Still try to clean up the file on error
//     res.status(500).json({ message: "Gemini AI service failed to process the image." });
//   }
// };

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to convert an image into Gemini input format
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

// Map AI response to categories
const mapResponseToCategory = (text) => {
  const t = text.toLowerCase();
  if (t.includes("pothole") || t.includes("road damage") || t.includes("manhole")) return "Pothole";
  if (t.includes("streetlight") || t.includes("street light") || t.includes("lamp")) return "Streetlight";
  if (t.includes("trash") || t.includes("garbage") || t.includes("waste") || t.includes("bin")) return "Trash";
  if (t.includes("water leak") || t.includes("pipe") || t.includes("sewerage")) return "Water Leakage";
  return "Other";
};

export const classifyAndSaveImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded." });
  }

  const imagePath = path.resolve(req.file.path);
  const mimeType = req.file.mimetype;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this image of a civic issue. Based on the image, classify it into one of the following categories only: "Pothole", "Streetlight", "Trash", "Water Leakage", or "Other". Provide only the category name as your response.`;
    const imagePart = fileToGenerativePart(imagePath, mimeType);

    const result = await model.generateContent([prompt, imagePart]);
    const textResponse = result.response.text();

    const category = mapResponseToCategory(textResponse);

    // Save web-friendly path for frontend
    const filePath = `/uploads/${req.file.filename}`;

    // Clean up only if you don’t want to keep the image
    // if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    // Send **only one response**
    return res.json({ category, filePath });

  } catch (error) {
    console.error("Gemini AI classification failed:", error.response?.data || error.message || error);

    // Delete file on error
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    if (!res.headersSent) {
      return res.status(500).json({ 
        message: "Gemini AI service failed to process the image.", 
        details: error.message 
      });
    }
  }
};
