import UserModel from '../models/user';
import "regenerator-runtime/runtime.js";
const { jwt_secret: jwtToken } = require('../config')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("express-validator");


export default {
    signin: async (req, res) => {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid Credentials" }],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                jwtToken,
                { expiresIn: "1d" },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ token });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}
