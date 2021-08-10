/*
    Handle the thread admin,
    each call must contain password
*/
import { Request, Response } from 'express';
import ThreadClass from '../models/Threads';
import UserClass from '../models/Users';
import BanClass from '../models/Bans';

import StatusCodes from 'http-status-codes';
const { FORBIDDEN, BAD_REQUEST } = StatusCodes;

function verifyPassword(req :Request) :boolean {
    //TODO: Check the database if the password match with the admin pass
    if(!req.body.password || req.body.password !== process.env.THREADADMIN_PASS )
        return false;
    return true;
}

function deniedResponse(res :Response) {
    return res.status(FORBIDDEN).json({ err: 'access denied' });
}

//ROUTES=======================================================================
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

export async function deleteAThread(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    if( !req.body.threadid )
        return res.status(BAD_REQUEST).json({err: "Insufficient thread id"});
    try {
        const result = await ThreadClass.deleteThread(req.body.threadid);
        res.json(result);
    } 
    catch(err) {
        res.json({err: err});
    }
}

export async function getAllThreadsWithToken(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    try {
        const result = await ThreadClass.findAll();
        res.json(result);
    } catch(err) {
        res.json({err: err});
    }
}

export async function getAllUser(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    try {
        const result = await UserClass.findAll();
        res.json(result);
    } catch(err) {
        res.json({err: err});
    }
}

export async function banUser(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    if(!req.body._id) return res.status(BAD_REQUEST).json({ err: 'Missing id to ban user' });
    try {
        const isUserWasBanned = await BanClass.findBannedUser(req.body._id);
        if(isUserWasBanned) {
            BanClass.unBanUser(req.body._id)
            return res.json({message: "User was unbanned"});
        }
        else {
            const ban = new BanClass( req.body._id );
            const result = await ban.save();
            res.json(result);
        }
    }
    catch(err) {
        res.json({err: err});
    }
}

export async function getAllBannedUsers(req :Request, res :Response) {
    if(!verifyPassword(req)) return deniedResponse(res);
    try {
        const result = await BanClass.findAll();
        res.json(result);
    }
    catch(err) {
        res.json({err: err});
    }
}

export async function removeAllBans(req :Request, res :Response) {
    try {
        const result = await BanClass.deleteAll();
        res.json(result);
    }
    catch(err) {
        res.json({err: err});
    }
}

export async function deleteAReplyAdmin(req :Request, res :Response) {
    if(!req.body.threadid || !req.body.commentid || !req.body._token )
        return res.status(BAD_REQUEST).json({err: "Insufficient delete comment request"});
    try {
        const response = await ThreadClass.deleteReply(req.body.threadid, req.body.commentid);
        res.json(response);
    }
    catch(err) {
        res.json(err);
    }
}
