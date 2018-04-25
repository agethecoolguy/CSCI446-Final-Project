var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	uid: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId()},
    pass: {type: String, required: true},
    bio: {type: String, default: "No Bio"}
});

var cardSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId}
});

var offerSchema = new mongoose.Schema({
    buyer_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    seller_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    requesting_cards: {type: [mongoose.Schema.Types.ObjectId], required: true},
    offering_cards: {type: [mongoose.Schema.Types.ObjectId], required: true}
});

mongoose.model('User', userSchema);
mongoose.model('Card', cardSchema);
mongoose.model('Offer', offerSchema);