import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCompany.css';

const CreateCompany = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    quickPitch: '',
    industry: '',
    fundingGoal: '',
    timeframe: 'immediately'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleContinueSetup = () => {
    navigate('/companies/setup');
  };

  const renderFundraisingSteps = () => (
    <div className="fundraising-steps">
      <h1>Let's Start Fundraising!</h1>
      
      <div className="steps-container">
        <div className="step-card active">
          <div className="step-header">
            <span className="step-label">Step 1</span>
            <span className="start-here">START HERE</span>
          </div>
          <h3>Build your Funding Profile</h3>
          <p>You'll complete your funding profile using our setup wizards.</p>
          <button className="continue-setup" onClick={handleContinueSetup}>
            CONTINUE SETUP
          </button>
        </div>

        <div className="step-card">
          <div className="step-header">
            <span className="step-label">Step 2</span>
          </div>
          <h3>Submit for Review & Approval</h3>
          <p>Our team will review your fundraise within 2 business days.</p>
          <button className="build-profile" disabled>
            BUILD PROFILE FIRST
          </button>
        </div>

        <div className="step-card">
          <div className="step-header">
            <span className="step-label">Step 3</span>
          </div>
          <h3>Launch Your Fundraise</h3>
          <p>After approval, your fundraise is public and ready for promotion.</p>
          <button className="not-approved" disabled>
            NOT APPROVED YET
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserForm = () => (
    <div className="form-container">
      <div className="form-section">
        <h2>User Account</h2>
        <p>Register your free Fundable account and help us get to know you better. You'll use this information to login to Fundable.</p>
        
        <form onSubmit={handleNext}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="company-profile-section">
            <h2>Company Profile</h2>
            <p>This information will create a basic company profile in our system and can be modified later.</p>

            <div className="form-group">
              <label>Business or Product Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Quick Pitch</label>
              <input
                type="text"
                name="quickPitch"
                value={formData.quickPitch}
                onChange={handleInputChange}
                placeholder="i.e. Revolutionary music player and entertainment device."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select One</option>
                  <option value="tech">Technology</option>
                  <option value="health">Healthcare</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Funding Goal</label>
                <input
                  type="text"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleInputChange}
                  placeholder="৳10,000"
                  required
                />
              </div>
            </div>

            <div className="timeframe-section">
              <label>How soon are you looking to start fundraising?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="timeframe"
                    value="immediately"
                    checked={formData.timeframe === 'immediately'}
                    onChange={handleInputChange}
                  />
                  Immediately
                </label>
                <label>
                  <input
                    type="radio"
                    name="timeframe"
                    value="1-3months"
                    checked={formData.timeframe === '1-3months'}
                    onChange={handleInputChange}
                  />
                  1 to 3 Months
                </label>
                <label>
                  <input
                    type="radio"
                    name="timeframe"
                    value="3+months"
                    checked={formData.timeframe === '3+months'}
                    onChange={handleInputChange}
                  />
                  3+ Months
                </label>
              </div>
            </div>

            <button type="submit" className="next-button">
              Next
            </button>

            <p className="terms-text">
              By creating an account, you agree to our{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>

      <div className="right-panel">
        <h2>Get your Fundraise ready for Investors</h2>
        <p>Over ৳570 million committed</p>
        
        <div className="company-examples">
          <div className="company-card">
            <img src="/images/arcimoto.jpg" alt="Arcimoto" />
            <div className="company-info">
              <h3>Arcimoto</h3>
              <p>৳19.5m Committed</p>
            </div>
          </div>

          <div className="company-card">
            <img src="/images/travelmate.jpg" alt="TravelMate" />
            <div className="company-info">
              <h3>TravelMate</h3>
              <p>৳2.2m Committed</p>
            </div>
          </div>

          <div className="company-card">
            <img src="/images/unistellar.jpg" alt="Unistellar" />
            <div className="company-info">
              <h3>Unistellar</h3>
              <p>৳3.1m Committed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="create-company-container">
      <div className="back-link" onClick={handleBack}>
        <span className="back-arrow">←</span> Back to Dashboard
      </div>

      <div className="progress-bar">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Tell Us About You</span>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Start Fundraising</span>
        </div>
      </div>

      {currentStep === 1 ? renderUserForm() : renderFundraisingSteps()}
    </div>
  );
};

export default CreateCompany; 