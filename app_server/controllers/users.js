var request = require('request');
var apiOptions = {
	server: "http://localhost:3000"
};

/* GET 'User List' page */
module.exports.userlist = function(req, res) {
	var requestOptions, path;
	path = '/api/users';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	console.log("url " + requestOptions.url);
	request (
		requestOptions,
		function(err, response, body) {
			renderUserList(req, res, body);
		}
	);
};

/* GET 'User Detail' page */
module.exports.userDetail = function(req, res) {
	getUserInfo(req, res, function(req, res, responseData) {
		renderUserDetail(req, res, responseData);
	});
};

/* GET 'New User' form */
module.exports.userNew = function(req, res) {
	var requestOptions, path;
	path = '/api/user/new';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	console.log("url " + requestOptions.url);
	request (
		requestOptions,
		function(err, response, body) {
			renderUserNew(req, res, body);
		}
	);
};

/* POST 'New User' form */
module.exports.doUserNew = function(req, res) {
	var requestOptions, path, postdata;
	path = "/api/users/";
	postdata = {
		pass: req.body.pass,
		bio: req.body.bio
	};
	requestOptions = {
		url: apiOptions.server + path,
		method: "POST",
		json: postdata
	};
	if (!postdata.pass) {
		res.redirect('/user/new?err=val');
	} else {
		request(
			requestOptions,
			function(err, response, body) {
				if (response.statusCode === 201) {
					res.redirect('/users/' + postdata._id);
				} else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
					res.redirect('/user/new?err=val');
				} else {
					_showError(req, res, response.statusCode);
				}
			}
		);
	}
};

var renderUserList = function(req, res, responseBody) {
	var message;
	if (!(responseBody instanceof Array)) {
		message = "API lookup error";
		responseBody = [];
	} else {
		if (!responseBody.length) {
			message = "No users found";
		}
	}
	res.render('user-list', {
		title: 'User List',
		pageHeader: {
			title: 'User List'
		},
		users: responseBody,
		message: message
	});
};

var renderUserDetail = function(req, res, responseBody) {
	res.render('user-detail', {
		title: 'User Info',
		pageHeader: {
			title: 'User Info',
			strapline: responseBody._id
		},
		cards: responseBody.cards,
		user: responseBody
	});
};

var renderUserNew = function(req, res, responseBody) {
	res.render('user-new', {
		title: 'New User',
		pageHeader: {
			title: 'New User',
		}
	});
};

/* Retrieves user information */
var getUserInfo = function(req, res, callback) {
	var requestOptions, path;
	path = "/api/users/" + req.params.userid;
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

var _showError = function(req, res, status) {
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