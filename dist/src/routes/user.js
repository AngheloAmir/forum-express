"use strict";
/*
    //eslint-disable-next-line
    //eslint-disable-next-line @typescript-eslint/require-await
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.addUser = exports.getUserInfo = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { BAD_REQUEST, FORBIDDEN } = http_status_codes_1.default;
function getUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.userid)
            return res.status(BAD_REQUEST).json({ err: "Missing user information" });
        const auser = yield Users_1.default.findUser(req.body.userid);
        if (!auser)
            return res.status(BAD_REQUEST).json({ err: "User not found" });
        const hideToken = {
            username: auser.username,
            avatar: auser.avatar,
            description: auser.description,
        };
        res.json(hideToken);
    });
}
exports.getUserInfo = getUserInfo;
function addUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Users_1.default.isValidUser(req.body))
            return res.status(BAD_REQUEST).json({ err: "Insufficient user information" });
        try {
            const newUser = new Users_1.default(req.body);
            const result = yield newUser.save();
            res.json(result);
        }
        catch (err) {
            res.json({ err: err });
        }
    });
}
exports.addUser = addUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Users_1.default.isValidUser(req.body))
            return res.status(BAD_REQUEST).json({ message: "Insufficient user information" });
        try {
            const theUser = yield Users_1.default.findUser(req.body._id);
            if (!theUser)
                return res.status(BAD_REQUEST).json({ message: "User not found" });
            if (theUser._token != req.body._token)
                return res.status(FORBIDDEN).json({ message: "User do not own the account" });
            const result = yield Users_1.default.updateUser(req.body);
            res.json(result);
        }
        catch (err) {
            res.json({ message: err });
        }
    });
}
exports.updateUser = updateUser;
