import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: { type: String, required: true },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
        required: true,
    },
    cuisine: { type: String, required: true },
    ingredients: [
        {
            ingredient: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            units: {
                type: String,
            },
        },
    ],
    equipment: [{ type: String, required: true }],
    steps: [
        {
            shortDescription: {
                type: String,
                required: true,
            },
            longDescription: {
                type: String,
                required: true,
            },
            ingredients: [String],
            equipments: [String],
            image: {
                type: String,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                refs: "User",
            },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now },
            likes: [{
                user: {
                    type: Schema.Types.ObjectId,
                    refs: "User",
                },
            }]
        },
    ],
});

export default mongoose.model("Recipe", RecipeSchema);
