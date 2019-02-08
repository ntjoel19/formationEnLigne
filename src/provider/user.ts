import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserListService } from '../services/user.service'

/**
 * @author Ntepp J96n J09l
 */
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

  login(email: string,password:string,userName:string,user): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setEmail(email); 
    this.setUsername(userName);
    this.setpassword(password);
    this.events.publish('user:login');
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

  /**
   * Allow to set the email in the localStorage
   * @param {string} email
   */
  setEmail(email:string): void {
    this.storage.set('email', email);
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

  /**
   * This allow to retrieve the role in the local database
   * @param {string} password
   */
  getRole():Promise<string>{
    return this.storage.get("role").then((value) => {
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

  /**
   * This allow to store the role in the local database
   * @param {string} password
   */
  setRole(role: string):void{
    this.storage.set("role",role);
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };


  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}