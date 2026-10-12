import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import HomePage from './components/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Layout from './components/shared/Layout';
import Home from './components/Home';
import CompanyProfile from './components/company/CompanyProfile';
import Contact from './components/Contact';
import Faq from './components/Faq';
import HelpCenter from './components/HelpCenter';
import BrowseCompanies from './components/company/BrowseCompanies';
import About from './components/About';
import ProfileManagement from './components/profile/ProfileManagement';
import MyCompanies from './components/MyCompanies';
import CreateCompany from './components/company/CreateCompany';
import FundingSetup from './components/company/FundingSetup';
import CompanyDetails from './components/company/CompanyDetails';
import ShareIdea from './components/ideas/ShareIdea';
import Community from './components/Community';
import Events from './components/Events';
import EventDetails from './components/EventDetails';
import InvestmentFlow from './components/investment/InvestmentFlow';
import PaymentSuccess from './components/payment/PaymentSuccess';
import EmailForm from './EmailForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import CompanyView from './components/company/CompanyView';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/company/:id" element={<CompanyProfile />} />
        <Route path="/browse-companies" element={<BrowseCompanies />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="user">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-companies"
          element={
            <PrivateRoute>
              <MyCompanies />
            </PrivateRoute>
          }
        />
        <Route
          path="/companies/create"
          element={
            <PrivateRoute>
              <CreateCompany />
            </PrivateRoute>
          }
        />
        <Route
          path="/companies/setup"
          element={
            <PrivateRoute>
              <FundingSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/ideas/share"
          element={
            <PrivateRoute>
              <ShareIdea />
            </PrivateRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/edit" element={<ProfileManagement />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/invest/company/:id" element={<InvestmentFlow />} />
        <Route path="/investment/:id" element={<InvestmentFlow />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentSuccess />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/email" element={<EmailForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/help" element={<HelpCenter />} />
      </Routes>
    </Layout>
  );
}

export default App; 