var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
    bio: {type: String, default: "No Bio"}
});

var cardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    owner_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    image: { data: Buffer, contentType: String }
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