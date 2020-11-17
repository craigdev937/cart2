import { User } from "../models/User.js";

export const AuthAdmin = async (req, res, next) => {
    try {
        // Get User info by ID.
        const user = await User.findOne({
            _id: req.user.id
        });
        if (user.role === 0) {
            res.status(400)
            .json({msg: "Admin access only!"});
        };
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};


