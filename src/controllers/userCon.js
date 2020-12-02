import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({email});
        if (user) {
            return res.status(400)
            .json({msg: "The email already exists."})
        };

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, email, password: passwordHash
        })
        await newUser.save();

        const accesstoken = createAccessToken({id: newUser._id});
        const refreshtoken = createRefreshToken({id: newUser._id});
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            path: "/user/refresh_token",
            maxAge: 7*24*60*60*1000 // 7-days.
        })
        res.json({accesstoken});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            res.status(400).json({msg: "user doesn't exist."});
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({msg: "Incorrect Password!"});
        };

        const accesstoken = createAccessToken({id: user._id});
        const refreshtoken = createRefreshToken({id: user._id});
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            path: "/user/refresh_token",
            maxAge: 7*24*60*60*1000  // 7-days.
        });
        res.json({accesstoken});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const Logout = async (req, res, next) => {
    try {
        res.clearCookie("refreshtoken", {
            path: "/user/refresh_token"
        });
        return res.json({msg: "Logged out!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const RefreshToken = async (req, res, next) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) {
            res.status(400)
            .json({msg: "Please Login or Register!"});
        };
        
        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, 
            (err, user) => {
                if (err) {
                    res.status(400)
                    .json({msg: "Please Login or Register!"});
                };
                const accesstoken = createAccessToken({id: user.id});
                res.json({accesstoken});
            })
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const GetUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .isSelected("-password");
        if (!user) {
            return res.status(400)
                .json({msg: "User doesn't exist."})
        };
        res.json(user);
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const AddToCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400)
                .json({msg: "User doesn't exist."});
        };
        await User.findByIdAndUpdate({_id: req.user.id}, {
            cart: req.body.cart
        })
        return res.json({msg: "Added to cart."});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

const createAccessToken = (user) => {
    return jwt.sign(
        user, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: "11m"})
};

const createRefreshToken = (user) => {
    return jwt.sign(
        user, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: "7d"});
};

export const History = async (req, res, next) => {
    try {
        const history = await Payment.find({
            user_id: req.user.id
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};


