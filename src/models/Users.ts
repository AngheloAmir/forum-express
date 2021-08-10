/*
*/
import Mongoose from 'mongoose';
import { User } from './interface';
import GenerateUID from '../commons/generateUID';

class UserClass implements User {
    private static UserSchema = new Mongoose.Schema<User>({
        username    :{ type: String, required: true, },
        avatar      :{ type: String, required: true, },
        description :{ type: String, required: true, },
        lastreply   :{ type: Number },
        _token      :{ type: String, required: true, },

    });
    private static model = Mongoose.model('users', UserClass.UserSchema);

    public mymodel     :Mongoose.Model<User> | any;
    public username    :string;
    public avatar      :number;
    public description :string;
    public lastreply   :number;
    public _id         :string;
    public _token      :string;

    constructor(props :User | any) {
        this.username = props.username;
        this.avatar   = props.avatar;
        this.description = props.description;
        this.mymodel = new  UserClass.model({
            username:       this.username,
            avatar:         this.avatar,
            description:    this.description,
            _token:         GenerateUID(),
            lastreply:      0
        });
        this.lastreply  = 0;
        this._id        = this.mymodel._id;
        this._token     = this.mymodel._token;
    }

    public async save() {
        return await this.mymodel.save();
    }

    static async findAll() :Promise<Array<User>> {
        return await UserClass.model.find();
    }

    static async findUser(userid :string) :Promise<any> {
        return await UserClass.model.findOne({ _id: userid}, (err: any, obj :any) => {
            return obj;
        });
    }

    static async findUserByToken(usertoken :string) :Promise<any> {
        return await UserClass.model.findOne({ _token: usertoken}, (err: any, obj :any) => {
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
