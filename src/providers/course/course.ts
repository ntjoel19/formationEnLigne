import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import * as firebase from "firebase";

/*
  Generated class for the CourseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CourseProvider {
  courseList:any[]
  constructor(
    public events: Events,
    public storage: Storage) {
    //console.log('Hello CourseProvider Provider');
  }

  setCourseList(courses):void{
    this.storage.set('courses',courses);
  }

  getCourseList():Promise<any[]>{
    return this.storage.get('courses').then((value) => {
      return value;
    });
  }
}
