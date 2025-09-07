const express = require('express');
const router = express.Router();
const ctl = require('../controllers/studentsController');

router.post('/', ctl.createOrGetStudent); // create/read student
router.get('/:id/registrations', ctl.getStudentRegistrations);

module.exports = router;
