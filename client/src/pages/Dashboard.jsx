import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecent()
      ]);
      if (statsRes.stats) setStats(statsRes.stats);
      if (recentRes.complaints) setRecent(recentRes.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0]}</h1>
          <p>Here's what's happening with your complaints today.</p>
        </div>
        <Link to="/app/submit" className="hero-cta">
          <span>+</span> Submit New Complaint
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total"></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.total || 0}</span>
            <span className="stat-label">Total Complaints</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending"></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.pending || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress"></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.inProgress || 0}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon resolved"></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.resolved || 0}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Complaints</h2>
          <Link to="/app/my-complaints" className="view-all">View all</Link>
        </div>
        <div className="complaints-list">
          {recent.length === 0 ? (
            <div className="empty-state">
              <p>No complaints yet. Submit your first complaint!</p>
            </div>
          ) : (
            recent.map((complaint) => (
              <Link key={complaint.id} to={`/app/complaint/${complaint.id}`} className="complaint-item">
                <div className="complaint-main">
                  <h3>{complaint.title}</h3>
                  <p>{complaint.description?.slice(0, 80)}...</p>
                </div>
                <div className="complaint-meta">
                  <span className={`status-badge ${complaint.status}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                  <span className="date">{new Date(complaint.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
