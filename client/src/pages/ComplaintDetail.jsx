import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService, authService } from '../services/api';
import './ComplaintDetail.css';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusComment, setStatusComment] = useState('');

  useEffect(() => {
    loadComplaint();
    if (user?.role === 'admin') loadOfficers();
  }, [id, user]);

  const loadComplaint = async () => {
    try {
      const res = await complaintService.getById(id);
      if (res.complaint) {
        setComplaint(res.complaint);
        setHistory(res.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOfficers = async () => {
    try {
      const res = await authService.getUsers();
      if (res.users) {
        setOfficers(res.users.filter(u => u.role === 'officer' || u.role === 'admin'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await complaintService.updateStatus(id, { status: newStatus, comment: statusComment });
      if (res.complaint) {
        setComplaint(res.complaint);
        loadComplaint();
        setStatusComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (officerId) => {
    setActionLoading(true);
    try {
      const res = await complaintService.assign(id, officerId);
      if (res.complaint) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await complaintService.delete(id);
      navigate('/my-complaints');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!complaint) return <div className="not-found">Complaint not found</div>;

  const canEdit = user?.role === 'admin' || (user?.role === 'officer' && complaint.assigned_officer_id === user.id);
  const canAssign = user?.role === 'admin';

  return (
    <div className="complaint-detail">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        {user?.role === 'admin' && (
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        )}
      </div>

      <div className="detail-card">
        <div className="detail-main">
          <div className="detail-meta">
            <span className={`priority-badge ${complaint.priority}`}>{complaint.priority}</span>
            <span className={`status-badge ${complaint.status}`}>{complaint.status.replace('_', ' ')}</span>
            <span className="category">{complaint.category}</span>
          </div>
          
          <h1>{complaint.title}</h1>
          <p className="description">{complaint.description}</p>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Submitted by</label>
              <span>{complaint.user_name}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{complaint.user_email}</span>
            </div>
            <div className="info-item">
              <label>Assigned to</label>
              <span>{complaint.officer_name || 'Not assigned'}</span>
            </div>
            <div className="info-item">
              <label>Created</label>
              <span>{new Date(complaint.created_at).toLocaleString()}</span>
            </div>
            {complaint.resolved_at && (
              <div className="info-item">
                <label>Resolved</label>
                <span>{new Date(complaint.resolved_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {(canEdit || canAssign) && complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
          <div className="action-panel">
            <h3>Actions</h3>
            
            {canAssign && (
              <div className="action-group">
                <label>Assign to Officer</label>
                <select 
                  onChange={(e) => e.target.value && handleAssign(e.target.value)}
                  value={complaint.assigned_officer_id || ''}
                  disabled={actionLoading}
                >
                  <option value="">Select officer</option>
                  {officers.map(officer => (
                    <option key={officer.id} value={officer.id}>{officer.name}</option>
                  ))}
                </select>
              </div>
            )}

            {canEdit && (
              <>
                <div className="action-group">
                  <label>Update Status</label>
                  <select onChange={(e) => handleStatusUpdate(e.target.value)} disabled={actionLoading}>
                    <option value="">Select status</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="action-group">
                  <label>Comment</label>
                  <textarea 
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="history-section">
          <h2>Activity History</h2>
          <div className="timeline">
            {history.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="status-change">
                      {item.old_status ? `${item.old_status} → ${item.new_status}` : item.new_status}
                    </span>
                    <span className="timeline-date">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {item.comment && <p>{item.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
