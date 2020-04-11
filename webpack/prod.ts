import merge from "webpack-merge";
import { config } from "./common";

export default merge(config, {
    mode: "production",
});
