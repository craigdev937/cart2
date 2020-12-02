import express from "express";
import { Auth } from "../middleware/Auth.js";
import { AuthAdmin } from "../middleware/AuthAdmin.js";
import { CreatePayment, GetPayment } from "../controllers/payCon.js";

export const payRt = express.Router();
    payRt.post("/payment", Auth, CreatePayment);
    payRt.get("/payment", Auth, AuthAdmin, GetPayment);



