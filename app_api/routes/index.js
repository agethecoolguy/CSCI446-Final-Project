var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users');
var ctrlCards = require('../controllers/cards');
var ctrlOffers = require('../controllers/offers');

// **** USERS ****

// read list of users
router.get('/users', ctrlUsers.usersList);
// create user
router.post('/users', ctrlUsers.usersCreate);
// read single user
router.get('/users/:userid', ctrlUsers.usersReadOne);
// update single user
router.put('/users/:userid', ctrlUsers.usersUpdateOne);
// delete single user
router.delete('/users/:userid', ctrlUsers.usersDeleteOne);
// get user cards list
router.get('/users/:userid/cards', ctrlUsers.usersCardsList);
// get user offers where buying
router.get('/users/:userid/offers/buying', ctrlUsers.usersOffersListWhereBuying);
// get user offers where selling
router.get('/users/:userid/offers/selling', ctrlUsers.usersOffersListWhereSelling);

// **** CARDS ****

// read list of cards
router.get('/cards', ctrlCards.cardsList);
// create card
router.post('/cards', ctrlCards.cardsCreate);
// read single card
router.get('/cards/:cardid', ctrlCards.cardsReadOne);
// update single card
router.put('/cards/:cardid', ctrlCards.cardsUpdateOne);
// delete single card
router.delete('/cards/:cardid', ctrlCards.cardsDeleteOne);
// get offers where card requested
router.get('/cards/:cardid/offers/requested', ctrlCards.cardsOffersListWhereRequested);
// get offers where card offered
router.get('/cards/:cardid/offers/offered', ctrlCards.cardsOffersListWhereOffered);


// **** OFFERS ****

// read list of offers
router.get('/offers', ctrlOffers.offersList);
// create offer
router.post('/offers', ctrlOffers.offersCreate);
// read single offer
router.get('/offers/:offerid', ctrlOffers.offersReadOne);
// delete single offer
router.delete('/offers/:offerid', ctrlOffers.offersDeleteOne);
// accept offer
router.post('/offers/:offerid/accept', ctrlOffers.offersAccept);

module.exports = router;