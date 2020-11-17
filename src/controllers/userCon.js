import { User } from "../models/User.js";
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
        res.clearCookie("refreshtoken", {path: "/user/refresh_token"});
        return res.json({msg: "Logged out!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};


