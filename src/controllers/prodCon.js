import { Product } from "../models/Product.js";

// Filter, sorting and paginating.
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    };

    filtering() {
        // queryString = req.query
        const queryObj = {...this.queryString};

        const excludedFields = ["page", "sort", "limit"];
        excludedFields.forEach((el) => delete(queryObj[el]));

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte|regex)\b/g, match => "$" + match);
        // gt = greater than, gte = greater than or equal.
        // lt = less than, lte = less than or equal.
        this.query.find(JSON.parse(queryStr));
        return this;
    };

    sorting() {
        if (this.queryString.sort) {
            const storBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        };
        return this;
    };

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
};

export const CreateProduct = async (req, res, next) => {
    try {
        const { product_id, title, price, description,
            content, images, category } = req.body;
        if (!images) {
            return res.status(400).json({msg: "No image upload"});
        };
        const product = await Product.findOne({product_id});
        if (product) {
            return res.status(400)
                .json({msg: "This product already exists."});
        };
        const newProduct = new Product({
            product_id, title: title.toLowerCase(), price,
            description, content, images, category
        });
        await newProduct.save();
        res.json({msg: "Created a Product!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const GetProducts = async (req, res, next) => {
    try {
        const features = new APIfeatures(
            Product.find(), req.query)
            .filtering().sorting().paginating();

        const products = await features.query;
        res.json({
            status: "success",
            results: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const UpdateProduct = async (req, res, next) => {
    try {
        const { title, price, description, content, 
            images,category } = req.body;
        if (!images) {
            return res.status(400).json({msg: "No image uploaded"});
        };
        await Product.findOneAndUpdate({_id: req.params.id}, {
            title: title.toLowerCase(), price, 
            description, content, images, category
        });
        res.json({msg: "Updated the Product!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

export const DeleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({msg: "Deleted the Product!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};

// export const indexHome = async (req, res, next) => {
//     await res.json({ api: "MERN Shop!" });
// };



