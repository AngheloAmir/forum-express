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
const Users_1 = __importDefault(require("../models/Users"));
const TIMEBETWEENREPLIES = 1000 * 30;
function isSpamming(usertoken) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_1.default.findUserByToken(usertoken);
        if (!user)
            return { err: "User does not exist in the database" };
        if (user.lastreply && Date.now() < (user.lastreply + TIMEBETWEENREPLIES))
            return { err: `Please wait ${TIMEBETWEENREPLIES / 1000}s to reply again` };
        yield Users_1.default.theUserMakesReply(usertoken);
        return undefined;
    });
}
exports.default = isSpamming;
