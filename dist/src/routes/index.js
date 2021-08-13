"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    The index route that define the actual route
    //eslint-disable-next-line @typescript-eslint/require-await
*/
const express_1 = require("express");
const router = express_1.Router();
const thread_1 = require("./thread");
const user_1 = require("./user");
const threadadmin_1 = require("./threadadmin");
router.get('/api/thread', thread_1.getAllThreads);
router.post('/api/thread/add', thread_1.addThread);
router.post('/api/thread/delete', thread_1.deleteThread);
router.post('/api/thread/reply', thread_1.makeReply);
router.post('/api/thread/deletereply', thread_1.deleteReply);
router.post('/api/user/adduser', user_1.addUser);
router.post('/api/user/updateuser', user_1.updateUser);
router.post('/api/user/viewUser', user_1.getUserInfo);
//router.post('/api/thread/admin/clearForum',     clearForum);
//router.post('/api/admin/deleteAllUser',         deleteAllUser);
router.post('/api/thread/admin/login/', threadadmin_1.adminLogin);
router.post('/api/thread/admin/reply/', threadadmin_1.AdminMakeReply);
router.post('/api/thread/admin/removeThread', threadadmin_1.deleteAThread);
router.post('/api/thread/admin/removereply', threadadmin_1.deleteAReplyAdmin);
router.post('/api/thread/admin/getAllThread', threadadmin_1.getAllThreadsWithToken);
router.post('/api/admin/getAllUser', threadadmin_1.getAllUser);
router.post('/api/admin/banUser', threadadmin_1.banUser); //It can ban or unbanned a user
router.post('/api/admin/getAllBannedUser', threadadmin_1.getAllBannedUsers);
router.post('/api/admin/removeAllBan', threadadmin_1.removeAllBans);
exports.default = router;
