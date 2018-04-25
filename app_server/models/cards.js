var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, "default": "No Description"},
	creator: {type: mongoose.Schema.Types.ObjectId},
	//image: {type: String, "default": "No Image"}
});

var userSchema = new mongoose.Schema({
	uid: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId()},
	pass: {type: String, required: true},
	bio: {type: String, "default": "No Bio"},
	cards: [cardSchema]
});

mongoose.model('Card', cardSchema, 'cards');