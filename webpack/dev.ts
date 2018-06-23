import merge from "webpack-merge";
import { config } from "./common";

export default merge.smart(config, {
    mode: "development",
});
