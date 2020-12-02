import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    paymaneID: { type: String, required: true },
    address: { type: Object, required: true },
    cart: { type: Array, default: [] },
    status: { type: Boolean, default: false },
}, {
    timestamps: true
});

export const Payment = mongoose.model("Payment", PaymentSchema);



