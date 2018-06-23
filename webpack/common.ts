import * as path from "path";
import * as webpack from "webpack";

export const config: webpack.Configuration = {
    target: "node",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "index.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["cache-loader", "ts-loader"],
            },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin(/^vertx$/), // `when` npm uses in non-node mode.
    ],
};
