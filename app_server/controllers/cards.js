var path = require('path');
var multiparty = require('multiparty');
var Busboy = require('busboy');
var fs = require('fs');
var request = require('request');

var apiOptions = {
	server: "http://localhost:3000"
};
/*if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://rocky-spire-35249.herokuapp.com/"
}*/

/* GET homepage */
module.exports.cardlist = function (req, res) {
	var requestOptions, path;
	path = '/api/cards';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	console.log("url " + requestOptions.url);
	request(
		requestOptions,
		function (err, response, body) {
			renderHomepage(req, res, body);
		}
	);
};

/* GET 'Card Detail' page */
module.exports.cardDetail = function (req, res) {
	getCardDetail(req, res, function (req, res, responseData) {
		renderDetailPage(req, res, responseData);
	});
};

/* GET 'New Card' form */
module.exports.cardNew = function (req, res) {
	var requestOptions, path;
	path = '/api/users';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	console.log("url " + requestOptions.url);
	request(
		requestOptions,
		function (err, response, body) {
			renderCardForm(req, res, body);
		}
	);
};

/* POST 'New Card' form */
module.exports.doCardNew = function (req, res) {
	var busboy = new Busboy({ headers: req.headers });
	var card_name, description, owner_id, saveTo;

	busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if (!filename) {
			res.redirect('/cards/new?err=val');
			return;
		}
		saveTo = path.normalize(uploads + '/' + filename);
		console.log('Uploading: ' + saveTo);
		file.pipe(fs.createWriteStream(saveTo));
	});
	busboy.on('finish', function () {
		console.log('Upload complete');
		var requestOptions, path, postdata;
		path = "/api/cards/";
		postdata = {
			name: card_name,
			description: description,
			owner_id: owner_id,
			image_path: saveTo
		};
		console.log(postdata);
		requestOptions = {
			url: apiOptions.server + path,
			method: "POST",
			json: postdata
		};
		if (!postdata.name || !postdata.owner_id) {
			res.redirect('/cards/new?err=val');
		} else {
			request(
				requestOptions,
				function (err, response, body) {
					if (response.statusCode === 201) {
						res.redirect('/cards/' + body._id);
					} else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
						res.redirect('/cards/new?err=val');
					} else {
						_showError(req, res, response.statusCode);
					}
				}
			);
		}
	});
	
	busboy.on('field', function (name, val) {
		if (name !== 'name') return;
		console.log('Retrieved card name.');
		card_name = val;
	});
	busboy.on('field', function (name, val) {
		if (name !== 'description') return;
		console.log('Retrieved card description.');
		description = val;
	});
	busboy.on('field', function (name, val) {
		if (name !== 'owner_id') return;
		console.log('Retrieved card owner_id.');
		owner_id = val;
	});

	console.log('Begin form parsing...');
	return req.pipe(busboy);
};

/* GET 'Barter' form */
module.exports.cardBarter = function (req, res) {
	getCardDetail(req, res, function (req, res, responseData) {
		renderBarterForm(req, res, responseData);
	});
}

/* Retrieves card information */
var getCardDetail = function (req, res, callback) {
	var requestOptions, path;
	path = "/api/cards/" + req.params.cardid;
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	request(
		requestOptions,
		function (err, response, body) {
			if (response.statusCode === 200) {
				callback(req, res, body);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
};

/* Retrieves card information */
var getCardList = function (req, res, callback) {
	var requestOptions, path;
	path = "/api/cards";
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	request(
		requestOptions,
		function (err, response, body) {
			if (response.statusCode === 200) {
				callback(req, res, body);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
};

/* Retrieves user information */
var getUserInfo = function (req, res, callback) {
	var requestOptions, path;
	path = "/api/users/" + req.params.userid;
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	request(
		requestOptions,
		function (err, response, body) {
			if (response.statusCode === 200) {
				callback(req, res, body);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
};

var renderHomepage = function(req, res, responseBody) {
	var message;
	if (!(responseBody instanceof Array)) {
		message = "API lookup error";
		responseBody = [];
	} else {
		if (!responseBody.length) {
			message = "No cards found";
		}
	}
	res.render('card-list', {
		title: 'CSM Card Barter',
		pageHeader: {
			title: 'CSM Card Barter',
			strapline: 'Barter fuh Cahds'
		},
		cards: responseBody,
		message: message
	});
};

var renderDetailPage = function (req, res, responseBody) {
	res.render('card-info', {
		title: 'Card Info',
		pageHeader: {
			title: 'Card Info',
			strapline: "'" + responseBody.title + "' by '" + responseBody.creator + "'"
		},
		card: responseBody
	});
};

var renderCardForm = function (req, res, responseBody) {
	res.render('card-form', {
		title: 'Add Card',
		pageHeader: {
			title: 'Add Card'
		},
		error: req.query.err,
		users: responseBody
	});
};

var renderBarterForm = function (req, res, responseBody) {
	res.render('barter-form', {
		title: 'Barter for Card',
		pageHeader: {
			title: 'Barter for Card'
		},
		error: req.query.err,
		card: responseBody,
		cards: responseBody.cards
	});
};

var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Wo bist das page?";
	} else {
		title = status + ", something's gone wrong";
		content = "We might've screwed up here. Sorry dude."
	}
	res.status(status);
	res.render('generic-text', {
		title: title,
		content: content
	});
};