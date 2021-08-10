/*
    Handle the thread request API
    //eslint-disable-next-line
    //eslint-disable-next-line @typescript-eslint/require-await
*/

import { Request, Response } from 'express';
import ThreadClass from '../models/Threads';
import { Thread, TReplies } from '../models/interface';
import StatusCodes from 'http-status-codes';
import isSpamming from '../commons/isUserSpamming';
import wasUserBanned from '../commons/isUserBanned';

const { BAD_REQUEST, FORBIDDEN, NOT_FOUND } = StatusCodes;

//return all threads, hide the token
export async function getAllThreads(req :Request, res :Response) {
    try {
        const result = await ThreadClass.findAll();
        const hidetoken = result.map((value :Thread) => {
            const replies = value.replies?.map((rep :TReplies) => {
                return {
                    username    :rep.username,
                    avatar      :rep.avatar,
                    time        :rep.time,
                    text        :rep.text,
                    _id         :rep._id
                }
            });
            return {
                creator:    value.creator,
                thread:     value.thread,
                replies:    replies
            }
        });
        res.json(hidetoken);
    } catch(err) {
        res.json({err: err});
    }
}

export async function addThread(req :Request, res :Response) {
    if( !ThreadClass.isValidThread(req.body) )
        return res.status(BAD_REQUEST).json({err: "Insufficient thread information"});
    const isBanned = await wasUserBanned(req.body.creator.uid);
    if( isBanned )
        return res.status(FORBIDDEN).json({err: "The user was banned"});

    const spam = await isSpamming(req.body._token)
    if( spam )
        return res.status(BAD_REQUEST).json({ err: spam.err });

    try {
        const newThread = new ThreadClass(req.body);
        const result = await newThread.save();
        res.json(result);
    }
    catch(err) {
        res.json({err: err});
    }
}

export async function deleteThread(req :Request, res :Response) {
    if( !req.body.threadid || !req.body.usertoken )
        return res.status(BAD_REQUEST).json({err: "Insufficient thread delete request"});
    try {
        //check if the user owned the thread
        const athread :Thread = await ThreadClass.findThread(req.body.threadid);
        if( !athread )
            res.status(FORBIDDEN).json({err: "Thread does not exist"});
        else if( athread._token == req.body.usertoken ) {
            const result = await ThreadClass.deleteThread(req.body.threadid);
            res.json(result);
        }
        else
            res.status(FORBIDDEN).json({err: "User does not own the thread"});
    } 
    catch(err) {
        res.json({err: err});
    }
}

export async function makeReply(req :Request, res :Response) {
    if( !req.body.threadid || !req.body._token || !req.body.username || 
        !req.body.avatar   || !req.body.text   || !req.body.userid )
        return res.status(BAD_REQUEST).json({err: "Insufficient comment request"});
    const isBanned = await wasUserBanned(req.body.userid);
    if( isBanned )
        return res.status(FORBIDDEN).json({err: "The user was banned"});

    const spam = await isSpamming(req.body._token)
    if( spam )
        return res.status(BAD_REQUEST).json({ err: spam.err });

    try {
        const result = await ThreadClass.makeReply(
            req.body.threadid, req.body.username, req.body.userid, req.body.avatar, req.body._token, req.body.text );
        res.json(result);
    }
    catch(err) {
        res.json({err: err});
    }   
}

export async function deleteReply(req :Request, res :Response) {
    if(!req.body.threadid || !req.body.commentid || !req.body._token )
        return res.status(BAD_REQUEST).json({err: "Insufficient delete comment request"});
    
    try {
        //check if this is a user comment
        const athread:Thread = await ThreadClass.findThread(req.body.threadid);
        if(!athread) return res.json({err: "Thread not found"});

        let thecomment :TReplies | any = undefined;
        athread.replies?.forEach((value :TReplies) => {
            if(value && value._id == req.body.commentid) 
                thecomment = value
        });
        if(thecomment) {
            if(thecomment._token == req.body._token) {
                const response = await ThreadClass.deleteReply(req.body.threadid, req.body.commentid);
                res.json(response);
            }
            else
                res.status(FORBIDDEN).json({err: "User does not own the comment"});
        }
        else
            res.status(NOT_FOUND).json({err: "Comment id not found"});
    }
    catch(err) {
        res.json({err: err});
    }
}
