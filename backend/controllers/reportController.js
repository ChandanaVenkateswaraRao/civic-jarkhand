import Report from '../models/Report.js';
import User from '../models/User.js';
// Automated Routing Logic
const getDepartmentForCategory = (category) => {
  switch (category) {
    case 'Pothole':
    case 'Streetlight':
      return 'Public Works Department';
    case 'Trash':
      return 'Sanitation Department';
    case 'Water Leakage':
      return 'Water and Sewerage Department';
    default:
      return 'General Administration';
  }
};

// @desc    Create a new report
// @route   POST /api/reports
export const createReport = async (req, res) => {
  const { title, description, category, location, photo } = req.body;
  try {
    const assignedTo = getDepartmentForCategory(category);
    const report = new Report({
      title,
      description,
      category,
      location,
      photo,
      assignedTo,
      submittedBy: req.user._id,
    });
    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get reports
// @route   GET /api/reports
export const getReports = async (req, res) => {
  try {
    const reports =
      req.user.role === 'admin'
        ? await Report.find({}).populate('submittedBy', 'name email')
        : await Report.find({ submittedBy: req.user._id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('submittedBy', 'name email');
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
export const updateReportStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      report.status = status;
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



// NEW FUNCTION FOR WORKERS
export const getWorkerReports = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'worker' || !req.user.assignedCategory) {
      return res.status(403).json({ message: 'Not authorized or no category assigned.' });
    }

    // This query will now work correctly because the User model is imported.
    const reports = await Report.find({ category: req.user.assignedCategory })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(reports);
  } catch (error) {
    console.log('Error in getWorkerReports:', error); // Add a log for better debugging
    res.status(500).json({ message: 'Server Error' });
  }
};