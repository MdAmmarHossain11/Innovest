import React from 'react';
import FollowButton from './FollowButton';
import { getMediaUrl } from '../../config';

const CompanyCard = ({ company, isFollowing }) => (
  <div className="company-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #eee', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
    {company.cover_image && (
      <img
        src={getMediaUrl(company.cover_image)}
        alt={`${company.product_name} cover`}
        style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#eee' }}
      />
    )}
    <div style={{ flex: 1 }}>
      <h3 style={{ margin: 0 }}>{company.product_name}</h3>
      <p style={{ margin: '8px 0' }}>{company.quick_description}</p>
    </div>
    {/* Follow/Unfollow button */}
    <FollowButton initialFollowing={isFollowing} onToggle={(newState) => { /* Optionally handle API call here */ }} />
  </div>
);

export default CompanyCard; 