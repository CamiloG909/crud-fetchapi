const { Schema, model } = require("mongoose");

const Product = new Schema(
	{
		name: String,
		color: String,
		price: String,
	},
	{
		versionKey: false,
	}
);

module.exports = model("Product", Product);
