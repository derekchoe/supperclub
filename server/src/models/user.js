import mongoose from 'mongoose';
// import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

// Define the model
const UserSchema = new Schema({
    name: {
        first: String,
        last: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    recipes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Recipe",
        },
    ]
})

// Export the model
export default mongoose.model('User', UserSchema);
