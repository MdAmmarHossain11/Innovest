import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCompanies.css';

const MyCompanies = () => {
  const navigate = useNavigate();

  const handleCreateCompany = () => {
    navigate('/companies/create');
  };

  const companies = [
    {
      id: 1,
      name: 'Rentx',
      status: "This company's profile is still being setup.",
    },
    {
      id: 2,
      name: 'Rentx',
      status: "This company's profile is still being setup.",
    },
    {
      id: 3,
      name: 'a',
      status: "This company's profile is still being setup.",
      image: '/company-image.jpg'
    },
    {
      id: 4,
      name: 'a',
      status: "This company's profile is still being setup.",
    }
  ];

  return (
    <div className="companies-container">
      <div className="companies-header">
        <div className="tab-container">
          <button className="tab-button active">
            <i className="fas fa-building"></i> My Companies
          </button>
          <button className="tab-button">
            <i className="fas fa-check-circle"></i> Backed
          </button>
          <button className="tab-button">
            <i className="fas fa-users"></i> Following
          </button>
        </div>
      </div>

      <h2>My Companies</h2>
      <p>You haven't created any companies yet.</p>
      
      <button className="create-company-button" onClick={handleCreateCompany}>
        Create Company
      </button>

      <h2>You have {companies.length} companies on Fundable.</h2>

      <div className="companies-list">
        {companies.map((company) => (
          <div key={company.id} className="company-card">
            <div className="company-info">
              <div className="company-image">
                {company.image ? (
                  <img src={company.image} alt={company.name} />
                ) : (
                  <div className="placeholder-image">
                    <i className="fas fa-building"></i>
                  </div>
                )}
              </div>
              <div className="company-details">
                <h3>{company.name}</h3>
                <p>{company.status}</p>
              </div>
            </div>
            <button className="dashboard-button">
              Dashboard <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCompanies; 