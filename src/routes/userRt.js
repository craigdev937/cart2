import express from "express";
import { Login, Register } from "../controllers/userCon.js";
import { Auth } from "../middleware/Auth.js";

export const userRt = express();
    userRt.post("/register", Register);
    userRt.post("/login", Login);


