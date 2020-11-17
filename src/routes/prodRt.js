import express from "express";
import { CreateProduct, GetProducts, UpdateProduct, 
    DeleteProduct } from "../controllers/prodCon.js";

export const protRt = express();
    protRt.post("/products", CreateProduct);
    protRt.get("/products", GetProducts);
    protRt.put("/products/:id", UpdateProduct);
    protRt.delete("/products/:id", DeleteProduct);
    


