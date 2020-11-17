import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: Number, default: 0 },
    cart: { type: Array, default: [] }
}, {
    timestamps: true
});

export const User = mongoose.model("User", UserSchema);


