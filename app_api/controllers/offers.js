var mongoose = require('mongoose');
var offerModel = mongoose.model('Offer');
var cardModel = mongoose.model('Card');

module.exports.offersList = function (req, res) {
    offerModel.find({}, function (err, offers) {
        var offersList = [];
        offers.forEach(function (offer) {
            offersList.push(offer);
        });

        if (offersList.length > 0) {
            sendJsonResponse(res, 200, offersList);
        } else {
            sendJsonResponse(res, 404, {
                "message": "No offers found"
            });
        }
    });
};

module.exports.offersCreate = function (req, res) {
    if (!req.body.buyer_id || !req.body.seller_id || !req.body.requesting_cards || !req.body.offering_cards) {
        sendJsonResponse(res, 400, {message: 'Missing required field.'});
        return;
    }

    requesting_cards = req.body.requesting_cards;
    offering_cards = req.body.offering_cards;

    // convert single element cards into arrays
    if (typeof (requesting_cards) == "string") {
        console.log("boop");
        requesting_cards = [];
        requesting_cards.push(req.body.requesting_cards);
    }
    if (typeof (offering_cards) == "string") {
        offering_cards = [];
        offering_cards.push(req.body.offering_cards);
    }

    offer = {
        buyer_id: req.body.buyer_id,
        seller_id: req.body.seller_id,
        requesting_cards: requesting_cards,
        offering_cards: offering_cards
    };

    if (!req.body.buyer_id || !req.body.seller_id || !req.body.requesting_cards || !req.body.offering_cards) {
        sendJsonResponse(res, 400, { message: "All fields required" });
        return;
    }

    var responseLock = { responseSent: false };
    validateOffer(offer, function (err) {
        if (err) {
            sendJsonResponse(res, 400, err, responseLock);
            return;
        }

        offerModel.create(offer, function (err, offer) {
            if (err) {
                sendJsonResponse(res, 400, err, responseLock);
            } else {
                sendJsonResponse(res, 201, offer, responseLock);
            }
        });
    });
};

var validateOffer = function (offer, callback) {
    var cardsValidated = 0;
    var errorReported = false;

    function report(err) {
        cardsValidated++;

        if (err && !errorReported) {
            callback(err);
            errorReported = true;
        }
        else if (cardsValidated === offer.requesting_cards.length + offer.offering_cards.length) {
            callback(null);
        }
    }

    console.log("Validating offer...");
    if (!offer.requesting_cards.length || !offer.offering_cards.length) {
        report({
            "message": "offer cards must be an array"
        });
        return;
    }

    for (var i = 0; i < offer.requesting_cards.length; i++) {
        cardModel
            .findById(offer.requesting_cards[i])
            .select('-image')
            .exec(function (err, card) {
                if (!card) {
                    report({
                        "message": "cardid not found"
                    });
                    return;
                } else if (err) {
                    report(err);
                    return;
                }

                if (card.owner_id != offer.seller_id) {
                    report({
                        "message": "card " + card._id + " does not belong to seller " + offer.seller_id
                    });
                    return;
                } else {
                    report(null);
                }
            });
    }
    for (var i = 0; i < offer.offering_cards.length; i++) {
        cardModel
            .findById(offer.offering_cards[i])
            .select('-image')
            .exec(function (err, card) {
                if (!card) {
                    report({
                        "message": "cardid not found"
                    });
                    return;
                } else if (err) {
                    report(err);
                    return;
                }

                if (card.owner_id != offer.buyer_id) {
                    report({
                        "message": "card " + card._id + " does not belong to buyer " + offer.buyer_id
                    });
                    return;
                } else {
                    report(null);
                }
            });
    }
};

module.exports.offersReadOne = function (req, res) {
    if (req.params && req.params.offerid) {
        offerModel
            .findById(req.params.offerid)
            .exec(function (err, offer) {
                if (!offer) {
                    sendJsonResponse(res, 404, {
                        "message": "offerid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, offer);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No offerid in request"
        });
    }
};

module.exports.offersDeleteOne = function (req, res) {
    var offerid = req.params.offerid;
    if (offerid) {
        offerModel
            .findByIdAndRemove(offerid)
            .exec(
                function (err, offer) {
                    if (err) {
                        sendJsonResponse(res, 400, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No offerid"
        });
    }
};

module.exports.offersAccept = function (req, res) {
    var offerid = req.params.offerid;
    if (req.params && req.params.offerid) {
        offerModel
            .findById(offerid)
            .exec(function (err, offer) {
                if (!offer) {
                    sendJsonResponse(res, 404, {
                        "message": "offerid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }

                responseLock = { responseSent : false };
                transferOwnership(offer, function (err, result) {
                    if (err) {
                        sendJsonResponse(res, 400, err, responseLock);
                    }
                    else {
                        // if successful, delete offer
                        offerModel
                            .findByIdAndRemove(offerid)
                            .exec(
                                function (err, offer) {
                                    if (err) {
                                        sendJsonResponse(res, 400, err, responseLock);
                                        return;
                                    }
                                    sendJsonResponse(res, 200, result, responseLock);
                                }
                            );
                    }
                });
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No offerid in request"
        });
    }
};

var transferOwnership = function (offer, callback) {
    var cardsTransfered = 0;
    var errorReported = false;

    var result = {
        message: "Offer accepted and closed",
        offer: offer,
        buyer: {
            _id: offer.buyer_id,
            new_cards: offer.requesting_cards
        },
        seller: {
            _id: offer.seller_id,
            new_cards: offer.offering_cards
        }
    }

    function report(err) {
        cardsTransfered++;

        if (err && !errorReported) {
            callback(err);
            errorReported = true;
        }
        else if (cardsTransfered === offer.requesting_cards.length + offer.offering_cards.length) {
            callback(null, result);
        }
    }

    console.log("Transfering ownership: " + offer.seller_id + " to " + offer.buyer_id);
    for (var i = 0; i < offer.requesting_cards.length; i++) {
        console.log(i);
        cardModel.update({ _id: offer.requesting_cards[i] }, { owner_id: offer.buyer_id }, function (err, card) {
            report(err);
        });
    }
    for (var i = 0; i < offer.offering_cards.length; i++) {
        cardModel.update({ _id: offer.offering_cards[i] }, { owner_id: offer.seller_id }, function (err, card) {
            report(err);
        });
    }
};

var sendJsonResponse = function (res, status, content, responseLock) {
    if(!responseLock) {
        responseLock = { responseSent : false };
    }

    if (!responseLock.responseSent) {
        res.status(status);
        res.json(content);
        responseLock.responseSent = true;
    }
};