import { Component, ViewChild, Renderer, NgZone } from '@angular/core';
import { Nav, Platform, MenuController , Events, ToastController, AlertController, PopoverController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import {HomePage } from '../pages/home/home';
import {NotificationPopoverPage} from '../pages/notification-popover/notification-popover';

import { AuthService } from '../services/auth.service';
import { User as UserProvider} from '../provider/user';
import { CourseListService } from '../services/course.service';
import { Badge } from '@ionic-native/badge';
import { FCM } from '@ionic-native/fcm';

import { User } from '../models/user.model';

import { Observable } from 'rxjs';
import { UserListService } from '../services/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  accepted:boolean;
  pages: Array<any>;
  dashboard: Array<any>;
  pagesAdmin: Array<any>;
  pagesFormateur: Array<any>;
  list: Array<any>;
  role: string;
  userName : string;
  image : string
  notification : Array<any>;
  thisUser : Observable<User[]>;
  userFb;
  email:string;
  numberOfNotifications : number = 0;

  photo = 'assets/img/user-img.png';
  observeOffline: boolean = false;

  constructor(public platform: Platform, public storage: Storage, 
    private auth: AuthService, public statusBar: StatusBar, 
    private badge: Badge, public alertCtrl:AlertController,
    public fcm: FCM,
    public splashScreen: SplashScreen, public renderer: Renderer , public events:Events,
    public zone :NgZone, public menu: MenuController, public userProvider: UserProvider,
    public popoverCtrl:PopoverController,
    public toastCtrl:ToastController, public userService:UserListService,
    public courseService : CourseListService) 
  {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icon: 'md-home' },
      { title: 'Setting', component: 'SettingPage', icon: 'md-settings' },
    ];

    this.dashboard = [
      { title: 'Accueil', component: 'HomePage', icon: 'md-home' },
      { title: 'Discussions', component: 'FriendsPage', icon: 'chatboxes' },
      { title: 'Mes cours', component: 'MyCoursesPage', icon: 'ios-albums' },
      { title: 'Mes travaux', component: 'MyMarksPage', icon: 'md-trophy' },
      { title: 'Profile', component: 'ProfilePage', icon: 'md-person' },
      { title: 'Configurations', component: 'SettingPage', icon: 'md-settings' },
      { title: 'Sortir', component: 'LoginPage', icon: 'md-log-out' }
    ]

    this.pagesAdmin = [
      { title: 'Gestion Utilisateurs', component: 'UserManagerPage', icon: 'md-person' },
      { title: 'Gestion Cours', component: 'CourseManagementPage', icon: 'md-school' },
      { title: 'Mes étudiants', component: 'MyStudentPage', icon: 'md-person' }
    ]

    this.pagesFormateur = [
      { title: 'Gestion Cours', component: 'CourseManagementPage', icon: 'md-school' },
      { title: 'Mes étudiants', component: 'MyStudentPage', icon: 'md-person' }
    ]
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = LoginPage;
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.auth.afAuth.authState.subscribe(
        user => {
          if (user) {
            //if the user is logged...
            this.rootPage = HomePage;
            window.addEventListener("offline",()=>{
              
              this.userProvider.getUser().then(thisUserSaved=>{
                this.userFb = thisUserSaved[0];
                this.list = this.userFb.courses
                this.role = this.userFb.status;
                this.accepted = this.userFb.accepted;
                this.image = (this.userFb.avatar!=null? this.userFb.avatar.url:"");
                this.userName = this.userFb.pseudo;
                this.notification = this.userFb.notification;
                if(this.notification !== null){
                  this.numberOfNotifications = this.notification.length;
                  this.badge.set(this.numberOfNotifications);
                }
              })
            })
            this.userProvider.getUser().then(thisUserSaved=>{
              //console.log(thisUserSaved)
              if(thisUserSaved !== null){  
                this.userFb = thisUserSaved[0];
                this.list = this.userFb.courses
                this.role = this.userFb.status;
                //console.log(this.role)
                this.accepted = this.userFb.accepted;
                this.image = (this.userFb.avatar!=null? this.userFb.avatar.url:"");
                this.userName = this.userFb.pseudo;
                this.notification = this.userFb.notification;
                if(this.notification !== undefined){
                  this.numberOfNotifications = this.notification.length;
                  this.badge.set(this.numberOfNotifications);
                }
              }
            })
            this.thisUser = this.userService.getAnUser('email',user.email).valueChanges();
            this.email = user.email;
            this.thisUser.subscribe(item=>{
              this.observeOffline = true;
              item.forEach(user=>{
                //console.dir(user.courses)
                this.userFb = user;
                this.list = this.userFb.courses;
                this.role = this.userFb.status;
                this.accepted = this.userFb.accepted;
                this.image = (this.userFb.avatar!=null? this.userFb.avatar.url:"");
                this.userName = this.userFb.pseudo;
                this.notification = this.userFb.notification;
                if(this.notification !== undefined){
                  this.numberOfNotifications = this.userFb.notification.length;
                  this.badge.set(this.numberOfNotifications);
                }
              })
            })
          } else {
            this.list = []
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
      );
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === "Logout"){
      this.auth.doLogout().then(()=>{
        //console.log("User Loged out");
        this.userProvider.logout();
      })
      let toast = this.toastCtrl.create({
        message : "Vous êtes actuellement déconnecté!",
        duration: 3000,
        position : 'top'
      })
      toast.present();
    }
    this.nav.setRoot(page.component);
  }

  goTo(page,param){
    this.nav.setRoot(page, param);
  }

  showNotification(event){
    let popover = this.popoverCtrl.create(NotificationPopoverPage);
    popover.present({
      ev: event
    });
  }
}