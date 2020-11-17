import jwt from "jsonwebtoken";

export const Auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(400).json({msg: "Invalid Auth"});
        };
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, 
        (err, user) => {
            if (err) {
                return res.status(400).json({msg: "Invalid Auth"});
            };
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({msg: error.message});
        next(error);
    }
};


