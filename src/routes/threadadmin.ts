/*
    Handle the thread admin,
    each call must contain password
*/
import { Request, Response } from 'express';
import ThreadClass from '../models/Threads';
import UserClass from '../models/Users';
import BanClass from '../models/Bans';
import AdminClass from '../models/Admin';

import { User } from '../models/interface';
import StatusCodes from 'http-status-codes';
const { FORBIDDEN, BAD_REQUEST } = StatusCodes;

//#############################################################################################
let adminAccount :User | undefined = undefined;

//#############################################################################################
async function verifyPassword(req :Request) :Promise<any> {
    if( req.body.password ) {
        const isLegit = await AdminClass.isLegitAdmin(req.body.password);
        if(!isLegit)
            throw new Error('Access Denied');
        return true;
    }
    throw new Error('Access Denied');
}

//#############################################################################################
export async function adminLogin(req :Request, res :Response) {
    if( !req.body.username || !req.body.password )
        return res.status(BAD_REQUEST).json({err: "Insufficient admin credentials"});
    try {
        const wasRegisteredAdmin = await AdminClass.isVerified( req.body.username, req.body.password );
        if( !wasRegisteredAdmin.err )
            return res.json({ _token: wasRegisteredAdmin._token });
        res.status(FORBIDDEN).json({ err: 'access denied' });
    }
    catch(err) {
        res.status(FORBIDDEN).json({ err: 'access denied' });
    }
}

//#############################################################################################
export async function getAllThreadsWithToken(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        const result = await ThreadClass.findAll();
        res.json(result);
    }
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

//#############################################################################################
export async function deleteAThread(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        if( !req.body.threadid ) throw new Error('Insufficient thread id')
        const result = await ThreadClass.deleteThread(req.body.threadid);
        res.json(result);
    } 
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

//#############################################################################################
export async function getAllUser(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        const result = await UserClass.findAll();
        res.json(result);
    }
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

//#############################################################################################
export async function banUser(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        if(!req.body._id) throw new Error('Missing id to ban user');

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
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

//#############################################################################################
export async function getAllBannedUsers(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        const result = await BanClass.findAll();
        res.json(result);
    }
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

//#############################################################################################
export async function removeAllBans(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        const result = await BanClass.deleteAll();
        res.json(result);
    }
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

//#############################################################################################
export async function AdminMakeReply(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        if(!req.body.threadid || !req.body.text) throw new Error('Missing thread id and body text');
        if(adminAccount == undefined)
            adminAccount = await UserClass.findAdmin();
        
        if(adminAccount) {
            const result = await ThreadClass.makeReply(
                req.body.threadid,
                adminAccount.username,
                adminAccount._id,
                adminAccount.avatar,
                adminAccount._token,
                req.body.text,
                true);
            if(result.err)
                throw new Error(result.err);
            res.json(result);
        }
        else throw new Error('Admin account does not exist');
    }
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }   
}


//#############################################################################################
export async function deleteAReplyAdmin(req :Request, res :Response) {
    try {
        await verifyPassword(req);
        if(!req.body.threadid || !req.body.commentid || !req.body._token )
            throw new Error('Insufficient delete comment request');

        const response = await ThreadClass.deleteReply(req.body.threadid, req.body.commentid);
        res.json(response);
    }
    catch(err) {
        res.status(BAD_REQUEST).json({err: err.message});
    }
}

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
