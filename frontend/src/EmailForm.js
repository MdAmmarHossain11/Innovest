import { API_HOST } from './config';
// src/EmailForm.js
import React, { useState } from 'react';
import axios from 'axios';

export default function EmailForm() {
  const [form, setForm] = useState({ from_email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    console.log('Submitting form:', form);
    alert('Form submitted!');
    try {
      await axios.post(`${API_HOST}/api/send-email/`, form);
      setStatus({ type: 'success', msg: 'Email sent!' });
      setForm({ from_email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to send email.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Send Email</h2>
      <input
        type="email"
        name="from_email"
        placeholder="Your Email"
        value={form.from_email}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <textarea
        name="message"
        placeholder="Message"
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <button type="submit" style={{ background: '#1f95f5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 4, fontWeight: 700 }}>
        Send
      </button>
      {status && (
        <div style={{ marginTop: 16, color: status.type === 'success' ? 'green' : 'red' }}>
          {status.msg}
        </div>
      )}
    </form>
  );
}