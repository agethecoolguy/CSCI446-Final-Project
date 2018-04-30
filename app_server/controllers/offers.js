var request = require('request');
var apiOptions = {
	server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://calm-savannah-80395.herokuapp.com"
}

/* GET 'User List' page */
module.exports.offerList = function(req, res) {
	var requestOptions, path;
	path = '/api/offers';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	console.log("url " + requestOptions.url);
	request (
		requestOptions,
		function(err, response, body) {
			renderOfferList(req, res, body);
		}
	);
};

var renderOfferList = function(req, res, responseBody) {
	var message;
	if (!(responseBody instanceof Array)) {
		message = "API lookup error";
		responseBody = [];
	} else {
		if (!responseBody.length) {
			message = "No offers found";
		}
	}
	res.render('offer-list', {
		title: 'Offer List',
		pageHeader: {
			title: 'Offer List'
		},
		offers: responseBody,
		message: message
	});
};