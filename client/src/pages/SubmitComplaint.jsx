import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';
import './SubmitComplaint.css';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await complaintService.create(formData);
      if (res.complaint) {
        navigate(`/complaint/${res.complaint.id}`);
      } else {
        setError(res.error || 'Failed to submit complaint');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-complaint">
      <div className="page-header">
        <h1>Submit New Complaint</h1>
        <p>Fill in the details below to submit your complaint</p>
      </div>

      <form onSubmit={handleSubmit} className="complaint-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Complaint Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief title for your complaint"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your complaint in detail..."
            rows={6}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="service">Service</option>
              <option value="harassment">Harassment</option>
              <option value="billing">Billing</option>
              <option value="facilities">Facilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
