import UserModel from '../models/user';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt_secret as jwtSecret } from '../config';
import "regenerator-runtime/runtime.js";
const validator = require("express-validator");

const HttpError = require("../models/http-error");

export default {
    getUserById: async (req, res, next) => {
        const userId = req.params.id
        let user;

        try {
            user = await UserModel.findById(userId).select('-password');
        } catch (err) {
            const error = new HttpError(
                err.message,
                500
            );
            return next(error);
        }

        res.json({ user });
    },
    createUser: async (req, res) => {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await UserModel.findOne({ email });
            if (user) {
                return res.status(400).json({
                    errors: [{ msg: "User already exists" }],
                });
            }

            user = new UserModel({
                name,
                email,
                password,
            });
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {throw err;}
                    res.json({ token });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};
