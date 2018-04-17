var express = require('express');
var router = express.Router();
var ctrlBarter = require('../controllers/barter');

/* Barter pages */
router.get('/', ctrlBarter.home);

module.exports = router;
