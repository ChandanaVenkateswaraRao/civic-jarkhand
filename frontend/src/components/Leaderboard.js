import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ you were using axios but hadn’t imported it
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import { FaMedal } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/reports/leaderboard");

        // ✅ add points dynamically
        const leaderboardWithPoints = data.map(user => ({
          ...user,
          points: user.reportCount * 100
        }));

        setLeaderboard(leaderboardWithPoints);
      } catch (error) {
        toast.error('Could not fetch leaderboard data.');
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Function to assign medal colors based on rank
  const getMedalColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return null;
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Top Citizen Contributors</h1>
      
      {loading ? (
        <Spinner />
      ) : (
        <div className="table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Citizen</th>
                <th>Reports Submitted</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
            {leaderboard.length > 0 ? (
                leaderboard.map((user) => (
                  <tr key={user.rank}>
                    <td data-label="Rank" className="rank-cell">
                      {getMedalColor(user.rank) && (
                        <FaMedal style={{ color: getMedalColor(user.rank), marginRight: '8px' }} />
                      )}
                      {user.rank}
                    </td>
                    <td data-label="Citizen">{user.name}</td>
                    <td data-label="Reports Submitted">{user.reportCount}</td>
                    <td data-label="Points">{user.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No reports have been submitted yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
