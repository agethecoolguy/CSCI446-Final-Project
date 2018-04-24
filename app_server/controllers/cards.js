var request = require('request');
var apiOptions = {
	server: "http://localhost:3000"
};
/*if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://rocky-spire-35249.herokuapp.com/"
}*/

/* GET homepage */
module.exports.homelist = function(req, res) {
	var requestOptions, path;
	path = '/api/cards';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {},
		qs: {}
	};
	console.log("url " + requestOptions.url);
	request (
		requestOptions,
		function(err, response, body) {
			renderHomepage(req, res, body);
		}
	);
};

/* card info */
var getCardInfo = function(req, res, callback) {
	var requestOptions, path;
	path = "/api/cards/" + req.params.cardid;
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	request (
		requestOptions,
		function(err, response, body) {
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