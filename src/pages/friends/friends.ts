import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { UserListService } from '../../services/user.service';
import { User as UserProvider } from '../../provider/user'; 

/**
 * @author :  Ntepp J96n J09l
 */
@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  headerbg: any;
  darkHeader: any;
  searchPosition: any;
  friends: Array<any> = [];

  userList : Observable<User[]>;
  userList2:any[]
  userListTab:any[]
  email: string;
  numberOfNotSeen: number[]=new Array<number>(1000);
  lastMessage: any[]=new Array<string>(1000)
  me: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private userService: UserListService, 
    public userProvider : UserProvider,
    public renderer: Renderer,
    public alertCtrl: AlertController
    ) {
    
    }

  /**
   * @function removeDuplicated
   * @description : utility function - remove all duplicated element in an array
   * @param list the array wher we want to remeove duplicated values
   */
  removeDuplicated(list):any[]{
    if(list!==undefined){
      for(let i=0;i<list.length;i++){
        for(let j=i+1;j<list.length;j++){
          if(list[i].email === list[j].email){
            list.splice(j,1)
          }
        }
      }
    }
    return list;
  }
//scroll header function
  ngAfterViewInit() {
    var lengthHeader=document.getElementsByClassName("list-header").length -1;
    this.headerbg = document.getElementsByClassName("list-header")[lengthHeader];
    var length=document.getElementsByClassName("head-search").length -1;
    this.searchPosition = document.getElementsByClassName("head-search")[length];
  }
  scrollingFun(ev){
    ev.domWrite(() => {
        this.updateHeader(ev);
    }); 
  }
  updateHeader(ev) { 
  if (ev.scrollTop > 0) {
    this.darkHeader = ev.scrollTop / 125;
    this.renderer.setElementClass(this.searchPosition, 'sub-header', true);  
  }else  this.renderer.setElementClass(this.searchPosition, 'sub-header', false);

  this.renderer.setElementStyle(this.headerbg, 'background', 'rgba(0,172,237,' + this.darkHeader +')');
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

  ionViewDidLoad(){
    this.userProvider.getUsermail().then(myEmail=>{
      this.email = myEmail;
      this.userService.getAUser2('email',myEmail).valueChanges().subscribe(ls=>{
        this.userList = undefined
        this.me = ls[0]
        if(this.me.chat!=null){
          this.me.chat.forEach((cha,j)=>{
            this.numberOfNotSeen[j]=0;
            if(cha.ChatWith!==this.email){
    
              this.userService.getAUser2('email',cha.ChatWith).valueChanges().subscribe(u=>{
                if(this.userList2=== undefined) this.userList2 = [u[0]]; else this.userList2.push(u[0]);
              })
              this.lastMessage[j] = cha.messages[cha.messages.length-1].msg;
              for(let k=0;k<cha.messages.length;k++){
                if(cha.messages[k].seen===false){
                  this.numberOfNotSeen[j] ++;
                }
              }
              
            }
          })
        }
      })
      //console.log(myEmail)
    })
  }
  
  ionViewDidEnter(){
    //this.navCtrl.setRoot("FriendsPage");
    
  }
}