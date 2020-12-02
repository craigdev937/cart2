import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { notFoundError, errorHandler } from "./middleware/ErrorMiddleware.js";
import { protRt } from "./routes/prodRt.js";
import { userRt } from "./routes/userRt.js";
import { payRt } from "./routes/payRt.js";
import { uploadRt } from "./routes/uploadRt.js";

(async () => {
    dotenv.config();
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, useCreateIndex: true,
        useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log("MonogDB is now Connected!"))
    .catch((error) => console.log(error));

    const app = express();
    app.use(helmet());

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods",
                "POST, GET, PUT, PATCH, DELETE");
            return res.status(200).json({ "status message": "OK" });
        };
        next();
    });

    app.use(fileUpload({ useTempFiles: true }));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(logger("dev"));
    app.use("/api", protRt);
    app.use("/api", userRt);
    app.use("/api", payRt);
    app.use("/api", uploadRt);
    app.use(notFoundError, errorHandler);
    
    const port = process.env.PORT || 9000;
    app.listen(port, () => {
        console.log(`Server at: http://localhost:${port}`);
        console.log("Press Ctrl + C to exit.");
    })
})().catch((error) => console.log(error));



