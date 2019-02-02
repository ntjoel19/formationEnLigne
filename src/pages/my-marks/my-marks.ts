import { Component, Renderer} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { User } from '../../provider/user';
import {UserListService} from '../../services/user.service';
import { UpLoadExercisePopoverPage } from '../up-load-exercise-popover/up-load-exercise-popover';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NotificationService} from '../../services/notification.service';

/**
 * Generated class for the MyMarksPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-marks',
  templateUrl: 'my-marks.html',
})
export class MyMarksPage {
  form: FormGroup;
  headerbg: any;
  darkHeader: any;
  email;
  homeworks:any[];
  numberOfComments:[
    {
      nbComments:number,
      nbLikes:number
    }
  ];
  pseudo;
  openComment:boolean[];
  hasAHomework=false;
  newComment;
  thisUser;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public popoverCtrl:PopoverController,
    public userService: UserListService,
    public renderer: Renderer,
    public formBuilder: FormBuilder,
    public notification:NotificationService,
    public user : User
    ) {

      this.form = this.formBuilder.group({
        comm: ['', Validators.required]
      })
      window.addEventListener("offline",()=>{
        this.offlineHomeWorkList();
      })
      this.user.getUsermail().then(email=>{
        if(email){
          this.email = email
          this.userService.getAnUser('email',email).valueChanges().subscribe(users=>{
            users.forEach((user,i)=>{
              this.thisUser = user;
              this.pseudo = user.name;
              if(user.homeworks !== undefined){
                this.hasAHomework = true;
                this.homeworks = user.homeworks
                user.homeworks.forEach(homework=>{
                  if(this.homeworks!==undefined){
                    if(this.numberOfComments!==undefined){
                      this.numberOfComments.push({nbComments:homework.comments.length,nbLikes:0})
                      this.openComment.push(false);
                    }else{
                      this.numberOfComments =[{nbComments:homework.comments.length,nbLikes:0}]
                      this.openComment = [false];
                    }
                  }else{
                    //this.homeworks = [homework]
                    this.numberOfComments = [{nbComments:homework.comments.length,nbLikes:0}]
                    this.openComment = [false];
                  }
                })
                //this.homeworks = this.removeDuplicated(this.homeworks)
              }
            })
          })
        }
      })
  }

  offlineHomeWorkList(){
    this.user.getUsermail().then(email=>{
      if(email){
        this.email = email
        this.user.getUser().then(users=>{
          this.homeworks = undefined
          let user = users[0]
          this.thisUser = user;
          this.pseudo = user.name;
          if(user.homeworks !== undefined){
            this.hasAHomework = true;
            this.homeworks = user.homeworks
            user.homeworks.forEach(homework=>{
                if(this.homeworks!==undefined){
                  if(this.numberOfComments!==undefined){
                    this.numberOfComments.push({nbComments:homework.comments.length,nbLikes:0})
                    this.openComment.push(false);
                  }else{
                    this.numberOfComments = [{nbComments:homework.comments.length,nbLikes:0}]
                    this.openComment = [false];
                  }
                }else{
                  this.numberOfComments = [{nbComments:homework.comments.length,nbLikes:0}]
                  this.openComment = [false];
                }
            })
          }
        })
      }
    })
  }

  homeworkList(){
    
  }

  post(val,homework,i){
    this.form.patchValue({comm:""})
    this.thisUser.homeworks[i]
    this.user.getUsermail().then(email=>{
      if(email!==undefined){
        this.email = email
        this.userService.getAnUser('email',email).valueChanges(['child_added','child_removed']).subscribe(users=>{
          users.forEach((user,i)=>{
            user.homeworks[i].comments.push({"date":new Date().toString(),"author":user.name,"message":val.comm});
            this.thisUser = user
            this.userService.updateUser(this.thisUser).then(()=>{
              this.notification.sendNotification(null,homework.teacher,user.name,val.comm)
            });
          })
        })
      }
    })
    //this.navCtrl.setRoot('MyMarksPage');
  }

  removeDuplicated(list):any[]{
    if(list!==undefined){
      for(let i=0;i<list.length;i++){
        for(let j=i+1;j<list.length;j++){
          if(list[i].exerciseName === list[j].exerciseName){
            list.splice(i,1)
          }
        }
      }
    }
    return list
  }

  openComments(i){
    this.openComment[i]=!this.openComment[i];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MyMarksPage');
    //this.offlineHomeWorkList()
  }
  submitHomework(event){
    let popover = this.popoverCtrl.create(UpLoadExercisePopoverPage);
    popover.present({
      ev: event
    });
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


}
