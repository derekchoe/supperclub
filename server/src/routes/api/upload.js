import "regenerator-runtime/runtime.js";
const AWS = require("aws-sdk");
const BusBoy = require("busboy");
const express = require("express");
const auth = require('../../middleware/check-auth');

const router = express.Router();


const { s3 } = require("../../config");
const { BUCKET_NAME, IAM_USER_KEY, IAM_USER_SECRET } = s3;

const HttpError = require("../../models/http-error");

function uploadToS3(file, res) {
    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
    });

    s3bucket.createBucket(() => {
        const params = { Bucket: BUCKET_NAME, Key: file.name, Body: file.data };

        s3bucket.upload(params, (err, data) => {
            if (err) {
                return res.status(404).json(err.message);
            }

            res.json(data);
        });
    });
}

router.post("/", [auth], async (req, res, next) => {
    try {
        const busboy = new BusBoy({ headers: req.headers });

        busboy.on("finish", () => {
            const file = req.files.image;

            if (!req.files.image) {
                return res
                    .status(402)
                    .json({ errors: [{ msg: "Image not found" }] });
            }

            uploadToS3(file, res);
        });

        req.pipe(busboy);
    } catch (err) {
        const error = new HttpError("Server Error", 500);
        return next(error);
    }
});

module.exports = router;
