/*   
    //eslint-disable-next-line
    //eslint-disable-next-line @typescript-eslint/require-await
*/

import { Request, Response } from 'express';
import UserClass from '../models/Users';
import StatusCodes from 'http-status-codes';
const { BAD_REQUEST, FORBIDDEN } = StatusCodes;

export async function getUserInfo(req :Request, res :Response) {
    if(!req.body.userid)
        return res.status(BAD_REQUEST).json({err: "Missing user information"});
    const auser = await UserClass.findUser(req.body.userid);
    if(!auser)
        return res.status(BAD_REQUEST).json({err: "User not found"});
    const hideToken = {
        username:       auser.username,
        avatar:         auser.avatar,
        description:    auser.description,
    };
    res.json(hideToken);
}

export async function addUser(req :Request, res :Response) {
    if( !UserClass.isValidUser(req.body) )
        return res.status(BAD_REQUEST).json({err: "Insufficient user information"});
    try {
        const newUser = new UserClass(req.body);
        const result = await newUser.save();
        res.json(result);
    }
    catch(err) {
        res.json({err: err});
    }
}

export async function updateUser(req :Request, res :Response) {
    if( !UserClass.isValidUser(req.body) )
        return res.status(BAD_REQUEST).json({message: "Insufficient user information"});
    try {
        const theUser = await UserClass.findUser(req.body._id);
        if(!theUser)
            return res.status(BAD_REQUEST).json({message: "User not found"});
        if(theUser._token != req.body._token)
            return res.status(FORBIDDEN).json({message: "User do not own the account"});
        const result = await UserClass.updateUser(req.body);
        res.json(result);
    }
    catch(err) {
        res.json({message: err});
    }
}
