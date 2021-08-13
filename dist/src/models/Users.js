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
const generateUID_1 = __importDefault(require("../commons/generateUID"));
class UserClass {
    constructor(props) {
        this.mymodel = new UserClass.model({
            username: props.username,
            avatar: props.avatar,
            description: props.description,
            _token: generateUID_1.default(),
            lastreply: 0,
            isAdmin: false,
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mymodel.save();
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.find();
        });
    }
    static findUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.findOne({ _id: userid }, (err, obj) => {
                if (err)
                    return undefined;
                return obj;
            });
        });
    }
    static findAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.findOne({ isAdmin: true }, (err, obj) => {
                if (err)
                    return undefined;
                return obj;
            });
        });
    }
    static findUserByToken(usertoken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.findOne({ _token: usertoken }, (err, obj) => {
                if (err)
                    return undefined;
                return obj;
            });
        });
    }
    static updateUser(theuser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.updateOne({ _id: theuser._id }, {
                $set: {
                    username: theuser.username,
                    avatar: theuser.avatar,
                    description: theuser.description
                }
            }, undefined, (err, obj) => {
                return obj;
            });
        });
    }
    static theUserMakesReply(usertoken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.updateOne({ _token: usertoken }, {
                $set: {
                    lastreply: Date.now()
                }
            }, undefined, (err, obj) => {
                return obj;
            });
        });
    }
    static deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserClass.model.remove();
        });
    }
    static isValidUser(props) {
        if (!props.username)
            return false;
        if (!props.avatar)
            return false;
        if (!props.description)
            return false;
        return true;
    }
}
UserClass.UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, maxLength: 24 },
    avatar: { type: Number, required: true, },
    description: { type: String, required: true, maxLength: 160 },
    lastreply: { type: Number },
    isAdmin: { type: Boolean },
    _token: { type: String, required: true, }
});
UserClass.model = mongoose_1.default.model('users', UserClass.UserSchema);
exports.default = UserClass;
