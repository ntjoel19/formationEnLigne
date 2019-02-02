import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the FileUploadProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FileUploadProvider {
  sbaList:any;
  constructor() {
    this.sbaList = firebase.database().ref('/sbalist');
  }

  

}
