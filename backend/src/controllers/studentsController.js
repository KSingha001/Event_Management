const db = require('../db');

async function createOrGetStudent(req, res) {
  const { college_id, name, email, roll_no } = req.body;
  try {
    const find = await db.query('SELECT * FROM students WHERE college_id=? AND email=?', [college_id, email]);
    if (find.rows.length) return res.json(find.rows[0]);
    const ins = await db.query(
      'INSERT INTO students (college_id,name,email,roll_no) VALUES (?,?,?,?) RETURNING *',
      [college_id, name, email, roll_no]
    );
    res.json(ins.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'createOrGetStudent error' });
  }
}

async function getStudentRegistrations(req, res) {
  try {
    const studentId = req.params.id;
    const r = await db.query(
      `SELECT r.*, e.title, e.start_time, e.end_time FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.student_id = ? ORDER BY r.registered_at DESC`,
      [studentId]
    );
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'getStudentRegistrations error' });
  }
}

module.exports = { createOrGetStudent, getStudentRegistrations };
