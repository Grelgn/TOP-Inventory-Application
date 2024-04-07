const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
	const [numCategories, numItems] = await Promise.all([
		Category.countDocuments({}).exec(),
		Item.countDocuments({}).exec(),
	]);

	res.render("index", {
		title: "Inventory Home",
		category_count: numCategories,
		item_count: numItems,
	});
});

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();

	res.render("category_list", { title: "Category List", category_list: allCategories });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
	const [category, itemsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }, "name description").exec(),
	]);

	if (category === null) {
		const err = new Error("Category not found");
		err.status = 404;
		return next(err);
	}

	res.render("category_detail", {
		title: "Category Detail",
		category: category,
		category_items: itemsInCategory,
	});
});

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
	res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post = [
	body("name", "Category name must contain at least 3 characters")
		.trim()
		.isLength({ min: 3 })
		.escape(),
	body("description", "Category description must be between 3 - 400 characters")
		.trim()
		.isLength({ min: 3, max: 300 })
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			const categoryExists = await Category.findOne({ name: req.body.name }).exec();
			if (categoryExists) {
				res.redirect(categoryExists.url);
			} else {
				await category.save();
				res.redirect(category.url);
			}
		}
	}),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Category delete GET");
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Category delete POST");
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Category update POST");
});
