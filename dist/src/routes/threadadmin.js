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
exports.deleteAReplyAdmin = exports.AdminMakeReply = exports.removeAllBans = exports.getAllBannedUsers = exports.banUser = exports.getAllUser = exports.deleteAThread = exports.getAllThreadsWithToken = exports.adminLogin = void 0;
const Threads_1 = __importDefault(require("../models/Threads"));
const Users_1 = __importDefault(require("../models/Users"));
const Bans_1 = __importDefault(require("../models/Bans"));
const Admin_1 = __importDefault(require("../models/Admin"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { FORBIDDEN, BAD_REQUEST } = http_status_codes_1.default;
//#############################################################################################
let adminAccount = undefined;
//#############################################################################################
function verifyPassword(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.password) {
            const isLegit = yield Admin_1.default.isLegitAdmin(req.body.password);
            if (!isLegit)
                throw new Error('Access Denied');
            return true;
        }
        throw new Error('Access Denied');
    });
}
//#############################################################################################
function adminLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.username || !req.body.password)
            return res.status(BAD_REQUEST).json({ err: "Insufficient admin credentials" });
        try {
            const wasRegisteredAdmin = yield Admin_1.default.isVerified(req.body.username, req.body.password);
            if (!wasRegisteredAdmin.err)
                return res.json({ _token: wasRegisteredAdmin._token });
            res.status(FORBIDDEN).json({ err: 'access denied' });
        }
        catch (err) {
            res.status(FORBIDDEN).json({ err: 'access denied' });
        }
    });
}
exports.adminLogin = adminLogin;
//#############################################################################################
function getAllThreadsWithToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            const result = yield Threads_1.default.findAll();
            res.json(result);
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.getAllThreadsWithToken = getAllThreadsWithToken;
//#############################################################################################
function deleteAThread(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            if (!req.body.threadid)
                throw new Error('Insufficient thread id');
            const result = yield Threads_1.default.deleteThread(req.body.threadid);
            res.json(result);
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.deleteAThread = deleteAThread;
//#############################################################################################
function getAllUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            const result = yield Users_1.default.findAll();
            res.json(result);
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.getAllUser = getAllUser;
//#############################################################################################
function banUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            if (!req.body._id)
                throw new Error('Missing id to ban user');
            const isUserWasBanned = yield Bans_1.default.findBannedUser(req.body._id);
            if (isUserWasBanned) {
                Bans_1.default.unBanUser(req.body._id);
                return res.json({ message: "User was unbanned" });
            }
            else {
                const ban = new Bans_1.default(req.body._id);
                const result = yield ban.save();
                res.json(result);
            }
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.banUser = banUser;
//#############################################################################################
function getAllBannedUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            const result = yield Bans_1.default.findAll();
            res.json(result);
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.getAllBannedUsers = getAllBannedUsers;
//#############################################################################################
function removeAllBans(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            const result = yield Bans_1.default.deleteAll();
            res.json(result);
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.removeAllBans = removeAllBans;
//#############################################################################################
function AdminMakeReply(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            if (!req.body.threadid || !req.body.text)
                throw new Error('Missing thread id and body text');
            if (adminAccount == undefined)
                adminAccount = yield Users_1.default.findAdmin();
            if (adminAccount) {
                const result = yield Threads_1.default.makeReply(req.body.threadid, adminAccount.username, adminAccount._id, adminAccount.avatar, adminAccount._token, req.body.text, true);
                if (result.err)
                    throw new Error(result.err);
                res.json(result);
            }
            else
                throw new Error('Admin account does not exist');
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.AdminMakeReply = AdminMakeReply;
//#############################################################################################
function deleteAReplyAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyPassword(req);
            if (!req.body.threadid || !req.body.commentid || !req.body._token)
                throw new Error('Insufficient delete comment request');
            const response = yield Threads_1.default.deleteReply(req.body.threadid, req.body.commentid);
            res.json(response);
        }
        catch (err) {
            res.status(BAD_REQUEST).json({ err: err.message });
        }
    });
}
exports.deleteAReplyAdmin = deleteAReplyAdmin;
/*export async function clearForum(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    try {
        const result = await ThreadClass.deleteAll();
        res.json(result);
    } catch(err) {
        res.json({err: err});
    }
}*/
/*export async function deleteAllUser(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    try {
        const result = await UserClass.deleteAll();
        res.json(result);
    } catch(err) {
        res.json({err: err});
    }
}*/
