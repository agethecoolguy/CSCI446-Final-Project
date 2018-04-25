var express = require('express');
var router = express.Router();
var ctrlCards = require('../controllers/cards');
//var ctrlUser = require('../controllers/users');

/* Card pages */
router.get('/', ctrlCards.homelist);
router.get('/cards/:cardid', ctrlCards.cardDetail);
router.get('/cards/:cardid/barter', ctrlCards.cardBarter);
router.get('/card/new', ctrlCards.cardNew);

/* User pages */
//router.get('/users/:userid', ctrlUser.userDetail);

module.exports = router;