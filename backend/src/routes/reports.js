const express = require('express');
const router = express.Router();
const ctl = require('../controllers/reportsController');

router.get('/event-popularity', ctl.eventPopularity); // ?college_id=
router.get('/attendance/:eventId', ctl.attendanceForEvent);
router.get('/avg-feedback/:eventId', ctl.avgFeedbackForEvent);
router.get('/student-participation/:studentId', ctl.studentParticipation);
router.get('/top-active-students', ctl.topActiveStudents); // ?college_id=
module.exports = router;
