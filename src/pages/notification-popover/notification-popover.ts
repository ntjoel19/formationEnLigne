import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserListService } from '../../services/user.service';
import { User } from '../../provider/user';
import {Observable} from 'rxjs';
import { User as userModel } from '../../models/user.model';
import { Badge } from '@ionic-native/badge';

/**
 * Generated class for the NotificationPopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-popover',
  templateUrl: 'notification-popover.html',
})
export class NotificationPopoverPage {
  notification : Array<any>;
  numberOfNotifications: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService:UserListService,
    public badge:Badge,
    public user:User) {
    this.user.getNotification().then(notification =>{
      this.notification = notification;
      if(notification !== null){
        this.numberOfNotifications = this.notification.length;
      }
    })
    
    this.user.getUsermail().then(email => {
      var list:Observable<userModel[]> = this.userService.getAnUser('email',email).valueChanges();
      
      list.forEach(next=>{
        next.map(u=>{
          //console.log(u.notification)
          this.notification = u.notification;
          if(u.notification !== undefined){
            this.numberOfNotifications = this.notification.length;
          }
        })
      })
    })
  }

  public seen(item,i){
    this.user.getUsermail().then(email => {
      var list:Observable<userModel[]> = this.userService.getAnUser('email',email).valueChanges(['child_added' , 'child_removed'  , 'child_moved']);
      
      list.forEach(next=>{
        next.map(u=>{
          let i=0
          while(u.notification[i].date !== item.date) i++;
          u.notification.splice(i,1)
          this.notification = u.notification;
          this.userService.updateUser(u);
          this.badge.decrease(1);
        })
      })
    })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NotificationPopoverPage');
  }

}
