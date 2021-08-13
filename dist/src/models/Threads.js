"use strict";
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
/*
*/
const mongoose_1 = __importDefault(require("mongoose"));
class ThreadClass {
    constructor(props) {
        this.creator = props.creator;
        this.thread = Object.assign(Object.assign({}, props.thread), { date: Date.now() });
        this.replies = props.replies;
        this._token = props._token;
        this.mymodel = new ThreadClass.model({
            creator: Object.assign({}, this.creator),
            thread: Object.assign({}, this.thread),
            replies: this.replies,
            _token: this._token
        });
        this._id = this.mymodel._id;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mymodel.save();
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ThreadClass.model.find();
        });
    }
    static findThread(threadid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ThreadClass.model.findOne({ _id: threadid }, (err, obj) => {
                return obj;
            });
        });
    }
    static deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ThreadClass.model.remove();
        });
    }
    static deleteThread(threadid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ThreadClass.model.deleteOne({ _id: threadid }, undefined, (err) => {
                if (!err)
                    return { message: "deleted" };
                return err;
            });
        });
    }
    static makeReply(threadid, username, userid, avatar, _token, text, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentThread = yield ThreadClass.findThread(threadid);
            //check if the thread exist
            if (!currentThread)
                return { err: "Thread does not exist" };
            return yield ThreadClass.model.updateOne({ _id: threadid }, {
                $set: {
                    replies: [
                        ...currentThread.replies,
                        { username, userid, avatar, _token, text, time: Date.now(), isAdmin: isAdmin }
                    ]
                }
            }, undefined, (err, obj) => {
                return obj;
            });
        });
    }
    static deleteReply(threadid, commentId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentThread = yield ThreadClass.findThread(threadid);
            const newReplies = (_a = currentThread.replies) === null || _a === void 0 ? void 0 : _a.filter((value) => value._id != commentId);
            return yield ThreadClass.model.updateOne({ _id: threadid }, {
                $set: {
                    replies: newReplies
                }
            }, undefined, (err, obj) => {
                return obj;
            });
        });
    }
    static isValidThread(props) {
        if (!props.creator)
            return false;
        if (!props.creator.username)
            return false;
        if (!props.thread)
            return false;
        return true;
    }
}
ThreadClass.ThreadSchema = new mongoose_1.default.Schema({
    creator: {
        username: { type: String, required: true },
        avatar: { type: Number, required: true },
        uid: { type: String, required: true }
    },
    thread: {
        title: { type: String, required: true, maxLength: 64 },
        text: { type: String, required: true, maxLength: 240 },
        date: { type: Number }
    },
    replies: [
        {
            username: { type: String, required: true },
            userid: { type: String, required: true },
            avatar: { type: Number, required: true },
            _token: { type: String, required: true },
            text: { type: String, required: true, maxLength: 240 },
            isAdmin: { type: Boolean, require: true },
            time: { type: Number },
        }
    ],
    _token: { type: String },
});
ThreadClass.model = mongoose_1.default.model('threads', ThreadClass.ThreadSchema);
exports.default = ThreadClass;
