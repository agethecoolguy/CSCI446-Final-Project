var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var cardModel = mongoose.model('Card');
var offerModel = mongoose.model('Offer');

module.exports.cardsList = function (req, res) {
    cardModel.find({}, function(err, cards) {
        var cardsList = [];
        cards.forEach(function(card) {
            cardsList.push(card);
        });

        if (cardsList.length > 0) {
            sendJsonResponse(res, 200, cardsList);
        } else {
            sendJsonResponse(res, 404, {
                "message": "No cards found"
            });
        }
    });
};

module.exports.cardsCreate = function (req, res) {
    cardModel.create({
        title: req.body.title,
        description: req.body.description,
        creator: req.body.creator
    }, function (err, card) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            doCardNew(req, res, card);
			//sendJsonResponse(res, 201, card);
        }
    });
};

module.exports.cardsReadOne = function (req, res) {
    if (req.params && req.params.cardid) {
        cardModel
            .findById(req.params.cardid)
            .exec(function (err, card) {
                if (!card) {
                    sendJsonResponse(res, 404, {
                        "message": "cardid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, card);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No cardid in request"
        });
    }
};

module.exports.cardsUpdateOne = function (req, res) {
    if (!req.params.cardid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, cardid is required"
        });
        return;
    }
    cardModel
        .findById(req.params.cardid)
        .exec(
            function (err, card) {
                if (!card) {
                    sendJsonResponse(res, 404, {
                        "message": "cardid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                card.title = req.body.title;
                card.description = req.body.description;
                card.creator = req.body.creator;
                card.save(function (err, card) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, card);
                    }
                });
            }
        );
};

module.exports.cardsDeleteOne = function (req, res) {
    var cardid = req.params.cardid;
    if (cardid) {
        cardModel
            .findByIdAndRemove(cardid)
            .exec(
                function (err, card) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    // if cardid found, delete all offers containing the card
                    offerModel
                        .remove({ $or: [{ requesting_cards: { $all: [req.params.cardid] } }, { offering_cards: { $all: [req.params.cardid] } }] }, function (err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                                return;
                            }
                            sendJsonResponse(res, 204, null);
                        });
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No cardid"
        });
    }
};

module.exports.cardsOffersListWhereRequested = function (req, res) {
    if (req.params && req.params.cardid) {
        offerModel
            .find({ requesting_cards: { $all: [req.params.cardid] }})
            .exec(function (err, offers) {
                if (offers.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": "no cards requested under this cardid"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, offers);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No cardid in request"
        });
    }
};

module.exports.cardsOffersListWhereOffered = function (req, res) {
    if (req.params && req.params.cardid) {
        offerModel
            .find({ offering_cards: { $all: [req.params.cardid] } })
            .exec(function (err, offers) {
                if (offers.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": "no cards offered under this cardid"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, offers);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No cardid in request"
        });
    }
};

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};