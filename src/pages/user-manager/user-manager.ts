import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { UserListService } from '../../services/user.service'
import { User as UserProvider } from '../../provider/user';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/user.model';

/**
 * Generated class for the UserManagerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-manager',
  templateUrl: 'user-manager.html',
})
export class UserManagerPage {
  list: Array<any>;
  userList: Observable<User[]>;
  open:boolean[] = [];
  userListOffline: any[];
  testOffline: boolean = false;
  off: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public toasCtrl: ToastController, 
    public userService: UserListService, 
    public userProvider: UserProvider,
    public notif: NotificationService,
    public auth: AuthService) {
    this.userList = this.userService.getUserList().valueChanges();
    this.userList.subscribe(list=>{
      this.testOffline = true;
      list.forEach(user=>{
        if(this.off===undefined){
          this.off = [user]
        }else{
          this.off.push(user)
        }
      })
      this.userProvider.setUserList(this.off)
    })
    this.userProvider.getUserList().then(list=>{
      this.userListOffline = list;
    })
    this.list = [{img: 'assets/img/01.png', title: 'La mission', subtitle: '50.4M Etudiants'}, {img: 'assets/img/02.png', title: 'Préparation au STUCO', subtitle: '50.4M Etudiants'}, {img: 'assets/img/03.png', title: 'La nouvelle vie en Christ', subtitle: '50.4M Etudiants'}, {img: 'assets/img/04.png', title: 'Formation de finissants', subtitle: '50.4M Etudiants'}, {img: 'assets/img/01.png', title: 'Autre formation', subtitle: '50.4M Apprenants'}]
    for(let i=0;i<500;i++){
      this.open.push(false);
    }
  }

  moreOptions(i){
    for(let k=0;k<this.open.length;k++)
      if(k!=i)
        this.open[k] = false;
    this.open[i] = !this.open[i];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad UserManagerPage');
  }

  acceptUser(user){
    user.accepted = !user.accepted;
    this.userService.updateUser(user);
    if(user.accepted === true){
      let toast = this.toasCtrl.create({
        message : 'Compte activé!',
        duration: 3000,
        position : 'middle'
      })
      toast.present();
    }else{
      let toast = this.toasCtrl.create({
        message : 'Compte désactivé!',
        duration: 3000,
        position : 'middle'
      })
      toast.present();
    }
  }

  delUser(user){
    let prompt = this.alertCtrl.create({
      title: 'Supprimer ce utilisateur?',
      message : 'Etes vous sure de vouloir supprimer cet utilisateur?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked '+data);
          }
        },
        {
          text: 'Supprimer',
          handler: data => {
            this.userService.removeUser(user).then(ref => {
              let toast = this.toasCtrl.create({
                message : 'Cet utilisateur a été supprimé!',
                duration: 3000,
                position : 'middle'
              })
              toast.present();
              this.auth.remove(user);
            })
          }
        }
      ]
    });
    prompt.present();
    //send a notification
  }

  /**
   * 
   * @param user 
   * @param courseNumber : The index of the course to allow or reject
   * @param operation : O to allow, 1 to reject
   */
  allowCourse(user,courseNumber,operation){
    var activ;
    let cours = user.courses[courseNumber].subtitle
    user.courses[courseNumber].authorisation = (operation === 0);
    if(operation==0){ 
      activ = "autorisée";
    } else{ 
      activ = "refusée"
      user.courses.splice(courseNumber,1);
    }
    //create a notification
    var notification = {
      reason : "Demande d'adhésion au "+cours+" a été "+activ,
      date : new Date().toString(),
      author : ""
    }
    if(user.notification === undefined){
        user.notification = [notification];
    }else{
        user.notification.push(notification);
    }
    this.userService.updateUser(user)
    let toast = this.toasCtrl.create({
      message : 'demande '+activ+'!',
      duration: 3000,
      position : 'middle'
    })
    toast.present();
    
    //send a notification
  }

  userDetails(page,param){
    //console.log(param);
    this.navCtrl.push(page,param);
  }

}
