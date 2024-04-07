const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find().sort({ name: 1 }).exec();

	res.render("item_list", { title: "Item List", item_list: allItems });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).populate("category").exec();

	if (item === null) {
		const err = new Error("Item not found");
		err.status = 404;
		return next(err);
	}

	res.render("item_detail", {
		title: "Item Detail",
		item: item,
	});
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find({}, "name");
	res.render("item_form", {
		title: "Create Item",
		category_list: allCategories,
	});
});

// Handle Item create on POST.
exports.item_create_post = [
	body("name", "Item name must be specified").trim().isLength({ min: 1 }).escape(),
	body("description", "Item description must be between 3 - 400 characters")
		.trim()
		.isLength({ min: 3, max: 300 })
		.escape(),
	body("category, Category must be specified").escape(),
	body("price", "Item price must be specified").trim().isInt({ min: 0 }).escape(),
	body("numberInStock", "Item number in stock must be specified")
		.trim()
		.isInt({ min: 0 })
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			numberInStock: req.body.numberInStock,
		});

		if (!errors.isEmpty()) {
			const allCategories = await Category.find({}, "name")
				.sort({ name: 1 })
				.exec();

			res.render("item_form", {
				title: "Create Item",
				category_list: allCategories,
				selected_category: item.category._id ? item.category._id : "", // ensure selected_category is defined
				errors: errors.array(),
				item: item,
			});
			return;
		} else {
			await item.save();
			res.redirect(item.url);
		}
	}),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).exec();

	if (item === null) {
		res.redirect("/inventory/items");
	}

	res.render("item_delete", {
		title: "Delete Item",
		item: item,
	});
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).exec();

	await Item.findByIdAndDelete(req.body.itemid);
	res.redirect("/inventory/items");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item update POST");
});
