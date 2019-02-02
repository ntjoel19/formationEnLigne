import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  offers: Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.offers = [{img: 'assets/img/icon6.png', name: 'Premium', subList:[{icon: 'md-checkmark',text: 'Flashcards'},{icon: 'md-checkmark',text: 'Corrections from native speakers'},{icon: 'md-checkmark',text: ' Travel course'},{icon: 'md-checkmark',text: 'Mobile apps with offline mode'},{icon: 'md-checkmark',text: 'Quizzes and official certificates'},{icon: 'md-checkmark',text: 'Quizzes and official certificates'},{icon: 'md-checkmark',text: 'Grammar exercises'},{icon: 'md-checkmark',text: 'Vocabulary trainer'},{icon: 'md-checkmark',text: 'Get full access to 12 different'},{icon: 'md-checkmark',text: 'language courses'}], type: 1}, {img: 'assets/img/icon7.png', name: 'Free', subList:[{icon: 'md-checkmark',text: 'Flashcards'},{icon: 'md-checkmark',text: 'Corrections from native speakers'},{icon: 'md-checkmark',text: ' Travel course'},{icon: 'md-lock',text: 'Mobile apps with offline mode'},{icon: 'md-lock',text: 'Quizzes and official certificates'},{icon: 'md-lock',text: 'Quizzes and official certificates'},{icon: 'md-lock',text: 'Grammar exercises'},{icon: 'md-lock',text: 'Vocabulary trainer'},{icon: 'md-lock',text: 'Get full access to 12 different'},{icon: 'md-lock',text: 'language courses'}]}]
  }

}