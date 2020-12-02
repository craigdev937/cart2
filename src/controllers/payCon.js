import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

export const CreatePayment = async (req, res, next) => {
    try {
        const user = await (await User.findById(req.user.id))
            .isSelected("name email")
        if (!user) {
            return res.status(400).json({msg: "User doesn't exist."})
        };
        const { cart, paymentID, address } = req.body;
        const { _id, name, email } = user;
        const newPayment = new Payment({
            user_id: _id, name, email, cart, paymentID, address
        })
        cart.filter((item) => {
            return sold(item._id, item.quantity, item.sold)
        })
        await newPayment.save();
        res.json({msg: "Payment Success!"})
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const GetPayment = async (req, res, next) => {
    try {
        const payment = await Payment.find();
        res.json(payment);
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error); 
    }
};

export const Sold = async (id, quantity, oldSold) => {
    await Product.findByIdAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
};


