const db = require('../db');

async function eventPopularity(req, res) {
  try {
    const { college_id } = req.query;
    const params = [];
    let where = '';
    if (college_id) { params.push(college_id); where = `WHERE e.college_id = $${params.length}`; }
    const q = `
      SELECT e.id, e.title, e.event_type, COUNT(r.id) AS registrations
      FROM events e
      LEFT JOIN registrations r ON r.event_id = e.id
      ${where}
      GROUP BY e.id
      ORDER BY registrations DESC
    `;
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'eventPopularity error' });
  }
}

async function attendanceForEvent(req, res) {
  try {
    const eventId = req.params.eventId;
    const totalRegs = await db.query('SELECT COUNT(*) FROM registrations WHERE event_id=?', [eventId]);
    const total = parseInt(totalRegs.rows[0].count, 10);
    const presentRes = await db.query(`
      SELECT COUNT(a.id) FROM attendance a
      JOIN registrations r ON a.registration_id = r.id
      WHERE r.event_id = ?
    `, [eventId]);
    const present = parseInt(presentRes.rows[0].count, 10);
    const percentage = total ? ((present / total) * 100).toFixed(2) : 0;
    res.json({ eventId, total_registrations: total, present, attendance_percentage: Number(percentage) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'attendanceForEvent error' });
  }
}

async function avgFeedbackForEvent(req, res) {
  try {
    const eventId = req.params.eventId;
    const resq = await db.query(`
      SELECT AVG(f.rating) as avg_rating, COUNT(f.id) as feedback_count
      FROM feedbacks f
      JOIN registrations r ON f.registration_id = r.id
      WHERE r.event_id = ?
    `, [eventId]);
    res.json(resq.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'avgFeedbackForEvent error' });
  }
}

async function studentParticipation(req, res) {
  try {
    const studentId = req.params.studentId;
    const r = await db.query(`
      SELECT COUNT(a.id) as events_attended
      FROM registrations reg
      LEFT JOIN attendance a ON a.registration_id = reg.id
      WHERE reg.student_id = ? AND a.id IS NOT NULL
    `, [studentId]);
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'studentParticipation error' });
  }
}

async function topActiveStudents(req, res) {
  try {
    const { college_id } = req.query;
    const params = [];
    let where = '';
    if (college_id) { params.push(college_id); where = `WHERE s.college_id = $${params.length}`; }
    const q = `
      SELECT s.id, s.name, s.email, COUNT(a.id) as attended_count
      FROM students s
      JOIN registrations reg ON reg.student_id = s.id
      JOIN attendance a ON a.registration_id = reg.id
      ${where}
      GROUP BY s.id
      ORDER BY attended_count DESC
      LIMIT 3
    `;
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'topActiveStudents error' });
  }
}

module.exports = { eventPopularity, attendanceForEvent, avgFeedbackForEvent, studentParticipation, topActiveStudents };
