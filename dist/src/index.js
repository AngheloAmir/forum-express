"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
    https://galavtg.herokuapp.com/
*/
require("../env/startInitEnv");
const Server_1 = __importDefault(require("./Server"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const logger = new jet_logger_1.default();
const port = Number(process.env.PORT || 3000);
Server_1.default.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
