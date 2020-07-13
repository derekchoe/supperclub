import AuthController from '../../controllers/auth-controller'
import UserController from '../../controllers/users-controller';
const validator = require("express-validator");

const router = require('express').Router();

router.post('/signin', [
    validator.check("email", "Please include a valid email").isEmail(),
    validator.check("password", "Password is required").exists(),
], AuthController.signin)

router.post('/signup', [
    validator.check("name", "Name is required").not().isEmpty(),
    validator.check("email", "Please include a valid email").isEmail(),
    validator
        .check(
            "password",
            "Please enter a password with a minimum of 6 characters"
        )
        .isLength({ min: 6 }),
], UserController.createUser);

module.exports = router;
