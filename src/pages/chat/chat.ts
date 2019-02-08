import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content  } from 'ionic-angular';
import {UserListService} from '../../services/user.service'
import {User as UserProvider} from '../../provider/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * @description class ChatPage for ChatPage page.
 * @author : Ntepp J96n J09l
 * 
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content:Content;
  form: FormGroup;
  friendPseudo: any;
  friendAvatar: any;
  friendChat: any;
  friendEmail: any;
  friendChatLiveMsg: [{ me:boolean; msg: string; date: string; }];
  myEmail: string;
  myFriend:any
  me:any
  edit: boolean = false;
  index: number;
  showOption: boolean[] = new Array<boolean>(1000);
  numberOfMessages: number=0;
  numberOfNotSeenMessages: number=0;

  //friendChatLive: [{ ChatWith: string; messages: [{ msg: string; date: string; }]; }];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userServices: UserListService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private userProvider: UserProvider) 
    {
    this.form = this.formBuilder.group({
      comm: ['', Validators.required]
    })
  }


  /**
   * @function delMessage called when the user clicks the button 'delete message'
   * @param i the index of the message to delete
   */
  delMessage(i){
    let see=false;
    this.alertCtrl.create({
      message : 'Vous allez supprimer ce message',
      buttons : [
        {
          text: 'D\'accord!',
          handler: data => {
            this.me.chat.forEach((cha,j)=>{
              if(cha.ChatWith===this.friendEmail){
                cha.messages.splice(i,1)
                this.userServices.updateUser2(this.me)
              }
            })
            this.numberOfMessages--;
          }
        }
      ]
    }).present();
    
  }

  /**
   * @function editMessage 
   * @description this function is called whe the user click on the option 'edit message'
   * @param i the index of the message the user wants to edit
   * @param message the message to edit (it will be patched into the form)
   */
  editMessage(i:number,message){
    this.form.patchValue({comm:message});
    this.edit = true;
    this.index = i;
  }

  /**
   * @function moreOptions 
   * @description is called when the user click the more option button to see oprations to apply to messages
   * @param i the index of the message the user wants to show more option
   */
  moreOptions(i:number){
    this.showOption[i] = !this.showOption[i];
    for(let j=0;j<this.numberOfMessages;j++){
      if(j!=i)this.showOption[j]=false;
    }
  }

  /**
   * @function ionViewWillUnload
   * lifecycle of ionic view
   * when the user clicks the back button, set all messages as seen and update the db
   */
  ionViewWillUnload(){
    this.me.chat.forEach(chat=>{
      if(chat.ChatWith===this.friendEmail){
        for(let k=0;k<chat.messages.length;k++){
          if(chat.messages[k].seen===false){
            chat.messages[k].seen = true;
          }
        }
        this.userServices.updateUser2(this.me)
      }
    })
  }

  /**
   * @function ionViewDidLoad
   * @description Third function of the lifecycle of ionic view. called when the view is loaded
   */
  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChatPage');
    this.friendEmail = this.navParams.get('email')
    this.friendPseudo = this.navParams.get('name')
    this.friendChat = this.navParams.get('chat')
    this.friendAvatar = this.navParams.get('img')
    this.userProvider.getUsermail().then(myEmail=>{
      this.myEmail = myEmail;
      console.log(myEmail)
      this.userServices.getAUser2("email",this.friendEmail).valueChanges().subscribe(mee=>{
        this.myFriend = mee[0];
      })

      this.userServices.getAUser2("email",myEmail).valueChanges().subscribe(mee=>{//we get a user by his email
        this.me = mee[0];//mee is an array. But as the email is unique, we know that the result has one element
        this.numberOfMessages = 0;
        if(this.me.chat!=null){//if the user has already chat with some other user...
          this.me.chat.forEach(chat=>{//loop on his messages
            if(chat.ChatWith===this.friendEmail){//this.friendEmail is the friend you selected from page friend
              this.numberOfMessages = chat.messages.length;//get the number of messages I have exchanges this friend
              for(let i=0;i<this.numberOfMessages;i++){
                this.showOption[i]=false;//this variable is injected in the view. if false, the options of message i are hidden
              }
              this.friendChatLiveMsg = chat.messages;//variable injected in the view ngFor
              for(let k=0;k<chat.messages.length;k++){//this loop counts the number of new messages
                if(chat.messages[k].seen===false){
                  this.numberOfNotSeenMessages ++
                  //chat.messages[k].seen = true;
                }
              }
            }
          })
        }
        for(let i=0;i<this.numberOfMessages;i++){
          this.showOption[i]=false;
        }
      })


    })
  }

  /**
   * @function ionViewDidEnter
   * @description fifth function of lifecycle of ionic view
   * @description when the view is loaded we scroll to the bottom
   */
  ionViewDidEnter(){
    this.content.scrollToBottom(300);//300ms animation speed
  }

  /**
   * @function post
   * @description this function is called when the user click the button to send the message. 
   * @description It update the sender and the receiver message list.
   */
  post(formVal){
    this.form.patchValue({comm:""})
    this.userServices.getAUser2("email",this.friendEmail).valueChanges().toPromise().then(users=>{
      console.log(users)
    })

    //update my friend
    if(this.myFriend.chat!=null){
      let test=false;
      this.myFriend.chat.forEach(chat=>{
        if(chat.ChatWith===this.myEmail){
          test=true;
          if(!this.edit){
            chat.messages.push({
              seen:false,
              me:false,
              date:new Date().toString().split(" GMT")[0],
              msg:formVal.comm
            })
          }else{
            chat.messages[this.index].msg=formVal.comm
          }
          this.userServices.updateUser2(this.myFriend)
        }
      })
      if(!test){//if it is the first chat we have...
        this.myFriend.chat.push({
          "ChatWith":this.myEmail,//the email of the person he messages
          "messages":[{
            seen:false,
            me:false,
            date:new Date().toString().split(" GMT")[0],
            msg:formVal.comm
          }]
        })
        this.userServices.updateUser2(this.myFriend)
      }
    }else{
      this.myFriend["chat"]=[
        {
          "ChatWith":this.myEmail,//the email of the person he messages
          "messages":[{
            seen:false,
            me:false,
            date:new Date().toString().split(" GMT")[0],
            msg:formVal.comm
          }]
        }
      ]
      this.userServices.updateUser2(this.myFriend)
    }

    //update me
    if(this.me.chat!=null){
      let see=false;
      this.me.chat.forEach(chat=>{
        if(chat.ChatWith===this.friendEmail){
          see=true;
          if(!this.edit){
            chat.messages.push({
              seen:true,
              me:true,
              date:new Date().toString().split(" GMT")[0],
              msg:formVal.comm
            })
            this.numberOfMessages++
            this.showOption[this.numberOfMessages-1]=false;
          }else{
            chat.messages[this.index].msg=formVal.comm
          }
          this.userServices.updateUser2(this.me)
        }
      })
      if(!see){
        this.me.chat.push({
          "ChatWith":this.friendEmail,//the email of the person he messages
          "messages":[{
            seen:true,
            me:true,
            date:new Date().toString().split(" GMT")[0],
            msg:formVal.comm
          }]
        })
        this.numberOfMessages++
        this.showOption[this.numberOfMessages-1]=false;
        this.userServices.updateUser2(this.me)
      }
    }else{
      this.me["chat"]=[
        {
            "ChatWith":this.friendEmail,//the email of the person he messages
            "messages":[{
              seen:true,
              me:true,
              date:new Date().toString().split(" GMT")[0],
              msg:formVal.comm
            }]
        }
      ]
      this.numberOfMessages++
      this.userServices.updateUser2(this.me)
    }
    this.edit = false;
    this.content.scrollToBottom(300);//300ms animation speed
  }
}
