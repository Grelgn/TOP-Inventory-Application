#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log("Debug: About to connect");
	await mongoose.connect(mongoDB);
	console.log("Debug: Should be connected?");
	await createCategories();
	await createItems();
	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
	const categorydetail = { name: name, description: description };

	const category = new Category(categorydetail);

	await category.save();
	categories[index] = category;
	console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, category, price, numberInStock) {
	const itemdetail = {
		name: name,
		description: description,
		category: category,
		price: price,
		numberInStock: numberInStock,
	};

	const item = new Item(itemdetail);

	await item.save();
	items[index] = item;
	console.log(`Added item: ${name}`);
}

async function createCategories() {
	console.log("Adding categories");
	await Promise.all([
		categoryCreate(
			0,
			"Logs",
			"A log or stem is a naturally occurring block found in trees or huge fungi, primarily used as a building block, and to create planks, a versatile crafting ingredient."
		),
		categoryCreate(
			1,
			"Planks",
			"Planks are common blocks used as building blocks and in crafting recipes. They are one of the first things that a player can craft in Survival and Adventure modes."
		),
	]);
}

async function createItems() {
	console.log("Adding items");
	await Promise.all([
		itemCreate(
			0,
			"Oak Log",
			"An oak is the most common tree in the game, found in a variety of biomes and available in several variants. It has the smallest initial space requirement for growth, and along with dark oaks, its leaves have a chance to drop an apple. As with birches and cherries, an oak grown near flowers can generate with a bee nest attached.",
			categories[0],
			8,
			1920
		),
		itemCreate(
			1,
			"Spruce Log",
			"Spruces and pines are trees with dark bark and brown wood. They have growth patterns and requirements similar to birches, although they appear different. They are mainly found in the taiga biome, but they may also generate in windswept forests, snowy plains, snowy taigas, old growth taigas, and groves.",
			categories[0],
			20,
			768
		),
		itemCreate(
			2,
			"Birch Log",
			"A birch is a tree that appears similar to a common oak in terms of height and leaves, but with light bark and pale wood. It is most commonly found in birch forest biomes. Tall birches are found only in old growth birch forest biomes and cannot be grown with saplings. As with oaks and cherries, a birch grown near flowers can generate with a bee nest attached.",
			categories[0],
			12,
			1280
		),
		itemCreate(
			3,
			"Jungle Log",
			"Jungle trees are features native to the jungle biome. Jungle trees range from short bushes to tall trees that reach up to 31 blocks in height. Their wood is of a pale brownish color.",
			categories[0],
			40,
			384
		),
		itemCreate(
			4,
			"Acacia Log",
			"An acacia is a tree with gray bark and orange wood found in the savanna biome. Acacias are around 8 blocks tall and feature distinct diagonal trunks and often multiple canopies.",
			categories[0],
			24,
			640
		),
		itemCreate(
			5,
			"Dark Oak Log",
			"A dark oak is a tree with dark bark and wood. It is a dark variant of the oak. Dark oaks have thick trunks and are found in the dark forest biome.",
			categories[0],
			32,
			480
		),
		itemCreate(
			6,
			"Oak Planks",
			"An oak is the most common tree in the game, found in a variety of biomes and available in several variants. It has the smallest initial space requirement for growth, and along with dark oaks, its leaves have a chance to drop an apple. As with birches and cherries, an oak grown near flowers can generate with a bee nest attached.",
			categories[1],
			2,
			7680
		),
		itemCreate(
			7,
			"Spruce Planks",
			"Spruces and pines are trees with dark bark and brown wood. They have growth patterns and requirements similar to birches, although they appear different. They are mainly found in the taiga biome, but they may also generate in windswept forests, snowy plains, snowy taigas, old growth taigas, and groves.",
			categories[1],
			5,
			3072
		),
		itemCreate(
			8,
			"Birch Planks",
			"A birch is a tree that appears similar to a common oak in terms of height and leaves, but with light bark and pale wood. It is most commonly found in birch forest biomes. Tall birches are found only in old growth birch forest biomes and cannot be grown with saplings. As with oaks and cherries, a birch grown near flowers can generate with a bee nest attached.",
			categories[1],
			3,
			5120
		),
		itemCreate(
			9,
			"Jungle Planks",
			"Jungle trees are features native to the jungle biome. Jungle trees range from short bushes to tall trees that reach up to 31 blocks in height. Their wood is of a pale brownish color.",
			categories[1],
			10,
			1536
		),
		itemCreate(
			10,
			"Acacia Planks",
			"An acacia is a tree with gray bark and orange wood found in the savanna biome. Acacias are around 8 blocks tall and feature distinct diagonal trunks and often multiple canopies.",
			categories[1],
			6,
			2560
		),
		itemCreate(
			11,
			"Dark Oak Planks",
			"A dark oak is a tree with dark bark and wood. It is a dark variant of the oak. Dark oaks have thick trunks and are found in the dark forest biome.",
			categories[1],
			8,
			1920
		),
	]);
}
