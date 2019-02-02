import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserListService} from '../../services/user.service'
import {User as UserProvider} from '../../provider/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  form: FormGroup;
  friendPseudo: any;
  friendAvatar: any;
  friendChat: any;
  friendEmail: any;
  friendChatLiveMsg: [{ me:boolean; msg: string; date: string; }];
  myEmail: string;
  longPress: boolean = false;
  //friendChatLive: [{ ChatWith: string; messages: [{ msg: string; date: string; }]; }];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userServices: UserListService,
    private formBuilder: FormBuilder,
    private userProvider: UserProvider,
    private notification: NotificationService) 
    {
    this.form = this.formBuilder.group({
      comm: ['', Validators.required]
    })

    this.friendEmail = this.navParams.get('email')
    this.friendPseudo = this.navParams.get('name')
    this.friendChat = this.navParams.get('chat')
    this.friendAvatar = this.navParams.get('img')

    this.userProvider.getUsermail().then(myEmail=>{
      this.myEmail = myEmail;
      this.userServices.getAnUser("email",this.friendEmail).valueChanges().subscribe(mee=>{
        mee.forEach(me=>{
          if(me.chat!==undefined){
            me.chat.forEach(chat=>{
              if(chat.ChatWith===myEmail){
                this.friendChatLiveMsg = chat.messages; 
              }
            })
          }
        })
      })
    })
  }

  release(){
    this.longPress = true;
  }

  delMessage(message){
    this.userServices.getAnUser("email",this.friendEmail).valueChanges(['child_added','child_removed']).subscribe(friends=>{
      friends.forEach(friend=>{
        let see=false;
        friend.chat.forEach(chat=>{
          if(chat.ChatWith===this.myEmail){
            see=true;
            //find the message to delete
            chat.messages.forEach((msg,i)=>{
              if(msg===message) chat.messages.splice(i,1);
            })
            this.userServices.updateUser(friend)
          }
        })
      })
    })

    this.userServices.getAnUser("email",this.myEmail).valueChanges(['child_added','child_removed']).subscribe(mes=>{
      mes.forEach(me=>{
          let see=false;
          me.chat.forEach(chat=>{
            if(chat.ChatWith===this.friendEmail){
              see=true;
              chat.messages.forEach((msg,i)=>{
                if(msg===message) chat.messages.splice(i,1);
              })
              this.userServices.updateUser(me)
            }
          })
      })
    })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChatPage');
  }

  post(formVal){
    this.form.patchValue({comm:""})

    this.userServices.getAnUser("email",this.friendEmail).valueChanges(['child_added','child_removed']).subscribe(friends=>{
      friends.forEach(friend=>{
        if(friend.chat!==undefined){
          let see=false;
          friend.chat.forEach(chat=>{
            if(chat.ChatWith===this.myEmail){
              see=true;
              chat.messages.push({
                me:false,
                date:new Date().toString().split(" GMT")[0],
                msg:formVal.comm
              })
              this.userServices.updateUser(friend)
            }
          })
          if(!see){
            friend.chat.push({
              "ChatWith":this.myEmail,//the email of the person he messages
              "messages":[{
                me:false,
                date:new Date().toString().split(" GMT")[0],
                msg:formVal.comm
              }]
            })
            this.userServices.updateUser(friend)
          }
        }else{
          friend["chat"]=[
            {
                "ChatWith":this.myEmail,//the email of the person he messages
                "messages":[{
                  me:false,
                  date:new Date().toString().split(" GMT")[0],
                  msg:formVal.comm
                }]
            }
          ]
          this.userServices.updateUser(friend)
        }
      })
    })

    this.userServices.getAnUser("email",this.myEmail).valueChanges(['child_added','child_removed']).subscribe(mes=>{
      mes.forEach(me=>{
        if(me.chat!==undefined){
          let see=false;
          me.chat.forEach(chat=>{
            if(chat.ChatWith===this.friendEmail){
              see=true;
              chat.messages.push({
                me:true,
                date:new Date().toString().split(" GMT")[0],
                msg:formVal.comm
              })
              this.userServices.updateUser(me).then(()=>{
                this.notification.sendNotification(null,this.friendEmail,this.myEmail,"Une message: "+formVal.comm)
              })
            }
          })
          if(!see){
            me.chat.push({
              "ChatWith":this.friendEmail,//the email of the person he messages
              "messages":[{
                me:true,
                date:new Date().toString().split(" GMT")[0],
                msg:formVal.comm
              }]
            })
            this.userServices.updateUser(me).then(()=>{
              this.notification.sendNotification(null,this.friendEmail,this.myEmail,"Une message: "+formVal.comm)
            })
          }
        }else{
          me["chat"]=[
            {
                "ChatWith":this.friendEmail,//the email of the person he messages
                "messages":[{
                  me:true,
                  date:new Date().toString().split(" GMT")[0],
                  msg:formVal.comm
                }]
            }
          ]
          this.userServices.updateUser(me)
        }
      })
    })
  }
}
