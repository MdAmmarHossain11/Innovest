import React from 'react';
import FollowButton from './FollowButton';

const CompanyCard = ({ company, isFollowing }) => (
  <div className="company-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #eee', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
    <img src={company.image} alt={company.name} style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#eee' }} />
    <div style={{ flex: 1 }}>
      <h3 style={{ margin: 0 }}>{company.name}</h3>
      <p style={{ margin: '8px 0' }}>{company.description}</p>
    </div>
    {/* Follow/Unfollow button */}
    <FollowButton initialFollowing={isFollowing} onToggle={(newState) => { /* Optionally handle API call here */ }} />
  </div>
);

export default CompanyCard; 