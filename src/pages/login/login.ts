import { Component, ViewChild, Renderer } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Events, IonicPage, NavController, NavParams, ViewController, Loading, Slides, Content, MenuController, AlertController, ToastController,  ActionSheetController, LoadingController,  Platform } from 'ionic-angular';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from '../../services/auth.service';
import { UserListService } from '../../services/user.service';
import { HomePage } from '../home/home';
import { File } from '@ionic-native/file';
//import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

declare var cordova: any;

import { Course } from '../../models/course.model'
import { User } from '../../models/user.model';

import { CourseListService } from '../../services/course.service'
import { NotificationService } from '../../services/notification.service';
import { User as UserProvider } from '../../provider/user';
import { DataProvider } from '../../providers/data/data';
import { CourseProvider } from '../../providers/course/course'


import { Observable } from 'rxjs';

import $ from "jquery";
import 'intl-tel-input';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('mySlider') slider: Slides;
  @ViewChild('fileInput') fileInput;
  @ViewChild(Content) content: Content;
  slides: any;
  tabs: any = '0';

  task: AngularFireUploadTask;

  progress: any;  // Observable 0 to 100
  lastImage: string = null;
  loading: Loading;

  image: string=null; // base64
  downloadURL;
  courseListOff:any[];
  loginForm: FormGroup;
  signupForm : FormGroup;
  loginError: string; 
  user : User = {
    key : null,
    email: "",
    chat:null,
    password: "",
    name: "",
    firstname: "",
    pseudo : "",
    birthdate : null,
    phone : null,
    status : "",
    level : 0,
    notification : null,
    courses : null,
    avatar : null,
    accepted : false,
    homeworks:null
  };
  course : string = "";

  //Objects to share with the view
  status : Array<any>
  userList : Observable<User[]>;
  courseList : Observable<Course[]>;
  imageForView: string = null;

  constructor(public navCtrl: NavController, 
    public viewCtrl: ViewController, 
    public loadingCtrl : LoadingController,
    public navParams: NavParams, 
    public menu: MenuController, 
    public alertCtrl: AlertController,
    private auth: AuthService,
    private courseListService : CourseListService, 
    private userListService: UserListService,
    public userProvider : UserProvider,
    private dataProvider: DataProvider,
    public storage: AngularFireStorage,
    public events: Events, 
    public FilePath: FilePath,
    private base64: Base64,
    public notification: NotificationService,
    private camera: Camera, private file: File, 
    private filePath: FilePath,  
    public toastCtrl: ToastController,
     public platform: Platform, 
     public courseProvider: CourseProvider,
		fb: FormBuilder,public actionSheetCtrl: ActionSheetController, public renderer: Renderer) {
      
      this.loginForm = fb.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });
      this.menu.swipeEnable(false);
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
      //this.userList = this.userListService.getUserList().valueChanges();
      this.courseList = this.courseListService.getCourseList().valueChanges();
  }

  // for tab to nextslide
    selectTab(index) {
      this.slider.slideTo(index);
      this.content.scrollToTop();
    }
  // for changeWillSlide
    changeWillSlide($event) {
      this.tabs = $event._snapIndex.toString();
      setTimeout(()=>{
        this.content.scrollToTop();
      },200)
    }
    // for next slide
    goToslideNext(){
      this.slider.slideNext();
    }
    // function for forget password
    forgotPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Forgot Password',
      message: "Enter your email address and we'll help you reset your password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            //console.log(data.email)
            this.auth.resetPassword(data.email).then( authService => {
              this.navCtrl.setRoot(HomePage);
            }, error => {
              this.loading.dismiss().then( () => {
                let alert = this.alertCtrl.create({
                  message: error.message,
                  buttons: [
                    {
                      text: "Ok",
                      role: 'cancel'
                    }
                  ]
                });
                alert.present();
              });
            });
      
            this.loading = this.loadingCtrl.create({
              dismissOnPageChange: true,
            });
            this.loading.present();
          }
        }
      ]
    });
    prompt.present();
  }

  login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password,
		};
		this.auth.signInWithEmail(credentials)
			.then(() => {
        
        this.navCtrl.setRoot(HomePage);
        this.events.publish('user:login', credentials);
        let user = this.userListService.getAnUser('email',credentials.email).valueChanges(['child_added','child_removed']);
        user.forEach(elem=>{
          for(let i=0;i<elem.length;i++){
            this.userProvider.login(credentials.email,credentials.password,elem[i].status,elem[i].pseudo,elem[i].accepted,elem[i].courses,elem[i].notification,elem)
          }
        })
        let toast = this.toastCtrl.create({
          message : "Bienvenue! Vous êtes connecté!",
          duration: 3000,
          position : 'top'
        })
        toast.present();
      },(error) => {
          this.loginError = error.message
          if(error.message === "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
            this.loginError = "Probleme de connection au serveur"
          }else if(error.message === "The password is invalid or the user does not have a password."){
            this.loginError = "Le mot de passe est invalide ou l'utilsateur n'a pas de mot de passe."
          }
          //console.log(error.message);
          let toast = this.toastCtrl.create({
            message : this.loginError,
            duration: 5000,
            position : 'top'
          })
          toast.present();
        }
      );
      this.courseListService.getCourseList().valueChanges().subscribe(list=>{
        list.forEach(course=>{
          if(this.courseListOff === undefined)
            this.courseListOff = [course]
          else  
            this.courseListOff.push(course);
        })
        this.courseProvider.setCourseList(this.courseListOff)
      })
  }

  signup(){
    
    if (!this.user.email || !this.user.password) {
			return;
		}

    let credentials = {
			email: this.user.email,
			password: this.user.password
    };
    
    //console.log(this.course)
    if(this.course !== null)
    {
      var c = this.courseListService.getACourse('subtitle',this.course[0])
      c.forEach(item=>{
        item.forEach(co=>{
          this.user.courses = [{
            title:co.title,
            descriptImage: co.descriptImage,
            key: co.key,
            authorisation : true,
            subtitle: co.subtitle,
            teacher : co.teacher,
            post_date: co.post_date,
            duration:co.duration,
            description: co.description,
            PostedBy:co.PostedBy,
            numberOfStudents: co.numberOfStudents,
            chapter:co.chapter
          }];
        })
      })
    }

    for (let i=1;i<this.course.length;i++){
        c = this.courseListService.getACourse('subtitle',this.course[i]);
        c.forEach(item=>{
        item.forEach(co=>{
          this.user.courses.push({
            title:co.title,
            descriptImage:co.descriptImage,
            key: co.key,
            authorisation : true,
            subtitle: co.subtitle,
            teacher : co.teacher,
            post_date: co.post_date,
            duration:co.duration,
            description: co.description,
            PostedBy:co.PostedBy,
            numberOfStudents: co.numberOfStudents,
            chapter:co.chapter
          });
        })
      })
    }
    
    //
		this.auth.doRegister(this.user)
    .then(() => {
      //After signing up, the user is automatically logged in
      this.auth.signInWithEmail(credentials)
      .then(() => {
          this.navCtrl.setRoot(HomePage);
          let toast = this.toastCtrl.create({
            message : "Vous êtes connecté!",
            duration: 3000,
            position : 'top'
          })
          toast.present();
        },(error) => {
          this.loginError = error.message;
          let toast = this.toastCtrl.create({
            message : this.loginError,
            duration: 3000,
            position : 'top'
          })
          toast.present();
        }
      );
      //If the selected an  image then upload it
      this.userListService.addUser(this.user).then(snapshot=>{
        //console.log(snapshot);
        this.uploadInformation(this.image.split(",")[1])
      });
      //The new registered user is added to the database
      
      this.viewCtrl.dismiss();

      //We will send a notification to admins and mentors that a new user needs to be confirmed
      //let roles = ["Admin","Formateur"]
      //this.notification.sendNotification(roles, '', this.user.email, "Nouvel Utilisateur inscrit");

      this.navCtrl.setRoot(HomePage),
      error => this.loginError = error.message

      this.userProvider.login(
        this.user.email,
        this.user.password,
        this.user.status,
        this.user.pseudo,
        this.user.accepted,
        this.user.courses,
        this.user.notification,
        this.user
      )
      this.courseListService.getCourseList().valueChanges().subscribe(list=>{
        list.forEach(course=>{
          if(this.courseListOff === undefined)
            this.courseListOff = [course]
          else  
            this.courseListOff.push(course);
        })
      })
      this.courseProvider.setCourseList(this.courseListOff)
      let toast = this.toastCtrl.create({
        message : "Compte crée avec succès",
        duration: 3000,
        position : 'top'
      })
      toast.present(); 
    },(error)=>{
      this.loginError = error.message
      let toast = this.toastCtrl.create({
        message : this.loginError,
        duration: 3000,
        position : 'top'
      })
      toast.present();
    });
    
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

  uploadInformation(text){
    var ref=null;
    this.dataProvider.uploadToStorage(text,'user_images','.jpg').then(promise=>{
      promise.ref.getDownloadURL().then(url=>{
        //console.dir(url)
        this.downloadURL = url;
        ref = this.dataProvider.storeInfoToDatabase(promise.metadata,url)
        this.user.avatar = ref
        this.userListService.updateUser(this.user);
        this.toastCtrl.create({
          message: 'New file added!!',
          duration : 3000
        }).present()
      })
    })
    return ref;
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
            })
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.image = 'data:image/jpeg;base64,' + imagePath
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

  getProfileImageStyle() {
    return 'url(' + this.user.avatar + ')'
  }
}