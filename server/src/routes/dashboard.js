const express = require('express');
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticate, authorize('officer', 'admin'), (req, res) => {
  try {
    const params = req.user.role === 'officer' ? [req.user.id] : [];
    const whereClause = params.length > 0 ? 'WHERE assigned_officer_id = ?' : '';

    const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM complaints ${whereClause}`);
    const total = params.length > 0 ? totalStmt.get(...params).total : totalStmt.get().total;

    const pendingParams = params.length > 0 ? [...params, 'pending'] : ['pending'];
    const pendingStmt = db.prepare(`SELECT COUNT(*) as count FROM complaints ${whereClause ? whereClause + ' AND' : 'WHERE'} status = ?`.replace('WHEREAND', 'WHERE'));
    const pending = pendingStmt.get(...pendingParams).count;

    const resolvedParams = params.length > 0 ? [...params, 'resolved'] : ['resolved'];
    const resolvedStmt = db.prepare(`SELECT COUNT(*) as count FROM complaints ${whereClause ? whereClause + ' AND' : 'WHERE'} status = ?`.replace('WHEREAND', 'WHERE'));
    const resolved = resolvedStmt.get(...resolvedParams).count;

    const inProgressParams = params.length > 0 ? [...params, 'in_progress'] : ['in_progress'];
    const inProgressStmt = db.prepare(`SELECT COUNT(*) as count FROM complaints ${whereClause ? whereClause + ' AND' : 'WHERE'} status = ?`.replace('WHEREAND', 'WHERE'));
    const inProgress = inProgressStmt.get(...inProgressParams).count;

    const avgStmt = db.prepare(`SELECT AVG((julianday(resolved_at) - julianday(created_at)) * 24) as avg_hours FROM complaints WHERE status = 'resolved' AND resolved_at IS NOT NULL`);
    const avgResult = avgStmt.get();
    const avgHours = avgResult.avg_hours ? Math.round(avgResult.avg_hours) : null;

    res.json({
      stats: {
        total,
        pending,
        resolved,
        inProgress,
        avgResolutionTime: avgHours ? `${avgHours} hours` : 'N/A'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/by-status', authenticate, authorize('admin'), (req, res) => {
  try {
    const stmt = db.prepare('SELECT status, COUNT(*) as count FROM complaints GROUP BY status');
    const data = stmt.all();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/by-category', authenticate, authorize('admin'), (req, res) => {
  try {
    const stmt = db.prepare('SELECT category, COUNT(*) as count FROM complaints GROUP BY category');
    const data = stmt.all();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/by-priority', authenticate, authorize('admin'), (req, res) => {
  try {
    const stmt = db.prepare('SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority');
    const data = stmt.all();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/recent', authenticate, authorize('officer', 'admin'), (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'officer') {
      const stmt = db.prepare('SELECT c.*, u.name as user_name FROM complaints c LEFT JOIN users u ON c.user_id = u.id WHERE c.assigned_officer_id = ? ORDER BY c.updated_at DESC LIMIT 10');
      complaints = stmt.all(req.user.id);
    } else {
      const stmt = db.prepare('SELECT c.*, u.name as user_name FROM complaints c LEFT JOIN users u ON c.user_id = u.id ORDER BY c.updated_at DESC LIMIT 10');
      complaints = stmt.all();
    }
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent complaints' });
  }
});

router.get('/aging', authenticate, authorize('admin'), (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        CASE 
          WHEN julianday('now') - julianday(created_at) <= 1 THEN '1_day'
          WHEN julianday('now') - julianday(created_at) <= 3 THEN '1-3_days'
          WHEN julianday('now') - julianday(created_at) <= 7 THEN '3-7_days'
          ELSE 'over_7_days'
        END as age_group,
        COUNT(*) as count
      FROM complaints 
      WHERE status NOT IN ('resolved', 'rejected')
      GROUP BY age_group
    `);
    const data = stmt.all();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch aging data' });
  }
});

module.exports = router;
