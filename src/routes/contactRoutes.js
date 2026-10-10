const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validate');

router.post('/contact', validateContact, submitContact);

module.exports = router;
