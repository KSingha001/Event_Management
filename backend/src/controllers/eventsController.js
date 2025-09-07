const db = require('../db');

async function createEvent(req, res) {
  try {
    const {
      college_id, title, description, event_type,
      start_time, end_time, location, capacity
    } = req.body;
    const [result] = await db.query(
      `INSERT INTO events (college_id, title, description, event_type, start_time, end_time, location, capacity)
       VALUES (?,?,?,?,?,?,?,?)`,
      [college_id, title, description, event_type, start_time, end_time, location, capacity || 0]
    );
    const insertedId = result.insertId;
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [insertedId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'createEvent error' });
  }
}

async function listEvents(req, res) {
  try {
    const { college_id, event_type } = req.query;
    let q = 'SELECT * FROM events';
    const params = [];
    const where = [];
    if (college_id) { params.push(college_id); where.push(`college_id = ?`); }
    if (event_type) { params.push(event_type); where.push(`event_type = ?`); }
    if (where.length) q += ' WHERE ' + where.join(' AND ');
    q += ' ORDER BY start_time DESC';
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'listEvents error' });
  }
}

async function getEvent(req, res) {
  const id = req.params.id;
  const result = await db.query('SELECT * FROM events WHERE id=?', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
  res.json(result.rows[0]);
}

async function registerStudent(req, res) {
  try {
    const eventId = req.params.id;
    const { student_id, student } = req.body; // client may send existing student_id or student details

    let sid = student_id;
    if (!sid && student) {
      // create or find student
      const find = await db.query('SELECT * FROM students WHERE college_id=? AND email=?', [student.college_id, student.email]);
      if (find.rows.length) sid = find.rows[0].id;
      else {
        const ins = await db.query(
          'INSERT INTO students (college_id,name,email,roll_no) VALUES (?,?,?,?) RETURNING id',
          [student.college_id, student.name, student.email, student.roll_no]
        );
        sid = ins.rows[0].id;
      }
    }

    // create registration if not exists
    const exists = await db.query('SELECT * FROM registrations WHERE event_id=? AND student_id=?', [eventId, sid]);
    if (exists.rows.length) return res.status(400).json({ error: 'Already registered' });

    const reg = await db.query(
      'INSERT INTO registrations (event_id, student_id) VALUES (?,?) RETURNING *',
      [eventId, sid]
    );
    res.json(reg.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'registerStudent error' });
  }
}

async function checkIn(req, res) {
  try {
    const eventId = req.params.id;
    const { student_id } = req.body;
    // find registration
    const reg = await db.query('SELECT * FROM registrations WHERE event_id=? AND student_id=?', [eventId, student_id]);
    if (!reg.rows.length) return res.status(404).json({ error: 'Registration not found' });

    const regId = reg.rows[0].id;
    const already = await db.query('SELECT * FROM attendance WHERE registration_id=?', [regId]);
    if (already.rows.length) return res.status(400).json({ error: 'Already checked-in' });

    const ins = await db.query('INSERT INTO attendance (registration_id) VALUES (?) RETURNING *', [regId]);
    res.json(ins.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'checkIn error' });
  }
}

async function submitFeedback(req, res) {
  try {
    const eventId = req.params.id;
    const { student_id, rating, comment } = req.body;
    const reg = await db.query('SELECT * FROM registrations WHERE event_id=? AND student_id=?', [eventId, student_id]);
    if (!reg.rows.length) return res.status(404).json({ error: 'Registration not found' });
    const regId = reg.rows[0].id;
    // allow only one feedback per registration
    const existing = await db.query('SELECT * FROM feedbacks WHERE registration_id=?', [regId]);
    if (existing.rows.length) return res.status(400).json({ error: 'Feedback already submitted' });
    const ins = await db.query('INSERT INTO feedbacks (registration_id, rating, comment) VALUES (?,?,?) RETURNING *', [regId, rating, comment]);
    res.json(ins.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'submitFeedback error' });
  }
}

async function eventsByType(req, res) {
  try {
    const eventType = req.params.type;
    const [rows] = await db.query(
      'SELECT * FROM events WHERE event_type = ? ORDER BY start_time DESC',
      [eventType]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'eventsByType error' });
  }
}

module.exports = { createEvent, listEvents, getEvent, registerStudent, checkIn, submitFeedback, eventsByType };
