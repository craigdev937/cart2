import fs from "fs";
import cloudinary from "cloudinary";

// Wil will upload an image on Cloudinary.
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    })
};

export const UploadImage = async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400)
            .json({msg: "No files were uploaded."});
        };
        const file = req.files.file;
        if (file.size > 1024*1024) {
            removeTmp(file.tempFilePath);
            return res.status(400)
            .json({msg: "Size is too large!"});
        };
        if (file.mimetype !== "image/jpeg" && 
        file.miketype !== "image/png") {
            removeTmp(file.tempFilePath);
            return res.status(400)
            .json({msg: "File format is incorrect."});
        };
        cloudinary.v2.uploader.upload(
            file.tempFilePath, 
            {folder: "test"}, 
            async(err, result) => {
                if (err) throw err;
                removeTmp(file.tempFilePath);
                res.json({
                    public_id: result.public_id, 
                    url: result.secure_url
                })
        })
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const DeleteImage = async (req, res, next) => {
    try {
        const {public_id} = req.body;
        if (!public_id) {
            return res.status(400)
            .json({msg: "No Images Selected!"});
        };
        cloudinary.v2.uploader.destroy(
            public_id, async(err, result) => {
                if (err) throw err;
                res.json({msg: "Deleted Image"});
            })
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};


