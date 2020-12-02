import express from "express";
import { Login, Logout, RefreshToken, Register, 
    GetUser, AddToCart, History } from "../controllers/userCon.js";
import { Auth } from "../middleware/Auth.js";

export const userRt = express();
    userRt.post("/register", Register);
    userRt.post("/login", Login);
    userRt.get("/logout", Logout);
    userRt.get("/refresh", RefreshToken);
    userRt.get("/infor", Auth, GetUser);
    userRt.get("/addcart", Auth, AddToCart);
    userRt.get("/history", Auth, History);



