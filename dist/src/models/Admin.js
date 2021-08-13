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
class AdminClass {
    static isVerified(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AdminClass.admins === undefined)
                AdminClass.admins = yield AdminClass.model.find();
            let adminwas;
            AdminClass.admins.map((user) => {
                if (username == user.username && password == user.password)
                    adminwas = user;
            });
            if (adminwas)
                return { _token: adminwas._token, err: undefined };
            return { err: "Error, admin user does not exist" };
        });
    }
    static isLegitAdmin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AdminClass.admins === undefined)
                AdminClass.admins = yield AdminClass.model.find();
            let isLegit = false;
            AdminClass.admins.map((user) => {
                if (token == user._token)
                    isLegit = true;
            });
            if (isLegit)
                return true;
            return false;
        });
    }
}
AdminClass.AdminSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    _token: { type: String, required: true }
});
AdminClass.model = mongoose_1.default.model('adminusers', AdminClass.AdminSchema);
AdminClass.admins = undefined;
exports.default = AdminClass;
