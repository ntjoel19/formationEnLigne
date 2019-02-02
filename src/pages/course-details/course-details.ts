import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController,  } from 'ionic-angular';

import { Course } from '../../models/course.model'
import { CourseListService } from '../../services/course.service'
import { Observable } from 'rxjs';
//import { App } from 'ionic-angular';

import { User } from '../../provider/user';
import { UserListService } from '../../services/user.service';
import { NotificationPopoverPage } from '../notification-popover/notification-popover';

/**
 * Generated class for the CourseDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-details',
  templateUrl: 'course-details.html',
})
export class CourseDetailsPage {
  headerbg: any;
  darkHeader: any;
  cards: Array<any>;

  courseList : Observable<Course[]>;
  userCourseList = [];
  accepted = false; //if the user is already allowed to access courses
  title;
  teacher;
  postDate;
  numberOfLecons;
  chapter;
  numberOfChapters;
  numberOfNotifications;
  description;
  email;
  course : Course={
    authorisation:false,
    key:"",
    descriptImage:'',
    PostedBy:'',
    title:"",
    subtitle:"",
    description:"",
    teacher:"",
    associateProf:null,
    post_date:"",
    duration:"",
    startDate: "",
    numberOfStudents:0,
    chapter:null,
    
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public popoverCtrl: PopoverController, 
    public renderer: Renderer,
    public courseListService: CourseListService,
    public userListService : UserListService,
    public toastCtrl : ToastController,
    public user : User
  ) {
    //console.log(this.navParams.get('title'));
    this.course.description = this.navParams.get('description');
    this.course.descriptImage = this.navParams.get('descriptImage');
    this.course.authorisation = this.navParams.get('authorisation');
    this.course.chapter = this.navParams.get('chapter');
    this.course.title = this.navParams.get('title');
    this.course.teacher = this.navParams.get('teacher');
    this.course.PostedBy = this.navParams.get('PostedBy');
    this.course.key = this.navParams.get('key')
    this.course.post_date = this.navParams.get('post_date');
    this.course.numberOfStudents = this.navParams.get('numberOfStudents');
    this.course.duration = this.navParams.get('duration')
    this.course.subtitle = this.navParams.get('subtitle');

    this.user.getUsermail().then(email => {
      this.email = email
    })
    this.user.getNotification().then(notifications=>{
      if(notifications !== null) this.numberOfNotifications=notifications.length
    })
  }

   //scroll header function
  ngAfterViewInit() {
    var lengthHeader=document.getElementsByClassName("list-header").length -1;
    this.headerbg = document.getElementsByClassName("list-header")[lengthHeader];
  }
  scrollingFun(ev){
    ev.domWrite(() => {
        this.updateHeader(ev);
    }); 
  }
  updateHeader(ev) { 
    if (ev.scrollTop > 0) {
      this.darkHeader = ev.scrollTop / 125;
      this.renderer.setElementClass(this.headerbg, 'sub-header', true);  
    }else  this.renderer.setElementClass(this.headerbg, 'sub-header', false);

    this.renderer.setElementStyle(this.headerbg, 'background', 'rgba(0,172,237,' + this.darkHeader +')');
  }

  goTo(page,param){
    //console.log(param)
    this.navCtrl.push(page,param);
  }

  enrollToCourse(){
    var cours = this.course;
    //var curentU; 
    //var i = 0;
    this.user.getUsermail().then(email => {
      if(email !== undefined){
        this.userListService.getAnUser('email',email).valueChanges(['child_added','child_removed']).subscribe(ccuser=>{
          ccuser.map(cuser=>{
            var test = false;
            if(cuser.courses!== undefined){
              for(let j=0;j<cuser.courses.length;j++){
                if(cuser.courses[j].subtitle===cours['subtitle']) test = true;
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
                            reason : 'Demande d\'adhésion au '+cours.subtitle,
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
                cuser.courses.push(cours);
                this.userListService.updateUser(cuser);
              }else{
                cuser.courses = [cours];
                this.userListService.updateUser(cuser);
              }//this.notification.sendNotification(['Admin','Formateur'],'',email,'Demande d\'adhésion au '+course.subtitle)
              if(cours.authorisation){
                this.toastCtrl.create({
                  message: 'Vous venez d\'adhérer à ce programme',
                  duration: 3000,
                  position: 'middle'
                }).present();
              }else{
                this.toastCtrl.create({
                  message: 'Votre demande d\'adhésion à ce cours vient d\'être envoyée. Veuiller patienter svp!',
                  duration: 3000,
                  position: 'middle'
                }).present();
              }
            }else{
              this.toastCtrl.create({
                message: 'Votre demande d\'adhésion à ce cours a déjà été envoyée. Veuiller patienter svp!',
                duration: 3000,
                position: 'middle'
              }).present();
            }
          })
        });
      }else{
        this.toastCtrl.create({
          message: 'Vous devez vous connecter ou créer un compte au préalable!',
          duration: 3000,
          position: 'middle'
        }).present();
      }
    });
  }

  showNotification(event){
    let popover = this.popoverCtrl.create(NotificationPopoverPage);
    popover.present({
      ev: event
    });
  }

}
