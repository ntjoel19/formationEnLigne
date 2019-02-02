import { Injectable } from '@angular/core';
//import { AngularFireDatabase } from 'angularfire2/database';
import { UserListService } from '../services/user.service';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm'

@Injectable()
export class NotificationService {
    
    constructor(
        private userListService:UserListService,
        private push: Push,
        private fcm: FCM
    ){
       
    }

    /**
    * this function sends a notification to selected user
    * @public
    * @method sendNotification
    * @param roles {array} : an array of role of users who will receive the notification
    * @destinator {string} : the email of the single destinator
    * @param author {string} : the author of the notification
    * @param reason {string} : string explaining the event that initiated the notification
    * @return {none}
    **/
    async sendNotification(roles, destinator, author:string, reason){
        let status = roles;
        if(roles!=null){
            for(let i=0;i<status.length;i++)
            {  
                let adminList = this.userListService.getAnUser('status',status[i]).valueChanges(['child_added','child_removed']);
                adminList.forEach(item=>{
                    for(let i=0;i<item.length;i++){
                        if(item[i].email !== author){
                            var notification = {
                                reason : reason,
                                date : new Date().toString().split(" GMT")[0],
                                author : author
                            }
                            if(item[i].notification === undefined){
                                item[i].notification = [notification];
                            }else{
                                item[i].notification.push(notification);
                            }
                            this.userListService.updateUser(item[i]);
                        }  
                    }
                })     
            }
        }else{
            let adminList = this.userListService.getAnUser('email',destinator).valueChanges(['child_added','child_removed']);
            adminList.forEach(item=>{
                if(item[0].email !== author){
                    var notification = {
                        reason : reason,
                        date : new Date().toString().split(" GMT")[0],
                        author : author
                    }
                    if(item[0].notification === undefined){
                        item[0].notification = [notification];
                    }else{
                        item[0].notification.push(notification);
                    }
                    this.userListService.updateUser(item[0]);
                }
            })
        }
    }

    async removeNotification(){
        //to write
    }
}