"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const app = express_1.default();
const routes_1 = __importDefault(require("./routes"));
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
//import helmet from 'helmet';
//if (process.env.NODE_ENV === 'production') {
//    app.use(helmet()); 
//}
app.use('/', routes_1.default);
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { BAD_REQUEST } = http_status_codes_1.default;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    res.status(BAD_REQUEST);
    return res.json({
        error: err.message,
    });
});
//connect to database
const mongoose_1 = __importDefault(require("mongoose"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const logger = new jet_logger_1.default();
mongoose_1.default.connect('' + process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => logger.info('Connection to database successfull'));
const db = mongoose_1.default.connection;
db.on('error', (err) => logger.err(`Error connecting to database: ` + err));
/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const viewsDir = path_1.default.join(__dirname, 'views');
const staticDir = path_1.default.join(__dirname, 'public');
app.set('views', viewsDir);
app.use(express_1.default.static(staticDir));
//do note that the address is made to make a little harder for anyone to find out the
//site address of the admin panel. The link should not be given.
app.get('/admin/panel/owo', (req, res) => {
    res.sendFile('/OwOAdmin/adminindex.html', { root: viewsDir });
});
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: viewsDir });
});
exports.default = app;
