const path = require("path");
module.exports = {
    entry: path.resolve(__dirname, "src") + "/index.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "main.js",
        chunkFilename: "[id].js"
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },
    devServer: {
        contentBase: "./dist",
        historyApiFallback: true,
        compress: true,
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|json)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-react",
                            {"useBuiltins": "entry",
                                "targets": {
                                    "browsers": [
                                        "> 0.2%",
                                        "not dead",
                                        "not ie <= 11",
                                        "not op_mini all"
                                    ]
                                }
                            }], "@babel/preset-env"],
                        plugins: [
                            "react-hot-loader/babel",
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-transform-async-to-generator"
                        ]
                    }
                }
            },
            {
                test: /\.(css)$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                loader: require.resolve("url-loader"),
                options: {
                    limit: 10000,
                    name: "[name].[hash:8].[ext]"
                }
            }
        ]
    }
};


