import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { UserListService } from '../../services/user.service';
import { User as UserProvider } from '../../provider/user';

/**
 * class UsersPage for the UsersPage page.
 *
 * @author Ntepp J96n J06l
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  list:  Observable<User[]>;

  constructor(
    public navParams: NavParams,
    private userService: UserListService, 
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {
    this.list = this.userService.getUserList2().valueChanges()
  }

  /**
   * @function chatWith
   * @description open a new chat page with the following to parameters
   * @param page the page of chat: parameter to give to the next page called page
   * @param friends the user with who I want to chat: parameter to give to the next page called page
   */
  chatWith(page,friends){
    //console.log(friends);
    this.navCtrl.push(page,friends);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

}
