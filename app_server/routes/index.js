var express = require('express');
var router = express.Router();
var ctrlCards = require('../controllers/cards');
var ctrlUser = require('../controllers/users');

/* Card pages */
router.get('/', ctrlCards.cardlist);
router.get('/cards/:cardid', ctrlCards.cardDetail);
router.get('/cards/:cardid/barter', ctrlCards.cardBarter);
router.get('/card/new', ctrlCards.cardNew);
router.post('/card/new', ctrlCards.doCardNew);

/* User pages */
router.get('/users/', ctrlUser.userlist);
router.get('/users/:userid', ctrlUser.userDetail);
router.get('/user/new', ctrlUser.userNew);
router.post('/user/new', ctrlUser.doUserNew);

module.exports = router;