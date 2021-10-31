const { Router } = require("express");
const router = Router();
const Product = require("../models/Product");

router
	.route("/api")
	.get(async (req, res) => {
		// Find with id
		if (req.query.id) {
			const response = await Product.findById(req.query.id);
			res.json(response);

			return;
		}

		const response = await Product.find();
		res.json(response);
	})
	.post(async (req, res) => {
		const { name, color, price } = req.body;

		// Save to DB
		const newProduct = new Product({
			name,
			color,
			price,
		});

		const result = await newProduct.save();

		res.json({ message: "Product added" });
	})
	.put(async (req, res) => {
		const { id } = req.query;
		const { name, color, price } = req.body;

		await Product.findByIdAndUpdate(id, {
			name,
			color,
			price,
		});
		res.json({ message: "Product updated" });
	})
	.delete(async (req, res) => {
		const { id } = req.query;

		await Product.findByIdAndDelete(id);
		res.json({ message: "Product deleted" });
	});

module.exports = router;
