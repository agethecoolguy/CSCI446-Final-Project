var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, "default": "No Description"},
	creator: {type: String, required: true},
	image: {type: String, "default": "No Image"}
});

var userSchema = new mongoose.Schema({
	pass: {type: String, required: true},
	bio: {type: String, "default": "No Bio"},
	cards: [cardSchema]
});

mongoose.model('Card', cardSchema, 'cards');