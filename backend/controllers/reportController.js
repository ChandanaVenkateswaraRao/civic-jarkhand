import Report from '../models/Report.js';
import User from '../models/User.js';

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

export const getReports = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { submittedBy: req.user._id };
    const reports = await Report.find(query)
      .populate({ path: 'submittedBy', select: 'name email', model: User })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getWorkerReports = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'worker' || !req.user.assignedCategory) {
      return res.status(403).json({ message: 'Not authorized or no category assigned.' });
    }
    const reports = await Report.find({ category: req.user.assignedCategory })
      .populate({ path: 'submittedBy', select: 'name email', model: User })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('submittedBy', 'name email');
    res.json(report);
  } catch (error) {
    res.status(404).json({ message: 'Report not found' });
  }
};

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

export const getLeaderboard = async (req, res) => {
  try {
    // This is a MongoDB Aggregation Pipeline. It's a powerful way to process data.
    const leaderboardData = await Report.aggregate([
      // Stage 1: Group reports by the user who submitted them and count them.
      {
        $group: {
          _id: "$submittedBy", // Group by the user's ID
          reportCount: { $sum: 1 }, // Count the number of reports for each user
        },
      },
      // Stage 2: Sort users by their report count in descending order.
      {
        $sort: {
          reportCount: -1,
        },
      },
      // Stage 3: Limit to the top 100 users to keep the leaderboard concise.
      {
        $limit: 100,
      },
      // Stage 4: Join with the 'users' collection to get the user's name.
      {
        $lookup: {
          from: "users", // The collection to join with
          localField: "_id", // The field from the reports (the user's ID)
          foreignField: "_id", // The field in the users collection to match on
          as: "userDetails", // The name of the new array field to add
        },
      },
      // Stage 5: The $lookup stage creates an array. $unwind deconstructs it.
      {
        $unwind: "$userDetails",
      },
      // Stage 6: Shape the final output.
      {
        $project: {
          _id: 0, // Exclude the default _id field
          name: "$userDetails.name", // Get the name from the joined user details
          reportCount: 1, // Keep the reportCount
          points: { $multiply: ["$reportCount", 100] }, // Calculate points
        },
      },
    ]);

    // Add a rank to the data in JavaScript after fetching from the DB
    const rankedLeaderboard = leaderboardData.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};