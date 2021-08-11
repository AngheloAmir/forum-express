/*
*/
import Mongoose from 'mongoose';
import { User } from './interface';
import GenerateUID from '../commons/generateUID';

class UserClass {
    private static UserSchema = new Mongoose.Schema<User>({
        username    :{ type: String, required: true, maxLength: 24 },
        avatar      :{ type: Number, required: true, },
        description :{ type: String, required: true, maxLength: 160},
        lastreply   :{ type: Number },
        isAdmin     :{ type: Boolean },
        _token      :{ type: String, required: true, }
    });
    private static model = Mongoose.model('users', UserClass.UserSchema);
    public mymodel     :Mongoose.Model<User> | any;

    constructor(props :User | any) {
        this.mymodel = new  UserClass.model({
            username:       props.username,
            avatar:         props.avatar,
            description:    props.description,
            _token:         GenerateUID(),
            lastreply:      0,
            isAdmin:        false,
        });
    }

    public async save() {
        return await this.mymodel.save();
    }

    static async findAll() :Promise<Array<User>> {
        return await UserClass.model.find();
    }

    static async findUser(userid :string) :Promise<User | undefined> {
        return await UserClass.model.findOne({ _id: userid}, (err: any, obj :any) => {
            if(err) return undefined;
            return obj;
        });
    }

    static async findAdmin() :Promise<User | undefined> {
        return await UserClass.model.findOne({ isAdmin: true}, (err: any, obj :any) => {
            if(err) return undefined;
            return obj;
        });
    }

    static async findUserByToken(usertoken :string) :Promise<User | undefined> {
        return await UserClass.model.findOne({ _token: usertoken}, (err: any, obj :any) => {
            if(err) return undefined;
            return obj;
        });
    }

    static async updateUser(theuser :User) {
        return await UserClass.model.updateOne({ _id: theuser._id}, {
            $set: {
                username:       theuser.username,
                avatar:         theuser.avatar,
                description:    theuser.description
            }}, undefined,
            (err :Mongoose.CallbackError, obj :any) => {
                return obj;
        });
    }

    static async theUserMakesReply(usertoken :string) {
        return await UserClass.model.updateOne({ _token: usertoken}, {
            $set: {
                lastreply: Date.now()
            }}, undefined,
            (err :Mongoose.CallbackError, obj :any) => {
                return obj;
        });
    }

    static async deleteAll() :Promise<any> {
        return await UserClass.model.remove();
    }

    static isValidUser(props :any) : boolean {
        if( !props.username ) return false;
        if( !props.avatar ) return false;
        if( !props.description ) return false;
        return true;
    }
}
export default UserClass; 
