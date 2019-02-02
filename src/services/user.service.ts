import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../models/user.model';


@Injectable()
export class UserListService {
    
    private userListRef = this.db.list<User>('/users');
    private userListRef2 = this.db.list<User>('users');
    constructor(private db: AngularFireDatabase) {
       
    }

    getUserList() {
        return this.userListRef;
    }

    getUserList2() {
        return this.userListRef2;
    }

    getAnUser(keyName:string , keyVal:string){
        return this.db.list<User>('/users',ref => ref.orderByChild(keyName).equalTo(keyVal))
    }

    addUser(user: User) {
        let key = this.userListRef.push(user).key;
        user.key = key;
        return new Promise<any>((resolve, reject) => {
            this.updateUser(user).then(snapshot => {
                resolve(snapshot)
            }, err => {
                reject(err);
            })
        })
    }

    async updateUser(user: User) {
        return this.userListRef.update(user.key,user)
    }

    removeUser(user: User) {
        return this.userListRef.remove(user.key);
    }
}