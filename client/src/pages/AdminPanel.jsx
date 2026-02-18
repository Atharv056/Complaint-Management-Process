import { useState, useEffect } from 'react';
import { complaintService, authService } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', officer: '' });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      const [complaintsRes, usersRes] = await Promise.all([
        complaintService.getAll(`?${params}`),
        authService.getUsers()
      ]);
      if (complaintsRes.complaints) setComplaints(complaintsRes.complaints);
      if (usersRes.users) {
        setOfficers(usersRes.users.filter(u => u.role === 'officer' || u.role === 'admin'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (complaintId, officerId) => {
    try {
      await complaintService.assign(complaintId, officerId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-panel">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage complaints and assign officers</p>
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
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Complaint</th>
                <th>User</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <div className="complaint-cell">
                      <span className="title">{complaint.title}</span>
                      <span className="date">{new Date(complaint.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>{complaint.user_name}</td>
                  <td className="capitalize">{complaint.category}</td>
                  <td>
                    <span className={`priority-badge ${complaint.priority}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${complaint.status}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{complaint.officer_name || '—'}</td>
                  <td>
                    <select 
                      value={complaint.assigned_officer_id || ''}
                      onChange={(e) => handleAssign(complaint.id, e.target.value)}
                      className="assign-select"
                    >
                      <option value="">Assign</option>
                      {officers.map(officer => (
                        <option key={officer.id} value={officer.id}>{officer.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
