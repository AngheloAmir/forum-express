/*
*/
import Mongoose from 'mongoose';
import { Admin } from './interface';

class AdminClass {
    private static AdminSchema = new Mongoose.Schema ({
        username :{ type: String, required: true },
        password :{ type: String, required: true },
        _token   :{ type: String, required: true }
    });
    private static model = Mongoose.model('adminusers', AdminClass.AdminSchema);
    private static admins :Array<any> | any = undefined ;

    static async isVerified(username :string, password :string) :Promise<{_token? :string, err? :string}> {
        if(AdminClass.admins === undefined )
            AdminClass.admins = await AdminClass.model.find();
        let adminwas :Admin | undefined;
        AdminClass.admins.map((user :Admin) => {
            if(username == user.username && password == user.password)
                adminwas = user;
        });
        if(adminwas)
            return { _token: adminwas._token, err: undefined };
        return { err: "Error, admin user does not exist" }
    }

    static async isLegitAdmin(token :string ) :Promise<boolean> {
        if(AdminClass.admins === undefined )
            AdminClass.admins = await AdminClass.model.find();
        let isLegit = false;
        AdminClass.admins.map((user :Admin) => {
            if(token == user._token )
                isLegit = true;
        });
        if(isLegit) return true;
        return false;
    }
}
export default AdminClass;
