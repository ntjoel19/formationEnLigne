import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserListService } from '../services/user.service'

@Injectable()
export class User {

  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  STUDENT_HAS_LOGGED_IN = 'studentHasLoggedIn';
  TEACH_HAS_LOGGED_IN = 'teachHasLoggedIn';
  ADMIN_HAS_LOGGED_IN = 'adminHasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_SET_INFOS ='hasSetInforamtion';
  userList:any[];
  constructor(
    public events: Events,
    public storage: Storage,
    public accountLitService: UserListService
  ) {
    this.accountLitService.getUserList().valueChanges().subscribe(users=>{
      users.forEach(user=>{
        if(this.userList===undefined){
          this.userList = [user]
        }else{
          this.userList.push(user);
        }
      })
    })

  }
  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };
  
  setTutorialSeen(value:boolean):void{
    this.storage.set(this.HAS_SEEN_TUTORIAL,value);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(email: string,password:string,role:string,userName:string,accepted:boolean,course,notifications,user): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setRole(role);
    this.setEmail(email); 
    this.setUsername(userName);
    this.setAccepted(accepted)
    this.setpassword(password);
    this.setCourse(course)
    this.setNotification(notifications)
    this.setUser(user);
    this.setUserList(this.userList);
    this.events.publish('user:login');
  };

  signup(email: string,password:string,role:string,userName:string,accepted:boolean,course:Array<any>,notifications,user): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setRole(role);
    this.setEmail(email); 
    this.setUsername(userName);
    this.setAccepted(accepted)
    this.setpassword(password);
    this.setCourse(course)
    this.setNotification(notifications)
    this.setUser(user);
    this.setUserList(this.userList);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.set(this.HAS_LOGGED_IN, false);
    this.storage.remove('username');
    this.storage.remove('email');
    this.storage.remove('publish');
    this.storage.remove('accepted');
    this.storage.remove('password');
    this.storage.remove('role');
    this.storage.remove('course')
    this.storage.remove('notifications')
    this.storage.remove('user')
    this.storage.remove('userList')
    this.storage.remove('courses')
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  setUserList(userList){
    this.storage.set('userList',userList)
  }

  /**
   * Allow to set the email in the localStorage
   * @param {string} email
   */
  setEmail(email:string): void {
    this.storage.set('email', email);
  };

  setCourse(course) : void {
    this.storage.set('course' , course);
  };

  setCourseDetail(course): void {
    this.storage.set('courseDetails', course);
  };

  setNotification(notifications): void {
    this.storage.set('notifications', notifications);
  };

  setUser(user): void {
    this.storage.set('user', user);
  };

  getCourse(): Promise<Array<any>> {
    return this.storage.get('course').then((value) => {
      return value;
    });
  };

  getCourseDetail(): Promise<Array<any>> {
    return this.storage.get('courseDetail').then((value) => {
      return value;
    });
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  getUserList(): Promise<any[]> {
    return this.storage.get('userList').then((value) => {
      return value;
    });
  };

  getUser(): Promise<any> {
    return this.storage.get('user').then((value) => {
      return value;
    });
  };

  getNotification(): Promise<Array<any>> {
    return this.storage.get('notifications').then((value) => {
      return value;
    });
  };

  /**
   * Allow to retrieve email information from the database
   * @returns {Promise<string>}
   */
  getUsermail(): Promise<string> {
    return this.storage.get('email').then((value) => {
      return value;
    });
  };

  getRole():Promise<string>{
    return this.storage.get("role").then((value) => {
      return value;
    });
  }

  getAccepted():Promise<boolean>{
    return this.storage.get("accepted").then((value) => {
      return value;
    });
  }

  /**
   * This allow to store the password in the local database
   * @param {string} password
   */
  setpassword(password: string): void{
    this.storage.set('password', password);
  }

  setRole(role: string):void{
    this.storage.set("role",role);
  }

  setAccepted(accepted : boolean):void{
    this.storage.set("accepted",accepted);
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  hasSeenTutorial(): Promise<boolean> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value === true;
    });
  };

  studentHasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.STUDENT_HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  teacherHasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.TEACH_HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  adminHasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.ADMIN_HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}