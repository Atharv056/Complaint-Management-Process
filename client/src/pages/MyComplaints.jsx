import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import './MyComplaints.css';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', category: '' });

  useEffect(() => {
    loadComplaints();
  }, [filter]);

  const loadComplaints = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.category) params.append('category', filter.category);
      const res = await complaintService.getAll(`?${params}`);
      if (res.complaints) setComplaints(res.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-complaints">
      <div className="page-header">
        <h1>My Complaints</h1>
        <Link to="/submit" className="submit-btn">+ New Complaint</Link>
      </div>

      <div className="filters">
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select 
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="service">Service</option>
          <option value="harassment">Harassment</option>
          <option value="billing">Billing</option>
          <option value="facilities">Facilities</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No complaints found</h3>
          <p>Submit your first complaint to get started</p>
          <Link to="/submit" className="submit-btn">Submit Complaint</Link>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <Link key={complaint.id} to={`/complaint/${complaint.id}`} className="complaint-card">
              <div className="card-header">
                <span className={`priority-badge ${complaint.priority}`}>
                  {complaint.priority}
                </span>
                <span className={`status-badge ${complaint.status}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
              </div>
              <h3>{complaint.title}</h3>
              <p>{complaint.description?.slice(0, 100)}...</p>
              <div className="card-footer">
                <span className="category">{complaint.category}</span>
                <span className="date">{new Date(complaint.created_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
