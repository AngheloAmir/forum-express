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
class BanClass {
    constructor(userid) {
        this.userid = userid;
        this.mymodel = new BanClass.model({
            userid: this.userid
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mymodel.save();
        });
    }
    /*===============================================================================================
        ******************************** STATIC FUNCTIONS *******************************************
    =================================================================================================*/
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BanClass.model.find();
        });
    }
    static findBannedUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BanClass.model.findOne({ userid: userid }, (err, obj) => {
                return obj;
            });
        });
    }
    static unBanUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BanClass.model.remove({ userid: userid }, (err) => {
                if (!err)
                    return { message: 'User was successfully unbanned' };
                else
                    return err;
            });
        });
    }
    static deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BanClass.model.remove();
        });
    }
}
BanClass.BanSchema = new mongoose_1.default.Schema({
    userid: { type: String, required: true, },
});
BanClass.model = mongoose_1.default.model('bans', BanClass.BanSchema);
exports.default = BanClass;
