import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { UserListService } from '../../services/user.service';
import { User as UserProvider } from '../../provider/user'; 

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
  userListOff:any[]
  observeOffline: boolean = false;
  teachers: Array<any> = [];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private userService: UserListService, 
    public userProvider : UserProvider,
    public renderer: Renderer,
    public alertCtrl: AlertController
    ) {
    this.userList = this.userService.getUserList().valueChanges();

    /*window.addEventListener('offline', () => {
      //Do task when no internet connection
      //console.log("offline")
      this.userProvider.getUserList().then(list=>{
        this.userListOff = list;
        //console.log(this.userListOff)
        userProvider.getCourse().then(course=>{
          if(course !== undefined){
            //we iterate on his course
            for(let i=0;i<course.length;i++){
              //for each course, find all users that also subcribed to it.
              //if(this.userList !== undefined){
              this.observeOffline = false
              this.userListOff.forEach(user=>{
                if(user.courses !== undefined){
                  user.courses.forEach(c=>{
                    //console.log(course[i].title);
                    if(c.title === course[i].title){
                      let u:any;
                      if(user.avatar !== undefined) 
                        u={img: user.avatar.url,name: user.name,email:user.email}
                      else
                        u={img: "assets/img/user-img.png",name: user.name,email:user.email}                      
                      this.friends.push(u);
                      //console.dir(this.friends)
                    }
                  })
                }
              })
              
            }
          }
        })
      })
    });*/

    this.userProvider.getUserList().then(list=>{
      this.userListOff = list;
      //console.log(this.userListOff)
      userProvider.getCourse().then(course=>{
        if(course !== null){
          //we iterate on his course
          for(let i=0;i<course.length;i++){
            //for each course, find all users that also subcribed to it.
            //if(this.userList !== undefined){
            this.observeOffline = false
            this.userListOff.forEach(user=>{
              if(user.courses !== undefined){
                user.courses.forEach(c=>{
                  //console.log(course[i].title);
                  if(c.title === course[i].title){
                    let u:any;
                    if(user.avatar !== undefined) 
                      u={img: user.avatar.url,name: user.name,email:user.email}
                    else
                      u={img: "assets/img/user-img.png",name: user.name,email:user.email}                      
                    this.friends.push(u);
                    //console.dir(this.friends)
                  }
                })
                this.removeDuplicated(this.friends)
              }
            })
            
          }
        }
      })
    })

    //get the course of the current logged user
    userProvider.getUsermail().then(myEmail=>{
      this.userService.getAnUser('email',myEmail).valueChanges().subscribe(us=>{
        this.observeOffline = true
        this.teachers=[];
        this.friends=[];
        us.forEach(u=>{
          let course = u.courses;
          if(course !== undefined){
            //we iterate on his course
            
              if(course!==null)
              for(let i=0;i<course.length;i++){
                //for each course, find all users that also subcribed to it.
                //if(this.userList !== undefined){
                this.userList.forEach(item=>{
                  
                  
                  let userList:any[]
                  item.forEach(user=>{
                    if(userList===undefined) userList=[user]
                    else userList.push(user)
                    if(user.courses !== undefined){
                      user.courses.forEach(c=>{
                        //console.log(course[i].title);
                        if(c.title === course[i].title && user.email!==myEmail){
                          let u:any;
                          if(user.avatar !== undefined) 
                            u={img: user.avatar.url,name: user.name,email:user.email}
                          else
                            u={img: "assets/img/user-img.png",name: user.name,email:user.email}                      
                          this.friends.push(u);
                          //console.dir(this.friends)
                        }
                      })
                      this.removeDuplicated(this.friends);
                    }
                  })
                  this.userProvider.setUserList(userList)
                })
    
                this.userService.getAnUser("email",course[i].PostedBy).valueChanges(['child_added','child_removed']).subscribe(t=>{
                  
                  t.forEach(teacher=>{
                    //console.log(teacher)
                    let u:any;
                    if(teacher.email!==myEmail){
                      if(teacher.avatar !== undefined) 
                        u={img: teacher.avatar.url,name: teacher.name,email:teacher.email}
                      else
                        u={img: "assets/img/user-img.png",name: teacher.name,email:teacher.email}                      
                      this.teachers.push(u);
                    }
                    //console.dir(this.teachers)
                    this.removeDuplicated(this.teachers);
                  })
                })
              }
          }
        })
      })
      
    })
    //this.friends = [{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'}, {img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'},{img: 'assets/img/img1.png', name: 'Jasica Timberlake', email: 'Justin Timberlake@yahoo.com'}]
  }

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

  chatWith(page,friends){
    //console.log(friends);
    this.navCtrl.push(page,friends);
  }
}