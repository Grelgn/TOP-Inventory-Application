const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true, maxLength: 25 },
	description: { type: String, required: true, maxLength: 400 },
	category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
	price: { type: Number, required: true, min: 1 },
	numberInStock: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function () {
	return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
