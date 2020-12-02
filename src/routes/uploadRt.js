import express from "express";
import { Auth } from "../middleware/Auth.js";
import { AuthAdmin } from "../middleware/AuthAdmin.js";
import { DeleteImage, UploadImage } from "../controllers/uploadCon.js";

// Upload image only admin can use.
export const uploadRt = express.Router();
    uploadRt.post("/upload", Auth, AuthAdmin, UploadImage);
    uploadRt.delete("/destroy", Auth, AuthAdmin, DeleteImage);



    