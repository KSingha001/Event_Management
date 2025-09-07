const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const eventsRouter = require('./routes/events');
const studentsRouter = require('./routes/students');
const reportsRouter = require('./routes/reports');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/reports', reportsRouter);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 4000;
app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});
