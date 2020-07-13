const router = require("express").Router();
const recipeControllers = require("../../controllers/recipe-controller");
const { check } = require("express-validator");
const auth = require('../../middleware/check-auth');


router.get("/", recipeControllers.getRecipes);

router.get("/:id", recipeControllers.getRecipeById);

router.get("/user/:id", recipeControllers.getRecipesByUserId);

router.post("/",
[
    auth,
    check("name", "Recipe requires a name"),
    check("image", "Recipe requires an image"),
    check("time", "Recipe requires time"),
    check("description", "Recipe requires a description"),
    check("ingredients", "Recipe requires a list of ingredients"),
    check("steps", "Recipe requires steps"),
],
recipeControllers.createRecipe);

module.exports = router
