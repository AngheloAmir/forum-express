/*
    A function that check if the user is spamming. A User has a properties named "lastreply"
    that has value of number that set when this function is called.
    This also check if the user exist.
*/
import UserClass from "../models/Users";
const TIMEBETWEENREPLIES :number = 1000*10; 

export default async function isSpamming(usertoken :string) {
    const user :UserClass = await UserClass.findUserByToken(usertoken);
    if( !user ) return { err: "User does not exist in the database" };
    if( Date.now() < ( user.lastreply + TIMEBETWEENREPLIES) )
        return { err: `Please wait ${TIMEBETWEENREPLIES/1000}s to reply again` }

    await UserClass.theUserMakesReply(usertoken);
    return undefined;
}
