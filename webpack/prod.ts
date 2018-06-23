import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import merge from "webpack-merge";
import { config } from "./common";

export default merge(config, {
    mode: "production",
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
});
