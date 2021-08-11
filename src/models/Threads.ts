/*
*/
import Mongoose from 'mongoose';
import { Thread, Creator, TDescription, TReplies } from './interface';

class ThreadClass implements Thread {
    private static ThreadSchema = new Mongoose.Schema<Thread>({
        creator: {
            username:   { type: String, required: true },
            avatar:     { type: Number, required: true },
            uid:        { type: String, required: true }
        },
        thread: {
            title:      { type: String, required: true, maxLength: 64 },
            text:       { type: String, required: true, maxLength: 240 },
            date:       { type: Number }
        },
        replies: [
            {
                username:   { type: String, required: true },
                userid:     { type: String, required: true },
                avatar:     { type: Number, required: true },
                _token:     { type: String, required: true },
                text:       { type: String, required: true, maxLength: 240 },
                isAdmin:    { type: Boolean, require: true },
                time:       { type: Number },
            }
        ],
        _token:        { type: String },
    });
    private static model = Mongoose.model('threads', ThreadClass.ThreadSchema);

    public mymodel     :Mongoose.Model<Thread> | any;
    public creator     :Creator;
    public thread      :TDescription;
    public replies?    :Array<TReplies>;
    _id                :string;
    _token             :string;

    constructor(props :Thread | any) {
        this.creator    = props.creator;
        this.thread     = {
            ...props.thread, date: Date.now()
        }
        this.replies = props.replies;
        this._token  = props._token;
        this.mymodel = new ThreadClass.model({
            creator:    { ...this.creator },
            thread:     { ...this.thread },
            replies:    this.replies,
            _token:     this._token
        });
        this._id        = this.mymodel._id;
    }

    public async save() {
        return await this.mymodel.save();
    }

    static async findAll() :Promise<Array<Thread>> {
        return await ThreadClass.model.find();
    }

    static async findThread(threadid :string) :Promise<any> {
        return await ThreadClass.model.findOne({ _id: threadid}, (err: any, obj :any) => {
            return obj;
        });
    }

    static async deleteAll() :Promise<any> {
        return await ThreadClass.model.remove();
    }

    static async deleteThread(threadid :string) :Promise<any> {
        return await ThreadClass.model.deleteOne({_id: threadid},
            undefined,
            (err :Mongoose.CallbackError) => {
                if(!err)
                    return { message: "deleted" };
                return err;
        });
    }

    static async makeReply(threadid :string, username :string, userid :any,
                             avatar :number, _token: any, text :string, isAdmin :boolean) :Promise<any> {
        const currentThread = await ThreadClass.findThread(threadid);
    //check if the thread exist
        if(!currentThread)
           return { err: "Thread does not exist" }

        return await ThreadClass.model.updateOne({ _id: threadid}, {
            $set: {
                replies: [
                    ...currentThread.replies,
                    { username, userid, avatar, _token, text, time: Date.now(), isAdmin: isAdmin }
                ]
            }
            }, undefined,
            (err :Mongoose.CallbackError, obj :any) => {
                return obj;
        });
    }

    static async deleteReply(threadid :string, commentId :string ) {
        const currentThread :Thread = await ThreadClass.findThread(threadid);
        const newReplies    :any = currentThread.replies?.filter((value :TReplies) => value._id != commentId );
        return await ThreadClass.model.updateOne({ _id: threadid}, {
            $set: {
                replies: newReplies
            }
            }, undefined,
            (err :Mongoose.CallbackError, obj :any) => {
                return obj;
        });
    }

    static isValidThread(props :any) : boolean {
        if( !props.creator ) return false;
        if( !props.creator.username ) return false;
        if( !props.thread ) return false;
        return true;
    }
}
export default ThreadClass;
