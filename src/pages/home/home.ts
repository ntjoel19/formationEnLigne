import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, PopoverController } from 'ionic-angular';

import { UserListService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { App } from 'ionic-angular';


/**
 * @author Ntepp J96n J09l
 * class Home for HomePage page
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    
    public auth: AuthService) 
    {
            
  }
  
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    
  }

  goTo(page,param){
    //console.log(param);
    this.navCtrl.push(page,param);
  }
}