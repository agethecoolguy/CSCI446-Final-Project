var express = require('express');
var router = express.Router();
var ctrlCards = require('../controllers/cards');
var ctrlUser = require('../controllers/users');
var ctrlAbout = require('../controllers/about');
var ctrlOffer = require('../controllers/offers');

/* About Page */
router.get('/about', ctrlAbout.about);

/* Card pages */
router.get('/', ctrlCards.cardlist);
router.get('/cards/new', ctrlCards.cardNew);
router.post('/cards/new', ctrlCards.doCardNew);
router.get('/cards/:cardid', ctrlCards.cardDetail);
router.get('/cards/:cardid/barter', ctrlCards.cardBarter);
router.post('/cards/:cardid/barter', ctrlCards.doBarterNew);

/* User pages */
router.get('/users/', ctrlUser.userlist);
router.get('/users/new', ctrlUser.userNew);
router.post('/users/new', ctrlUser.doUserNew);
router.get('/users/:userid', ctrlUser.userAndCardDetail);

/* Offer pages */
router.get('/offers', ctrlOffer.offerList);

module.exports = router;