import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, PopoverController } from 'ionic-angular';

import { Course } from '../../models/course.model'
import { CourseListService } from '../../services/course.service'
import { UserListService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';
import { App } from 'ionic-angular';

import { User } from '../../provider/user';
import {CourseProvider} from '../../providers/course/course'
import { NotificationPopoverPage } from '../notification-popover/notification-popover';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  //list: Array<any>;
  courseList : Observable<Course[]>;
  offlineCourseList : any[];
  accepted = false; //if the user is already allowed to access courses
  userCourse:any[];
  email;
  numberOfNotifications;
  observeOffline: boolean = false;
  onlineCourseList: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public courseListService: CourseListService,
    public userListService: UserListService,
    public notification: NotificationService,
    public courseProvider: CourseProvider,
    public appCtrl : App,
    public auth: AuthService,
    public events: Events,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public user : User) 
    {
      user.getAccepted().then(val => {
        this.accepted = val;
      })
      this.user.getUsermail().then(email => {
        this.email = email
      })
      this.user.getNotification().then(notifications=>{
        if(notifications !== null) this.numberOfNotifications=notifications.length
      })
      this.user.setCourseDetail(this.userCourse);
      this.courseListService.getCourseList().valueChanges().subscribe(list=>{
        this.observeOffline = true;
        list.forEach(c=>{
          if(this.onlineCourseList === undefined){
            this.onlineCourseList = [c]
          }else{
            this.onlineCourseList.push(c);
          }
        })
        this.courseProvider.setCourseList(this.onlineCourseList)
      })
      this.courseProvider.getCourseList().then(coursList=>{
        this.offlineCourseList = coursList;
        //console.log(this.offlineCourseList)
      })
      
      //after this we will have an array of course where the user has not subscribed
      /*
      this.events.subscribe('user:login',credentials => {
        window.location.reload();
      })*/
      
      ////console.log('object evt: %O', this.courseList)
      
  }
  
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    
  }

  goTo(page,param){
    //console.log(param);
    this.navCtrl.push(page,param);
  }

  showNotification(event){
    let popover = this.popoverCtrl.create(NotificationPopoverPage);
    popover.present({
      ev: event
    });
  }

  enrollToCourse(course){
    this.user.getUsermail().then(email => {
      this.userListService.getAnUser('email',email).valueChanges(['child_added','child_removed']).subscribe(ccuser=>{
        ccuser.map(cuser=>{
          var test = false;
          if(cuser.courses!== undefined){
            for(let j=0;j<cuser.courses.length;j++){
              if(cuser.courses[j].subtitle===course['subtitle']) test = true;
            }
          }

          if(!test){
            //create a notification
            let role = ['Admin','Formateur'];
            for(let i=0;i<role.length;i++)
            {  
              this.userListService.getAnUser('status',role[i]).valueChanges(['child_added','child_removed']).subscribe(adminList=>{
                //console.log(role[i],adminList);
                adminList.map(next=>{
                  if(next.email !== email){
                      var notification = {
                          reason : 'Demande d\'adhésion au '+course.subtitle,
                          date : new Date().toString(),
                          author : email
                      }
                      if(next.notification === undefined){
                          next.notification = [notification];
                      }else{
                          next.notification.push(notification);
                      }
                      this.userListService.updateUser(next);
                  }
                })
              });
                  
            }
            if(cuser.courses !== undefined){
              cuser.courses.push(course);
              this.userListService.updateUser(cuser);
            }else{
              cuser.courses = [course];
              this.userListService.updateUser(cuser);
            }//this.notification.sendNotification(['Admin','Formateur'],'',email,'Demande d\'adhésion au '+course.subtitle)
          }else{
            this.toastCtrl.create({
              message: 'Votre demande d\'adhésion à ce cours a déjà été envoyée. Veuiller patienter svp!',
              duration: 3000,
              position: 'middle'
            }).present();
          }
        })
      });
    });
  }
}