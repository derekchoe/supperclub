import RecipeController from '../../controllers/recipe-controller';
import UserController from '../../controllers/users-controller';
const router = require('express').Router();


router.get('/:id', UserController.getUserById)

router.get('/:id/recipes', RecipeController.getRecipesByUserId)

module.exports = router;
