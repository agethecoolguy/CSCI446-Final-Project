var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, "default": "No Description"},
	creator: {type: String, required: true},
	image: {type: String, "default": "No Image"}
});

var userSchema = new mongoose.Schema({
	uid: {type: Number, required: true, min: 100, max: 700},
	bio: {type: String, "default": "No Bio"},
	cards: [cardSchema]
});

mongoose.model('Card', cardSchema, 'cards');