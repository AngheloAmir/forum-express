"use strict";
/*
    Handle the thread request API
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
exports.deleteReply = exports.makeReply = exports.deleteThread = exports.addThread = exports.getAllThreads = void 0;
const Threads_1 = __importDefault(require("../models/Threads"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const isUserSpamming_1 = __importDefault(require("../commons/isUserSpamming"));
const isUserBanned_1 = __importDefault(require("../commons/isUserBanned"));
const { BAD_REQUEST, FORBIDDEN, NOT_FOUND } = http_status_codes_1.default;
//return all threads, hide the token
function getAllThreads(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Threads_1.default.findAll();
            const hidetoken = result.map((value) => {
                var _a;
                const replies = (_a = value.replies) === null || _a === void 0 ? void 0 : _a.map((rep) => {
                    return {
                        username: rep.username,
                        avatar: rep.avatar,
                        time: rep.time,
                        text: rep.text,
                        _id: rep._id
                    };
                });
                return {
                    creator: value.creator,
                    thread: value.thread,
                    replies: replies
                };
            });
            res.json(hidetoken);
        }
        catch (err) {
            res.json({ err: err });
        }
    });
}
exports.getAllThreads = getAllThreads;
function addThread(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Threads_1.default.isValidThread(req.body))
            return res.status(BAD_REQUEST).json({ err: "Insufficient thread information" });
        const isBanned = yield isUserBanned_1.default(req.body.creator.uid);
        if (isBanned)
            return res.status(FORBIDDEN).json({ err: "The user was banned" });
        const spam = yield isUserSpamming_1.default(req.body._token);
        if (spam)
            return res.status(BAD_REQUEST).json({ err: spam.err });
        try {
            const newThread = new Threads_1.default(req.body);
            const result = yield newThread.save();
            res.json(result);
        }
        catch (err) {
            res.json({ err: err });
        }
    });
}
exports.addThread = addThread;
function deleteThread(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.threadid || !req.body.usertoken)
            return res.status(BAD_REQUEST).json({ err: "Insufficient thread delete request" });
        try {
            //check if the user owned the thread
            const athread = yield Threads_1.default.findThread(req.body.threadid);
            if (!athread)
                res.status(FORBIDDEN).json({ err: "Thread does not exist" });
            else if (athread._token == req.body.usertoken) {
                const result = yield Threads_1.default.deleteThread(req.body.threadid);
                res.json(result);
            }
            else
                res.status(FORBIDDEN).json({ err: "User does not own the thread" });
        }
        catch (err) {
            res.json({ err: err });
        }
    });
}
exports.deleteThread = deleteThread;
function makeReply(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.threadid || !req.body._token || !req.body.username ||
            !req.body.avatar || !req.body.text || !req.body.userid)
            return res.status(BAD_REQUEST).json({ err: "Insufficient comment request" });
        const isBanned = yield isUserBanned_1.default(req.body.userid);
        if (isBanned)
            return res.status(FORBIDDEN).json({ err: "The user was banned" });
        const spam = yield isUserSpamming_1.default(req.body._token);
        if (spam)
            return res.status(BAD_REQUEST).json({ err: spam.err });
        try {
            const result = yield Threads_1.default.makeReply(req.body.threadid, req.body.username, req.body.userid, req.body.avatar, req.body._token, req.body.text, false);
            res.json(result);
        }
        catch (err) {
            res.json({ err: err });
        }
    });
}
exports.makeReply = makeReply;
function deleteReply(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.threadid || !req.body.commentid || !req.body._token)
            return res.status(BAD_REQUEST).json({ err: "Insufficient delete comment request" });
        try {
            //check if this is a user comment
            const athread = yield Threads_1.default.findThread(req.body.threadid);
            if (!athread)
                return res.json({ err: "Thread not found" });
            let thecomment = undefined;
            (_a = athread.replies) === null || _a === void 0 ? void 0 : _a.forEach((value) => {
                if (value && value._id == req.body.commentid)
                    thecomment = value;
            });
            if (thecomment) {
                if (thecomment._token == req.body._token) {
                    const response = yield Threads_1.default.deleteReply(req.body.threadid, req.body.commentid);
                    res.json(response);
                }
                else
                    res.status(FORBIDDEN).json({ err: "User does not own the comment" });
            }
            else
                res.status(NOT_FOUND).json({ err: "Comment id not found" });
        }
        catch (err) {
            res.json({ err: err });
        }
    });
}
exports.deleteReply = deleteReply;
