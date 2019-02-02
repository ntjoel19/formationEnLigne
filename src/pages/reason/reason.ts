import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-reason',
  templateUrl: 'reason.html',
})
export class ReasonPage {
  reasons: Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.reasons = [{img: 'assets/img/icon3.png', name: 'Travel'}, {img: 'assets/img/icon4.png', name: 'Work'}, {img: 'assets/img/icon5.png', name: 'Culture'}]
  }

}