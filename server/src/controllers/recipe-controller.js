const { validationResult } = require("express-validator");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const getRecipes = async (req, res, next) => {
    let recipes;
    try {
        recipes = await Recipe.find({});
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }
    res.json({ recipes: recipes.map((r) => r.toObject({ getters: true })) });
};

const getRecipeById = async (req, res, next) => {
    const recipeId = req.params.id;

    let recipe;
    let user

    try {
        recipe = await Recipe.findById(recipeId);
        user = await User.findById(recipe.user, "-password");
    } catch (err) {
        const error = new HttpError(
           err.message,
            500
        );
        return next(error);
    }

    const recipeObject = { recipe, user }

    return res.json({ recipeObject });
};

const getRecipesByUserId = async (req, res, next) => {
    const userId = req.params.id;

    let recipes;
    try {
        recipes = await Recipe.find({ user: userId });
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }

    res.json({ recipes: recipes.map((r) => r.toObject({ getters: true })) });
};

const createRecipe = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data", 422)
        );
    }

    const {
        shortDescription,
        image,
        description,
        cuisine,
        ingredients,
        equipment,
        steps,
        title,
    } = req.body;

    // check if user exists already
    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError("Error Finding User", 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError("Could not find user for provided id", 404);
        return next(error);
    }

    const createdRecipe = new Recipe({
        shortDescription,
        image,
        description,
        user: user.id,
        cuisine,
        ingredients,
        equipment,
        steps,
        title,
    });

    // save the recipe in the database
    try {
        const sess = await mongoose.startSession();
        await sess.startTransaction();
        const recipe = await createdRecipe.save({ session: sess });
        user.recipes.push(recipe);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(201).json({ recipes: createdRecipe });
};

const updateRecipeById = async (req, res, next) => {
    const { recipeName, cuisine } = req.body;
    const recipeId = req.params.rid;

    // DUMMY variables aren't needed anymore, get elements from database
    // const updatedRecipe = {...DUMMY_RECIPES.find(r => r.id === recipeId)};
    // const recipeIndex = DUMMY_RECIPES.findIndex(r => r.id === recipeId);

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId);
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    recipe.recipeName = recipeName;
    recipe.cuisine = cuisine;

    // DUMMY_RECIPES[recipeIndex] = updatedRecipe;

    // store updated place
    try {
        await recipe.save();
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};

// fix this
const deleteRecipeById = async (req, res, next) => {
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId).populate("authorId");
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    // check whether recipe actually exists
    if (!recipe) {
        const error = new HttpError("Could not find recipe for this id", 404);
        return next(error);
    }

    // delete from our database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await recipe.remove({ session: sess });
        recipe.authorId.recipes.pull(recipe); // also removes Id
        await recipe.authorId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete recipe.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Deleted recipe" });
};

module.exports = {
    getRecipes,
    getRecipeById,
    getRecipesByUserId,
    createRecipe,
    updateRecipeById,
    deleteRecipeById
};
