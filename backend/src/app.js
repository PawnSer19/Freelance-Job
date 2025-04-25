const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/jobs', jobRoutes);

app.use('/public', express.static('public'));

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/applications', applicationRoutes);


module.exports = app;