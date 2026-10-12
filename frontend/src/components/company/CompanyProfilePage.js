import React, { useState } from 'react';
import FollowButton from './FollowButton';

const slides = [
  {
    title: 'The Problem',
    image: 'https://via.placeholder.com/600x350/003366/ffffff?text=The+Problem',
    content: 'Renewable energy is predicted to supply 45-50% of the world's electricity by 2023. Grid needs to de-carbonize. Solar and wind solutions are not always active. A flexible-duration energy storage can fix the grid, but no scalable, safe, inexpensive, reliable, flexible-duration energy storage exists today.'
  },
  { title: 'Our Solution', image: 'https://via.placeholder.com/600x350/005599/ffffff?text=Our+Solution', content: '' },
  { title: 'Market Opportunity', image: 'https://via.placeholder.com/600x350/0077bb/ffffff?text=Market+Opportunity', content: '' },
  { title: 'How It Works', image: 'https://via.placeholder.com/600x350/0099cc/ffffff?text=How+It+Works', content: '' },
  { title: 'Business Model', image: 'https://via.placeholder.com/600x350/00bbaa/ffffff?text=Business+Model', content: '' },
  { title: 'Financial Projections', image: 'https://via.placeholder.com/600x350/00cc99/ffffff?text=Financial+Projections', content: '' },
  { title: 'Competitive Landscape', image: 'https://via.placeholder.com/600x350/00dd77/ffffff?text=Competitive+Landscape', content: '' },
  { title: 'EarthEn Team', image: 'https://via.placeholder.com/600x350/00ee55/ffffff?text=EarthEn+Team', content: '' },
];

const CompanyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px 0 32px', background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          EarthEn <span style={{ color: '#888', fontWeight: 400 }}>| Efficient Energy Storage through CO₂</span>
        </div>
        <FollowButton initialFollowing={false} />
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: '24px', maxWidth: 1200, margin: '32px auto 0 auto' }}>
        {/* Left: Cover and Social */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <img src="https://via.placeholder.com/800x400/003366/ffffff?text=EarthEn+Efficient+Energy+Storage+through+CO2" alt="cover" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button style={{ background: '#4267B2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500 }}>Like</button>
              <button style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500 }}>Post</button>
              <button style={{ background: '#0077b5', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500 }}>Share</button>
              <button style={{ background: '#e60023', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500 }}>Pin it</button>
            </div>
          </div>
        </div>
        {/* Right: Private Fundraise Card */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#888', marginBottom: 8 }}><span role="img" aria-label="lock">🔒</span></div>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Private Fundraise</div>
            <div style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>
              This company may be interested in raising funds from accredited investors. You must Request Access to see more information about this company.
            </div>
            <button style={{ background: '#f7f7f7', border: '1px solid #bbb', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 600, color: '#444', fontSize: 16, cursor: 'pointer' }}>Request Access</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1200, margin: '32px auto 0 auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0 0 24px 0' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', padding: '0 32px' }}>
          {['profile', 'business', 'updates'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
                color: activeTab === tab ? '#2563eb' : '#888',
                fontWeight: 600,
                fontSize: 16,
                padding: '18px 24px 10px 24px',
                cursor: 'pointer',
                outline: 'none',
                marginRight: 8
              }}
            >
              {tab === 'profile' ? 'PROFILE' : tab === 'business' ? 'BUSINESS PLAN' : 'UPDATES'}
            </button>
          ))}
        </div>
        {/* Tab content */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', gap: 24, padding: '24px 32px 0 32px' }}>
            {/* Slide preview */}
            <div style={{ flex: 2 }}>
              <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 0 }}>
                <img src={slides[activeSlide].image} alt={slides[activeSlide].title} style={{ width: '100%', borderRadius: 10, marginBottom: 0 }} />
                <div style={{ padding: '18px 24px' }}>
                  <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{slides[activeSlide].title}</div>
                  <div style={{ color: '#333', fontSize: 16 }}>{slides[activeSlide].content}</div>
                </div>
              </div>
            </div>
            {/* Slide navigation */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 0' }}>
                {slides.map((slide, idx) => (
                  <div
                    key={slide.title}
                    onClick={() => setActiveSlide(idx)}
                    style={{
                      padding: '12px 24px',
                      cursor: 'pointer',
                      background: idx === activeSlide ? '#f7f7f7' : 'none',
                      fontWeight: idx === activeSlide ? 700 : 500,
                      color: idx === activeSlide ? '#2563eb' : '#222',
                      borderLeft: idx === activeSlide ? '4px solid #2563eb' : '4px solid transparent',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {slide.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Other tabs can be filled in as needed */}
      </div>
    </div>
  );
};

export default CompanyProfilePage; 