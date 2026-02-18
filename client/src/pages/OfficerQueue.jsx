import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import './OfficerQueue.css';

const OfficerQueue = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  useEffect(() => {
    loadComplaints();
  }, [filter]);

  const loadComplaints = async () => {
    try {
      const res = await complaintService.getAssigned();
      if (res.complaints) {
        let filtered = res.complaints;
        if (filter.status) filtered = filtered.filter(c => c.status === filter.status);
        if (filter.priority) filtered = filtered.filter(c => c.priority === filter.priority);
        setComplaints(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="officer-queue">
      <div className="page-header">
        <h1>Officer Queue</h1>
        <p>Complaints assigned to you</p>
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
        </select>
        <select 
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No complaints assigned</h3>
          <p>Complaints assigned to you will appear here</p>
        </div>
      ) : (
        <div className="queue-list">
          {complaints.map((complaint) => (
            <Link key={complaint.id} to={`/complaint/${complaint.id}`} className="queue-item">
              <div className="queue-priority">
                <span className={`priority-dot ${complaint.priority}`}></span>
              </div>
              <div className="queue-content">
                <h3>{complaint.title}</h3>
                <p>{complaint.description?.slice(0, 80)}...</p>
                <div className="queue-meta">
                  <span>From: {complaint.user_name}</span>
                  <span className="category">{complaint.category}</span>
                </div>
              </div>
              <div className="queue-status">
                <span className={`status-badge ${complaint.status}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
                <span className="date">
                  {new Date(complaint.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerQueue;
