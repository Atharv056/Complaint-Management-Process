import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [byStatus, setByStatus] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [byPriority, setByPriority] = useState([]);
  const [aging, setAging] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsRes, statusRes, categoryRes, priorityRes, agingRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getByStatus(),
        dashboardService.getByCategory(),
        dashboardService.getByPriority(),
        dashboardService.getAging()
      ]);
      if (statsRes.stats) setStats(statsRes.stats);
      if (statusRes.data) setByStatus(statusRes.data);
      if (categoryRes.data) setByCategory(categoryRes.data);
      if (priorityRes.data) setByPriority(priorityRes.data);
      if (agingRes.data) setAging(agingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMax = (arr) => Math.max(...arr.map(i => i.count), 1);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Overview of complaint metrics and performance</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{stats?.total || 0}</span>
          <span className="stat-label">Total Complaints</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.pending || 0}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.inProgress || 0}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.resolved || 0}</span>
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.avgResolutionTime || 'N/A'}</span>
          <span className="stat-label">Avg Resolution</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>By Status</h3>
          <div className="bar-chart">
            {byStatus.map((item) => (
              <div key={item.status} className="bar-item">
                <span className="bar-label">{item.status.replace('_', ' ')}</span>
                <div className="bar-track">
                  <div 
                    className={`bar-fill ${item.status}`} 
                    style={{ width: `${(item.count / getMax(byStatus)) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>By Category</h3>
          <div className="bar-chart">
            {byCategory.map((item) => (
              <div key={item.category} className="bar-item">
                <span className="bar-label">{item.category}</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill category" 
                    style={{ width: `${(item.count / getMax(byCategory)) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>By Priority</h3>
          <div className="bar-chart">
            {byPriority.map((item) => (
              <div key={item.priority} className="bar-item">
                <span className="bar-label">{item.priority}</span>
                <div className="bar-track">
                  <div 
                    className={`bar-fill priority-${item.priority}`} 
                    style={{ width: `${(item.count / getMax(byPriority)) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Complaint Aging</h3>
          <div className="bar-chart">
            {aging.map((item) => (
              <div key={item.age_group} className="bar-item">
                <span className="bar-label">{item.age_group.replace('_', ' ')}</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill aging" 
                    style={{ width: `${(item.count / getMax(aging)) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
