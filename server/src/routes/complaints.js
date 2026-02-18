const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const validStatuses = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected'];
const validPriorities = ['low', 'medium', 'high', 'critical'];
const validCategories = ['infrastructure', 'service', 'harassment', 'billing', 'facilities', 'other'];

router.post('/', authenticate, (req, res) => {
  const { title, description, category = 'other', priority = 'medium' } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  try {
    const id = uuidv4();
    const userId = req.user.id;

    const stmt = db.prepare('INSERT INTO complaints (id, user_id, title, description, category, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, userId, title, description, category, priority, 'pending');

    const historyStmt = db.prepare('INSERT INTO complaint_history (id, complaint_id, changed_by, new_status, comment) VALUES (?, ?, ?, ?, ?)');
    historyStmt.run(uuidv4(), id, userId, 'pending', 'Complaint submitted');

    const complaintStmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const complaint = complaintStmt.get(id);

    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create complaint' });
  }
});

router.get('/', authenticate, (req, res) => {
  const { status, category, priority } = req.query;
  let query = 'SELECT c.*, u.name as user_name, u.email as user_email, o.name as officer_name FROM complaints c LEFT JOIN users u ON c.user_id = u.id LEFT JOIN users o ON c.assigned_officer_id = o.id';
  const params = [];
  const conditions = [];

  if (req.user.role === 'user') {
    conditions.push('c.user_id = ?');
    params.push(req.user.id);
  } else if (req.user.role === 'officer') {
    conditions.push('(c.assigned_officer_id = ? OR c.status = ?)');
    params.push(req.user.id, 'pending');
  }

  if (status) {
    conditions.push('c.status = ?');
    params.push(status);
  }
  if (category) {
    conditions.push('c.category = ?');
    params.push(category);
  }
  if (priority) {
    conditions.push('c.priority = ?');
    params.push(priority);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY c.created_at DESC';

  try {
    const stmt = db.prepare(query);
    const complaints = stmt.all(...params);
    res.json({ complaints });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

router.get('/assigned', authenticate, authorize('officer', 'admin'), (req, res) => {
  try {
    const stmt = db.prepare('SELECT c.*, u.name as user_name, u.email as user_email FROM complaints c LEFT JOIN users u ON c.user_id = u.id WHERE c.assigned_officer_id = ? ORDER BY c.priority DESC, c.created_at ASC');
    const complaints = stmt.all(req.user.id);
    res.json({ complaints });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch assigned complaints' });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const stmt = db.prepare(`SELECT c.*, u.name as user_name, u.email as user_email, o.name as officer_name 
               FROM complaints c 
               LEFT JOIN users u ON c.user_id = u.id 
               LEFT JOIN users o ON c.assigned_officer_id = o.id 
               WHERE c.id = ?`);
    const complaint = stmt.get(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (req.user.role === 'user' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const historyStmt = db.prepare('SELECT * FROM complaint_history WHERE complaint_id = ? ORDER BY timestamp ASC');
    const history = historyStmt.all(complaint.id);

    res.json({ complaint, history });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

router.put('/:id', authenticate, (req, res) => {
  const { title, description, category, priority } = req.body;
  const complaintId = req.params.id;

  try {
    const stmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const complaint = stmt.get(complaintId);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (req.user.role === 'user' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = [];
    const params = [];

    if (title) { updates.push('title = ?'); params.push(title); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (category && validCategories.includes(category)) { updates.push('category = ?'); params.push(category); }
    if (priority && validPriorities.includes(priority)) { updates.push('priority = ?'); params.push(priority); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(complaintId);

    const updateStmt = db.prepare(`UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`);
    updateStmt.run(...params);

    const updatedStmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const updated = updatedStmt.get(complaintId);

    res.json({ message: 'Complaint updated', complaint: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Update failed' });
  }
});

router.put('/:id/status', authenticate, authorize('officer', 'admin'), (req, res) => {
  const { status, comment } = req.body;
  const complaintId = req.params.id;

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const complaint = stmt.get(complaintId);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const oldStatus = complaint.status;
    const updates = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const params = [status, complaintId];

    if (status === 'resolved') {
      updates.push('resolved_at = CURRENT_TIMESTAMP');
    }

    const updateStmt = db.prepare(`UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`);
    updateStmt.run(...params);

    const historyStmt = db.prepare('INSERT INTO complaint_history (id, complaint_id, changed_by, old_status, new_status, comment) VALUES (?, ?, ?, ?, ?, ?)');
    historyStmt.run(uuidv4(), complaintId, req.user.id, oldStatus, status, comment || `Status changed to ${status}`);

    const updatedStmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const updated = updatedStmt.get(complaintId);

    res.json({ message: 'Status updated', complaint: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Status update failed' });
  }
});

router.put('/:id/assign', authenticate, authorize('admin'), (req, res) => {
  const { officer_id } = req.body;
  const complaintId = req.params.id;

  if (!officer_id) {
    return res.status(400).json({ error: 'Officer ID is required' });
  }

  try {
    const complaintStmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const complaint = complaintStmt.get(complaintId);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    console.log('Checking officer:', officer_id);
    const officerStmt = db.prepare('SELECT * FROM users WHERE id = ? AND role IN (?, ?)');
    const officer = officerStmt.get(officer_id, 'officer', 'admin');
    console.log('Officer:', officer);

    if (!officer) {
      return res.status(400).json({ error: 'Invalid officer' });
    }

    const updateStmt = db.prepare('UPDATE complaints SET assigned_officer_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    updateStmt.run(officer_id, complaintId);

    const historyStmt = db.prepare('INSERT INTO complaint_history (id, complaint_id, changed_by, new_status, comment) VALUES (?, ?, ?, ?, ?)');
    historyStmt.run(uuidv4(), complaintId, req.user.id, complaint.status, `Assigned to ${officer.name}`);

    const updatedStmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const updated = updatedStmt.get(complaintId);

    res.json({ message: 'Complaint assigned', complaint: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Assignment failed' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const complaintId = req.params.id;

  try {
    const deleteHistoryStmt = db.prepare('DELETE FROM complaint_history WHERE complaint_id = ?');
    deleteHistoryStmt.run(complaintId);

    const deleteStmt = db.prepare('DELETE FROM complaints WHERE id = ?');
    deleteStmt.run(complaintId);

    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
