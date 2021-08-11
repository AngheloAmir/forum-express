/*
    The index route that define the actual route
    //eslint-disable-next-line @typescript-eslint/require-await
*/
import { Router } from 'express';
const router = Router();

import { getAllThreads, addThread, deleteThread, makeReply, deleteReply } from './thread';
import { addUser,updateUser, getUserInfo } from './user';
import { getAllUser, deleteAThread, deleteAReplyAdmin,
         getAllThreadsWithToken, banUser, adminLogin,
         getAllBannedUsers, removeAllBans, AdminMakeReply } from './threadadmin';

router.get('/api/thread',           getAllThreads);
router.post('/api/thread/add',      addThread);
router.post('/api/thread/delete',   deleteThread);
router.post('/api/thread/reply',    makeReply);
router.post('/api/thread/deletereply', deleteReply);

router.post('/api/user/adduser',    addUser );
router.post('/api/user/updateuser', updateUser );
router.post('/api/user/viewUser',   getUserInfo);

//router.post('/api/thread/admin/clearForum',     clearForum);
//router.post('/api/admin/deleteAllUser',         deleteAllUser);
router.post('/api/thread/admin/login/',         adminLogin);
router.post('/api/thread/admin/reply/',         AdminMakeReply);
router.post('/api/thread/admin/removeThread',   deleteAThread);
router.post('/api/thread/admin/removereply',    deleteAReplyAdmin);
router.post('/api/thread/admin/getAllThread',   getAllThreadsWithToken);
router.post('/api/admin/getAllUser',            getAllUser);
router.post('/api/admin/banUser',               banUser); //It can ban or unbanned a user
router.post('/api/admin/getAllBannedUser',      getAllBannedUsers);
router.post('/api/admin/removeAllBan',          removeAllBans);

export default router;
