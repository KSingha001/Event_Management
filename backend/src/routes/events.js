const express = require('express');
const router = express.Router();
const ctl = require('../controllers/eventsController');

router.post('/', ctl.createEvent);        // create event
router.get('/', ctl.listEvents);          // list events (filter by college_id / type)
router.get('/:id', ctl.getEvent);         // get event by id
router.post('/:id/register', ctl.registerStudent); // register
router.post('/:id/checkin', ctl.checkIn); // check-in using registration info (body: student_id)
router.post('/:id/feedback', ctl.submitFeedback); // body: student_id, rating, comment

module.exports = router;
