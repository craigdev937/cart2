import express from "express";
import { Auth } from "../middleware/Auth.js";
import { AuthAdmin } from "../middleware/AuthAdmin.js";
import { CreateCategory, DeleteCategory, GetCategories, 
    UpdateCategory } from "../controllers/cateCon.js";

export const cateRt = express.Router();
    cateRt.post("/category", Auth, AuthAdmin, CreateCategory);
    cateRt.get("/category", GetCategories);
    cateRt.put("/category/:id", Auth, AuthAdmin, UpdateCategory);
    cateRt.delete("/category/:id", Auth, AuthAdmin, DeleteCategory);



