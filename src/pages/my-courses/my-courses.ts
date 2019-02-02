import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, PopoverController } from 'ionic-angular';

//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Course } from '../../models/course.model'
import { CourseListService } from '../../services/course.service'
import { UserListService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { User as userModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { App } from 'ionic-angular';

import { User } from '../../provider/user';
import { NotificationPopoverPage } from '../notification-popover/notification-popover';

@IonicPage()
@Component({
  selector: 'page-my-courses',
  templateUrl: 'my-courses.html',
})
export class MyCoursesPage {
  //list: Array<any>;
  courseList : Observable<Course[]>;
  userCourseList = [];
  accepted = false; //if the user is already allowed to access courses
  userCourse:any[];
  email;
  numberOfNotifications;
  off:boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public courseListService: CourseListService,
    public userListService: UserListService,
    public notification: NotificationService,
    public appCtrl : App,
    public auth: AuthService,
    public events: Events,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public user : User) 
    {
      //if there is no internet, load information froma lacal storage
      user.getAccepted().then(val => {
        this.accepted = val;
      })
      user.getCourse().then(courseList=>{
        this.userCourse = courseList;
        this.off = false;
      })
      this.user.getNotification().then(notifications=>{
        if(notifications !== null) this.numberOfNotifications=notifications.length
      })
      this.user.setCourseDetail(this.userCourse);

      //if there is internet connection, load informations from server
      this.user.getUsermail().then(email => {
        this.userListService.getAnUser('email',email)
        .valueChanges(['child_added','child_removed'])
        .subscribe(next=>{
          this.off = true
          next.map(u=>{
            this.userCourse = u.courses;
            if(u.notification !== undefined) this.numberOfNotifications=u.notification.length
          })
          this.user.setCourse(this.userCourse)
        })
      })
      
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
    //var curentU; 
    //var i = 0;
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