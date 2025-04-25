const express =  require('express');
const verifyToken = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');
const router = express.Router();


router.post('/',verifyToken ,applicationController.applyJob);

router.get('/job/:id', applicationController.getApplicationsByJob);

router.get('/freelancer', verifyToken ,applicationController.getApplicationsByFreelancer);

router.put('/:applicationId',verifyToken ,applicationController.updateApplication);

router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
