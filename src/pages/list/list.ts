import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { Course } from '../../models/course.model'
import { CourseListService } from '../../services/course.service'
import { Observable } from 'rxjs';
//import { App } from 'ionic-angular';

import { User } from '../../provider/user';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  headerbg: any;
  darkHeader: any;
  cards: Array<any>;

  courseList : Observable<Course[]>;
  userCourseList = [];
  accepted = false; //if the user is already allowed to access courses
  title;
  teacher;
  postDate;
  numberOfLecons;
  chapter;
  numberOfChapters;
  descriptImage;
  lessons;
  associateProf;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public popoverCtrl: PopoverController, 
    public renderer: Renderer,
    public courseListService: CourseListService,
    public user : User
  ) {
    //console.log(this.navParams.get('title'));
    this.chapter = this.navParams.get('chapter');
    this.title = this.navParams.get('title');
    this.teacher = this.navParams.get('PostedBy');
    this.postDate = this.navParams.get('post_date');
    this.descriptImage = this.navParams.get('descriptImage');
    this.associateProf = this.navParams.get('associateProf')
    this.numberOfChapters = this.chapter.length;
  }
  //scroll header function
  ngAfterViewInit() {
    var lengthHeader=document.getElementsByClassName("list-header").length -1;
    this.headerbg = document.getElementsByClassName("list-header")[lengthHeader];
  }
  scrollingFun(ev){
    ev.domWrite(() => {
        this.updateHeader(ev);
    }); 
  }
  updateHeader(ev) { 
  if (ev.scrollTop > 0) {
    this.darkHeader = ev.scrollTop / 125;
    this.renderer.setElementClass(this.headerbg, 'sub-header', true);  
  }else  this.renderer.setElementClass(this.headerbg, 'sub-header', false);

  this.renderer.setElementStyle(this.headerbg, 'background', 'rgba(0,172,237,' + this.darkHeader +')');
  }  

  goTo(page,param){
    //console.log(page,param)
    param['teacher'] = this.teacher;
    param['associateProf'] = this.associateProf;
    param['pfmName'] = this.title
    this.navCtrl.push(page,param);
  }

}