import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
//import {HttpClientModule} from '@angular/common/http';

import { MyApp } from './app.component';
import { Push  } from '@ionic-native/push';
import { Badge } from '@ionic-native/badge';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { Base64 } from '@ionic-native/base64';
import { FCM } from '@ionic-native/fcm'

import {environment} from '../environment/environment'

import { User } from '../provider/user';

import { UserListService } from '../services/user.service'
import { AuthService } from '../services/auth.service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser'
import { Camera } from '@ionic-native/camera';
import { DatePipe } from '@angular/common';
import { LongPressModule } from 'ionic-long-press';
import { LoginPageModule } from '../pages/login/login.module';
import { HomePageModule } from '../pages/home/home.module';
import { DataProvider } from '../providers/data/data';

var config = {
  backButtonText: '',
  backButtonIcon: 'md-arrow-back',
  pageTransition: 'md',
  mode:'md',
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,config),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    LoginPageModule,
    IonicStorageModule.forRoot(),
    HomePageModule,
    LongPressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    UserListService,
    SplashScreen,
    Push,
    FCM,
    Badge,
    User,
    AuthService,
    AngularFireAuth,
    AngularFirestore,
    DatePipe,
    Transfer,
    FileTransfer, FileTransferObject,
    Camera,
    FilePath,
    FileChooser,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler, deps: [Storage]},
    DataProvider,
    InAppBrowser,
    Base64
  ]
})
export class AppModule {}