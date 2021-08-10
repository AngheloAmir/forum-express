/*
*/
import Mongoose from 'mongoose';

class BanClass {
    private static BanSchema = new Mongoose.Schema ({
        userid    :{ type: String, required: true, },
    });
    private static model = Mongoose.model('bans', BanClass.BanSchema);
    public mymodel :Mongoose.Model<string> | any;
    public userid :string;

    constructor(userid :string) {
        this.userid = userid
        this.mymodel = new BanClass.model({
            userid: this.userid
        });
    }

    public async save() {
        return await this.mymodel.save();
    }

/*===============================================================================================
    ******************************** STATIC FUNCTIONS *******************************************
=================================================================================================*/
    static async findAll() :Promise<Array<any>> {
        return await BanClass.model.find();
    }

    static async findBannedUser(userid :string) :Promise<any> {
        return await BanClass.model.findOne({ userid: userid}, (err: any, obj :any) => {
            return obj;
        });
    }

    static async unBanUser(userid :string) {
        return await BanClass.model.remove ({userid: userid}, 
            (err :Mongoose.CallbackError) => {
                if(!err)
                    return {message: 'User was successfully unbanned' }
                else
                    return err;
        });
    }

    static async deleteAll() :Promise<any> {
        return await BanClass.model.remove();
    }
}
export default BanClass;
