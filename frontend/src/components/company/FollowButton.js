import React, { useState } from 'react';
import './FundingSetup.css'; // Uses the same button styles

const FollowButton = ({ initialFollowing = false, onToggle }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  const handleClick = () => {
    setIsFollowing(prev => !prev);
    if (onToggle) onToggle(!isFollowing);
  };

  return (
    <button
      className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 600,
        border: '2px solid #222',
        background: isFollowing ? '#eaf3ff' : '#fff',
        color: isFollowing ? '#2563eb' : '#222',
        padding: '8px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: 'none'
      }}
    >
      <span style={{ color: isFollowing ? '#2563eb' : '#888', fontSize: '1.1em' }}>★</span>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton; 