import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-lessons-list',
  templateUrl: 'lessons-list.html',
})
export class LessonsListPage {
  headerbg: any;
  darkHeader: any;
  cards: Array<any>;
  lessons;
  pageTitle;
  title;
  teacher;
  postDate;
  pfmName;
  chapterName;
  chapter;
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public renderer: Renderer) {
    this.lessons = this.navParams.get('lecon')
    this.pageTitle = this.navParams.get('name')   

    //this.cards = [{id: '1', btn: 'redo', type: 1},{id: '2', btn: 'redo', type: 1},{id: '3', btn: 'begin', type: 0},{id: '4', btn: 'begin', type: 0}]
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
  }else{
    this.renderer.setElementClass(this.headerbg, 'sub-header', false);
  }

  this.renderer.setElementStyle(this.headerbg, 'background', 'rgba(0,172,237,' + this.darkHeader +')');
  }

  goTo(page,param){
    //console.log(page,param)
    param['chapterName'] = this.navParams.get('name')
    param['teacher'] = this.navParams.get('teacher');
    param['pfmName'] = this.navParams.get('pfmName');
    param['associateProf'] = this.navParams.get('associateProf')
    this.navCtrl.push(page,param);
  }
}