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

/* PUT 'Accept Offer' form */
module.exports.offerAccept = function(req, res) {
//http://localhost:3000/api/offers/5ae78e7faa921aab1863b4fe
	var requestOptions, path, putdata;
	path = "/api/offers/" + req.params.offerid;
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	request (
		requestOptions,
		function(err, response, body) {
			console.log(JSON.stringify(body.requesting_cards[0]));
			if (response.statusCode === 200) {
				path = '/api/cards';
				requestOptions = {
					url: apiOptions.server + path,
					method: "GET",
					json: {}
				};
				console.log("url " + requestOptions.url);
				request (
					requestOptions,
					function(err2, response2, body2) {
						if (response2.statusCode === 200) {
							var buyer_name, buyer_desc, seller_name, seller_desc;
							console.log(body);
							for (var i = 0; i < body2.length; i++) {
								//console.log(body2[i].owner_id + " " + body2[i].description + " " + body2[i].name + body.buyer_id);
								if (body2[i].owner_id === body.buyer_id) {
									buyer_name = body2[i].description;
									buyer_desc = body2[i].name;
								} else if (body2[i].owner_id === body.seller_id) {
									//console.log("okay");
									seller_name = body2[i].description;
									seller_desc = body2[i].name;
								}
							}

							path = '/api/cards/' + body.requesting_cards[0];
							putdata = {
								name: seller_name,
								description: seller_desc,
								owner_id: body.buyer_id
							};

							doCard(req, res, path, putdata);

							path = '/api/cards/' + body.offering_cards[0];
							putdata = {
								name: buyer_name,
								description: buyer_desc,
								owner_id: body.seller_id
							};

							doCard(req, res, path, putdata);

							path = '/api/offers/' + body._id;

							deleteOffer(req, res, path);

							res.redirect('/offers');
						} else {
							res.redirect('/');
						}
					}
				);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
};

var doCard = function(req, res, path, putdata) {
	requestOptions = {
		url: apiOptions.server + path,
		method: "PUT",
		json: putdata
	};
	console.log("url " + requestOptions.url);
	request(
		requestOptions,
		function (err, response, body) {
			if (response.statusCode === 200) {
				console.log("yay");
			} else {
				console.log("wrong");
			}
		}
	);
}

var deleteOffer = function(req, res, path) {
	requestOptions = {
		url: apiOptions.server + path,
		method: "DELETE",
		json: {}
	};
	console.log("url " + requestOptions.url);
	request(
		requestOptions,
		function (err, response, body) {
			if (response.statusCode === 204) {
				console.log("yay deleted");
			} else {
				console.log("wrong");
			}
		}
	);
}

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