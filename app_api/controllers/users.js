var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var cardModel = mongoose.model('Card');
var offerModel = mongoose.model('Offer');

module.exports.usersList = function (req, res) {
    userModel.find({}, { password: 0, email: 0 }, function (err, users) {
        var usersList = [];
        users.forEach(function (user) {
            usersList.push(user);
        });

        if (usersList.length > 0) {
            sendJsonResponse(res, 200, usersList);
        } else {
            sendJsonResponse(res, 404, {
                "message": "No users found"
            });
        }
    });
};

module.exports.usersCreate = function (req, res) {
    userModel.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }, function (err, user) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, user);
        }
    });
};

module.exports.usersReadOne = function (req, res) {
    if (req.params && req.params.userid) {
        userModel
            .findById(req.params.userid)
            .exec(function (err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "userid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, user);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No userid in request"
        });
    }
};

module.exports.usersUpdateOne = function (req, res) {
    if (!req.params.userid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, userid is required"
        });
        return;
    }
    userModel
        .findById(req.params.userid)
        .exec(
            function (err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "userid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                user.username = req.body.username;
                user.password = req.body.password;
                user.email = req.body.email;
                user.save(function (err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, user);
                    }
                });
            }
        );
};

module.exports.usersDeleteOne = function (req, res) {
    var userid = req.params.userid;
    if (userid) {
        userModel
            .findByIdAndRemove(userid)
            .exec(
                function (err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }

                    cardModel
                        .remove({ owner_id: userid }, function (err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                                return;
                            }
                            
                            offerModel
                                .remove({ $or: [{ buyer_id: userid }, { seller_id: userid}]}, function (err) {
                                    if (err) {
                                        sendJsonResponse(res, 404, err);
                                        return;
                                    }
                                    sendJsonResponse(res, 204, null);
                                });
                        });
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No userid"
        });
    }
};

module.exports.usersCardsList = function (req, res) {
    if (req.params && req.params.userid) {
        cardModel
            .find({ owner_id: req.params.userid })
            .exec(function (err, cards) {
                if (cards.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": "no cards under this userid"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, cards);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No userid in request"
        });
    }
};

module.exports.usersOffersListWhereBuying = function (req, res) {
    if (req.params && req.params.userid) {
        offerModel
            .find({ buyer_id: req.params.userid })
            .exec(function (err, offers) {
                if (offers.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": "no buying offers under this userid"
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
            "message": "No userid in request"
        });
    }
};

module.exports.usersOffersListWhereSelling = function (req, res) {
    if (req.params && req.params.userid) {
        offerModel
            .find({ seller_id: req.params.userid })
            .exec(function (err, offers) {
                if (offers.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": "no selling offers under this userid"
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
            "message": "No userid in request"
        });
    }
};

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};