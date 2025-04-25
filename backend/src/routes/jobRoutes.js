const express = require('express');
const jobController = require('../controllers/jobController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/', verifyToken,jobController.createJob);

router.get('/', jobController.getAllJobs);

router.get('/search', jobController.searchJobsByTitle);

router.get('/employer', verifyToken ,jobController.findJobByIdEmployer);

router.put('/:id', jobController.updateJob);

router.delete('/:id', jobController.deleteJob);

router.get('/:id', jobController.findJobById);



module.exports = router;