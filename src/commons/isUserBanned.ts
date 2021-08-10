/*
*/
import BanClass from '../models/Bans';

export default async function wasUserBanned(userid :string) :Promise<any> {
    const result = await BanClass.findBannedUser(userid);
    return result;
}
