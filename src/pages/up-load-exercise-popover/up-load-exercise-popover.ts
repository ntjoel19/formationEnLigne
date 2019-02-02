import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, Platform, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Camera } from '@ionic-native/camera';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
//declare var cordova: any;

import {UserListService} from '../../services/user.service';
import {NotificationService} from '../../services/notification.service';
import {User} from '../../provider/user';
import {DataProvider} from '../../providers/data/data';



/**
 * Generated class for the UpLoadExercisePopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-up-load-exercise-popover',
  templateUrl: 'up-load-exercise-popover.html',
})
export class UpLoadExercisePopoverPage {
  form: FormGroup;
  image;
  myCourses : any[] = []
  imagePath;
  downloadURL;
  tmp:any[];
  lessons:[
    {
      lessonTitle:string,
      chapterName:string,
      exerciseName:string,
      PfmName:string;
    }
  ]
  work:{
    done: boolean,
    seen: boolean,
    file:{
        name:string;
        type:string;
        content : string;
    },
    note:number,
    teacher:string,
    submitionDate: string,
    pfmName:string,
    chapterName: string,
    leconName:string,
    studentComment:string,
    teacherComment:string,
    exerciseName: string
}={
    done: true,
    seen: false,
    file:{
        name:"",
        type:"",
        content : "",
    },
    note:0,
    teacher:"",
    submitionDate: new Date().toString(),
    pfmName:"",
    chapterName: "",
    leconName:"",
    studentComment:"",
    teacherComment:"",
    exerciseName: ""
  }
  constructor(public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public camera: Camera,
    public notificationService: NotificationService,
    public platform: Platform,
    public filePath:FilePath,
    public file:File,
    public userService : UserListService,
    public user: User,
    public dataProvider:DataProvider) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      type:'',
      quizz:[''],
      studentComment:['', Validators.required]
    })

    this.user.getUsermail().then(email=>{
      this.userService.getAnUser('email',email).valueChanges().subscribe(users=>{
        users.forEach(user=>{
          //var pfm='',chap='',lecon='';
          this.myCourses=user.courses;
          this.myCourses.forEach(course=>{
            course.chapter.forEach(chap=>{
              chap.lecon.forEach(lecon=>{
                lecon.quizz.forEach(quizz=>{
                  if(this.lessons===undefined){
                    this.lessons = [{PfmName:course.title,chapterName:chap.name,lessonTitle:lecon.leconTitle,exerciseName:quizz.name}]
                  }else{
                    this.lessons.push({PfmName:course.title,chapterName:chap.name,lessonTitle:lecon.leconTitle,exerciseName:quizz.name});
                  }
                })
              })
            })
          })
        })
      })
    })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad UpLoadExercisePopoverPage');
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select a file',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            //let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            //let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            this.image ='data:image/jpeg;base64,' + filePath;
            this.imagePath = imagePath;
          });
      } else {
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.image = 'data:image/jpeg;base64,' + imagePath
        this.imagePath = imagePath
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      //console.log(err)
      let text = 'Error while selecting image '+err.toString();
      this.presentToast(text);
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  done(val) {
    //if (!this.form.valid) { return; }
    this.work.done = true;
    this.work.studentComment = val.studentComment;
    this.work.submitionDate = new Date().toString();
    this.work.file.name = val.name;
    this.work.file.type = val.type;
    this.tmp = val.quizz.split("--");
    
    //console.log(val.type);
    this.addWork(this.work)
    //this.viewCtrl.dismiss(this.form.value);
  }

  addWork(work){
    this.user.getUsermail().then(email=>{
      if(email){
        this.userService.getAnUser('email',email).valueChanges(['child_added','child_removed']).subscribe(users=>{
          users.forEach(user=>{
            this.uploadInformation(work,this.imagePath,work.file.type,user)
          })
        })
      }
    })
    
    this.navCtrl.setRoot('MyMarksPage');
  }

  uploadInformation(work,text,ext,user){
    this.dataProvider.uploadToStorage(text,'homework-files',ext).then(promise=>{
      promise.ref.getDownloadURL().then(url=>{
        this.downloadURL = url
        this.dataProvider.storeInfoToDatabase(promise.metadata,url)
        work.file.content = url;
        user.homeworks.forEach((homework,i)=>{
          if(homework.exerciseName===this.tmp[0] && homework.leconName===this.tmp[1] && homework.chapterName===this.tmp[2] && homework.pfmName===this.tmp[3]){
            user.homeworks[i].done=work.done;
            user.homeworks[i].studentComment=work.studentComment;
            user.homeworks[i].comments[0].date = new Date().toString();
            user.homeworks[i].comments[0].author = user.pseudo
            user.homeworks[i].comments[0].message = work.studentComment;
            user.homeworks[i].file.content=work.file.content;
            user.homeworks[i].file.name=work.file.name;
            user.homeworks[i].file.type=work.file.type
          }
        })
        this.userService.updateUser(user)
        //this.user.avatar = ref
        this.toastCtrl.create({
          message: 'Work Uploaded!!',
          duration : 3000
        }).present()
        this.notificationService.sendNotification(['Formateur','Admin'],'',user.email,"Pending homework");
      });
    });
    
  }
}
