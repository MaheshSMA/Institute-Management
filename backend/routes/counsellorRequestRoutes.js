const express = require('express');
const {
  createRequest,
  getRequestsByStudent,
  getRequestsByFaculty,
  updateRequestStatus,
} = require('../controllers/counsellorRequestController');

const router = express.Router();

router.post('/', createRequest);

router.get('/student/:studentId', getRequestsByStudent);

router.get('/faculty/:facId', getRequestsByFaculty);

router.patch('/:requestId/status', updateRequestStatus);

module.exports = router;
