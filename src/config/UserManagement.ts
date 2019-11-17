import { Logger } from '@overnightjs/logger';
import User from '../types/User';
import { json } from 'express';


class UserManagement {

    private _userTable: { [id: string] : User} = {};
    private static self:UserManagement;

    private constructor(){};

    public static getUserManagement() : UserManagement{
        if(UserManagement.self===undefined){
            UserManagement.self = new UserManagement();
        }
        return UserManagement.self;
    }

    public connectUser(user: User) : void {
        const key : string = user.email;
        Logger.Info("New User: " + user.email + " - " + user.name);
        if(!this.getUser(key))
            UserManagement.self._userTable[key]=user;
        else
            this.getUser(user.email).socket = user.socket;
    }

    public async updateUser(user: User) : Promise<void> {
        let currentUser = this.getUser(user.email);
        if(currentUser.name !== user.name){
            currentUser.name = user.name;
            Logger.Info("Updating: " + user.email + " new name " + user.name);
        }
        if(currentUser.image !== user.image){
            currentUser.image = user.image;
            Logger.Info("Updating: " + user.image + " new name " + user.image);
        }
        if(currentUser.publicKey !== user.publicKey){
            currentUser.publicKey = user.publicKey;
            Logger.Info("Updating: " + user.publicKey + " new name " + user.publicKey);
        }
    }

    public getUser(email: string) : User {
        return UserManagement.self._userTable[email];
    } 

    public getUserNoSocket(email: string) : Object|undefined {
        let usr = {...this.getUser(email)};
        if(usr) {
            delete usr.socket;
            return usr;
        }
        return undefined;
    }

}

export default UserManagement;