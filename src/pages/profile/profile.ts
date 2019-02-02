import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Content, ActionSheetController, ToastController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import $ from "jquery";
import 'intl-tel-input';

declare var cordova: any;

import { Observable } from 'rxjs';

import { Course } from '../../models/course.model'
import { CourseListService } from '../../services/course.service'
import { User } from '../../models/user.model';
import { UserListService } from '../../services/user.service';
import { User as UserProvider } from '../../provider/user'; 
import { DataProvider } from '../../providers/data/data';
import { Base64 } from '@ionic-native/base64';
ToastController

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  headerbg: any;
  image:string=null;
  darkHeader: any;
  tabsPosition: any;
  downloadURL;
  position
  @ViewChild('profileSlider') slider: Slides;
  @ViewChild(Content) content: Content;
  slides: any;
  status:Array<any>;

  isDisabled = true;
  list: Array<any> = [];
  friends: Array<any> = [];
  notification: Array<any>;
  tabs = '0';
  lastImage;
  numberOfNotifications = 0;
  userList : Observable<User[]>;
  courseList : Observable<Course[]>;
  meDetail : User = {
    key:'',
    pseudo:'',
    password :'',
    email : '',
    chat:null,
    name : '',
    birthdate : null,
    firstname: '',
    phone: 0,
    status : '',
    level : 0, 
    accepted : true,
    notification: null,
    courses : null,
    avatar: null,
    homeworks:null
  }
  imageForView: string=null;
  myCourses:any[]

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public courseService: CourseListService,
    private userService: UserListService, 
    public userProvider : UserProvider,
    public toast: ToastController,
    public platform : Platform,
    public base64: Base64,
    public file: File,
    public filePath : FilePath,
    public toastCtrl : ToastController,
    public user:UserProvider,
    public dataProvider: DataProvider,
    public actionSheetCtrl: ActionSheetController, public camera: Camera, public renderer: Renderer) {

    user.getCourse().then(course=>{
      this.myCourses = course;
      if(course != null){
        for(let i=0;i<course.length;i++){
          let newC = this.courseService.getACourse('subtitle',course[i].subtitle);
          newC.forEach(item=>{
            item.forEach(c=>{
              let x={img: 'assets/img/02.png', title: '  '+c.subtitle, subtitle: c.numberOfStudents+' learners'}
              this.list.push(x);
            })
          })
        }
      }
    })

    user.getUsermail().then(email => {
      this.userService.getAnUser('email',email).valueChanges().subscribe(next=>{
        next.map(me=>{
          this.meDetail = me;
        })
      });
    })

    //this.list = [{img: 'assets/img/02.png', title: '  Frances  50%', subtitle: '50.4M learners'}, {img: 'assets/img/03.png', title: 'Italian  30%', subtitle: '50.4M learners'}]

    this.userList = this.userService.getUserList().valueChanges();

    //get the course of the current logged user
    userProvider.getCourse().then(course=>{
      if(course != null){
        //we iterate on his course
        for(let i=0;i<course.length;i++){
          //for each course, find all users that also subcribe to it.
          this.userList.forEach(item=>{
            item.forEach(user=>{
              if(user.courses !== undefined){
                user.courses.map(c=>{
                  if(c.title === course[i].title){
                    let u={img: 'assets/img/img1.png',name: user.name,email:user.email}
                    this.friends.push(u);
                  }
                })
              }
            })
          })
        }
      }
    })
    //this.friends = [{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'}]

    this.user.getNotification().then(notification =>{
      this.notification = notification;
      if(notification !== null){
        this.numberOfNotifications = this.notification.length;
      }
    })
    //this.notification = [{img: 'assets/img/img1.png', name: 'Jasica Timberlake', text: 'finished lesson 2 in english course'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', text: 'finished lesson 2 in english course'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', text: 'finished lesson 2 in english course'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', text: 'finished lesson 2 in english courses'}]
    this.status = [
      {
          title: "Nouveaux convertis",
          number: 1
      },
      {
          title: "Membres de cellules",
          number : 2
      },
      {
          title: "Responsables de cellules EB",
          number: 3
      },
      {
          title: "Responsables de CEUs/CCUs",
          number : 4
      },
      {
          title: "Formateur",
          number : 5
      }
  ]
  }
  
  // for tab to nextslide
  selectTab(index) {
    this.slider.slideTo(index);
  }
  // for changeWillSlide
  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
  }
  // for enable input
  changeData(){
    this.isDisabled = !this.isDisabled;
  }
  
  // sor select country
  ngOnInit(): any {
    let telInput = $("#elemtId");
    let output = $("#output");

    telInput.intlTelInput();
    // listen to "keyup", but also "change" to update when the user selects a country
    telInput.on("keyup change", function() {
      var intlNumber = telInput.intlTelInput("getNumber");
      if (intlNumber) {
        output.text("International: " + intlNumber);
      } else {
        output.text("Please enter a number below");
      }
    });
  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            //console.dir("last image",imagePath)
            this.base64.encodeFile(imagePath).then(file=>{
              this.image = 'data:image/jpeg;base64,'+ file.split(",")[1];
              this.imageForView = filePath;
              this.uploadInformation(this.image.split(",")[1])
            })
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.image = 'data:image/jpeg;base64,' + imagePath
        this.uploadInformation(this.image.split(",")[1])
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      //console.log(err)
      let text = 'Error while selecting image '+err.toString();
      this.presentToast(text);
    });
  }

    // Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  //console.log(cordova.file.dataDirectory);
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    //console.dir(error)
    this.presentToast('Error while storing file.');
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
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

  uploadInformation(text){
    var ref=null;
    this.dataProvider.uploadToStorage(text,'user_images','jpg').then(promise=>{
      promise.ref.getDownloadURL().then(url=>{
        //console.dir(url)
        this.downloadURL = url;
        ref = this.dataProvider.storeInfoToDatabase(promise.metadata,url)
        this.meDetail.avatar = ref
        this.userService.updateUser(this.meDetail);
        this.toastCtrl.create({
          message: 'New file added!!',
          duration : 3000
        }).present()
      })
    })
    return ref;
  }


  //scroll header function
  ngAfterViewInit() {
    var lengthHeader=document.getElementsByClassName("list-header").length -1;
    this.headerbg = document.getElementsByClassName("list-header")[lengthHeader];
    var length=document.getElementsByClassName("tabs").length -1;
    this.tabsPosition = document.getElementsByClassName("tabs")[length];
  }
  scrollingFun(ev){
    ev.domWrite(() => {
        this.updateHeader(ev);
    }); 
  }
  updateHeader(ev) { 
  if (ev.scrollTop > 0) {
    this.darkHeader = ev.scrollTop / 125;
    this.position = ev.scrollTop;
  }
  if (this.position >= 95 ){
    this.renderer.setElementClass(this.tabsPosition, 'tabs-header', true);  
  }else  this.renderer.setElementClass(this.tabsPosition, 'tabs-header', false);

  this.renderer.setElementStyle(this.headerbg, 'background', 'rgba(0,172,237,' + this.darkHeader +')');
  }

  // for remove friends
  removeItem(item){
    for(var i = 0; i < this.friends.length; i++) {
      if(this.friends[i] == item){
        this.friends.splice(i, 1);
      }
    }
  }

  updateProfile(){
    this.userService.updateUser(this.meDetail).then(prom=>{
      
      this.isDisabled = true;
      this.toast.create({
        message : "Profil mis à jour avec succès",
        duration: 3000,
      }).present();
    },err=>{
      this.toast.create({
        message : err,
        duration: 3000,
      }).present();
    });
  }
}