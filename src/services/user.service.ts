import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../models/user.model';
import { AngularFirestore } from 'angularfire2/firestore';

/**
 * @author Ntepp J96n J09l
 */
@Injectable()
export class UserListService {
    
    private userListRef = this.db.list<User>('/users');
    private userListRef2:any;
    userDoc: any;
    constructor(private db: AngularFireDatabase,private fireStore: AngularFirestore) {
        this.userListRef2 = fireStore.collection<User>('users');
    }

    /**
     * returns a reference to the root of the users collection
     */
    getUserList2() {
        return this.userListRef2;
    }

    /**
     * getAUser2 Get a specific user from database
     * @param keyName the name of the key in db (Ex: email)
     * @param keyVal the value (ntjoel19@gooo.fr)
     */
    getAUser2(keyName:string , keyVal:string){
        return this.fireStore.collection<User>('users',ref => ref.where(keyName,'==',keyVal))
    }

    /**
     * function addUser2
     * @param user the user to add into db
     */
    async addUser2(user:User){
        this.userDoc = this.fireStore.doc<any>(`users/${user.email}`);
        return new Promise<any>((resolve, reject) => {
            this.userDoc.set(user).then(snapshot => {
                resolve(snapshot)
            }, err => {
                reject(err);
            })
        })
    }

    /**
     * updateUser2
     * @param user the user we want to update
     */
    async updateUser2(user: User) {
        this.userDoc = this.fireStore.doc<any>(`users/${user.email}`);
        return this.userDoc.update(user)
    }

    /**
     * removeUser2
     * @param user the user we wqnt to remove from db
     */
    async removeUser2(user: User) {
        this.fireStore.doc<any>(`users/${user.email}`).delete();
    }
}