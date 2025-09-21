import React from 'react';

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="container profile-container">
      <h1>User Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Role:</strong> {userInfo.role}</p>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
};

export default Profile;