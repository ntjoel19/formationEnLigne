import { Component, ViewChild, Renderer, NgZone } from '@angular/core';
import { Nav, Platform, MenuController , Events, ToastController, AlertController, PopoverController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import {HomePage } from '../pages/home/home';

import { AuthService } from '../services/auth.service';
import { User as UserProvider} from '../provider/user';
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
    public toastCtrl:ToastController, public userService:UserListService) 
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
      { title: 'Profile', component: 'ProfilePage', icon: 'md-person' },
      { title: 'Configurations', component: 'SettingPage', icon: 'md-settings' },
      { title: 'Sortir', component: 'LoginPage', icon: 'md-log-out' }
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
            
            this.thisUser = this.userService.getAUser2('email',user.email).valueChanges();
            this.email = user.email;
            this.thisUser.subscribe(item=>{
              this.observeOffline = true;
              item.forEach(user=>{
                //console.dir(user.courses)
                this.userFb = user;
                this.image = (this.userFb.avatar!=null ? this.userFb.avatar.url:"");
                this.userName = this.userFb.pseudo;
              })
            })
          } else {
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
}