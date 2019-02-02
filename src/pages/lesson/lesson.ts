import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, AlertController } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {User} from '../../provider/user';
import {UserListService} from '../../services/user.service';

@IonicPage()
@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',
})
export class LessonPage {
  Qiz: Array<any>;
  leconTitle;
  description;
  material;
  quizz;
  downloaded=false;
  chapterName;
  pfmName;
  teacher;
  associateProf;
 
  fileTransfer: FileTransferObject = this.transfer.create()
 /*
  // Upload a file:
  fileTransfer.upload(..).then(..).catch(..);

  // Download a file:
  fileTransfer.download(..).then(..).catch(..);

  // Abort active transfer:
  fileTransfer.abort();*/
  @Input('progress') progress;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public user: User,
    public userService: UserListService,
    public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController,
    private transfer: FileTransfer, private file: File
  ) {
    this.Qiz = [{id: '1', img: 'assets/img/pic1.png', answer: "l'enfant"}, {id: '2', img: 'assets/img/pic2.png', answer: "l'homme"}, {id: '3', img: 'assets/img/pic3.png', answer: "le garçon"},{id: '4', img: 'assets/img/pic4.png', answer: "la fille"}]

    this.progress = 10;
    this.leconTitle = this.navParams.get('leconTitle');
    this.description = this.navParams.get('description');
    this.material = this.navParams.get('material');
    this.quizz = this.navParams.get('quizz')

    this.chapterName = this.navParams.get('chapterName')
    this.teacher = this.navParams.get('teacher');
    this.associateProf = this.navParams.get('associateProf');
    this.pfmName = this.navParams.get('pfmName')
  }

  isDownloaded(name,type,file){
    //if(this.platform.is('android')){
      //this.download(name,type,file)
    //}else{
      let exerciseName = name
      var test = false;
      this.downloaded = !this.downloaded;
      this.user.getUsermail().then(email=>{
        this.userService.getAnUser('email',email).valueChanges(['child_added']).subscribe(users=>{
          users.forEach((user)=>{
            let homework:{
              done: boolean,
              seen: boolean;
              file:{
                  name:string;
                  type:string;
                  content : string;
              },
              note:number,
              teacher:string,
              associateProf:[
                {
                    email:string;
                }
              ],
              submitionDate: string,
              pfmName:string,
              chapterName: string,
              leconName:string,
              exerciseName:string,
              comments:[
                {
                    date: string;
                    author: string;
                    message:string
                }
              ]
              studentComment:string,
              teacherComment:string
            }={
              done:false,
              seen:false,
              file:{name:"",type:"",content:""},
              note:-10,
              teacher:this.teacher,
              associateProf:this.associateProf,
              submitionDate:new Date().toString(),
              pfmName:this.pfmName,
              chapterName:this.chapterName,
              leconName:this.leconTitle,
              exerciseName:exerciseName,
              comments:[{date:'',author:'',message:''}],
              teacherComment:'',
              studentComment:''
            }
            
            if(user.homeworks !== undefined){
              user.homeworks.forEach(work=>{
                if(work.pfmName===homework.pfmName && 
                  work.chapterName===homework.chapterName && 
                  work.leconName===homework.leconName &&
                  work.exerciseName===homework.exerciseName){
                    test = true;
                  }
              })
              if(!test){  
                user.homeworks.push(homework)
                this.userService.updateUser(user);
              }else{
                this.toastCtrl.create({
                  message: "Vous avez déjà téléchargé ce fichier. ",
                  duration: 3000,
                  position: 'middle'
                }).present()
              }
            }else{
              user.homeworks = [homework]
              this.userService.updateUser(user);
            }
            if(!test){
              this.alertCtrl.create({
                message:"Une fois terminé rendez-vous dans le menu 'Mes travaux' pour soumettre votre travail!!",
                buttons:[
                  {
                    text: 'J\'ai compris',
                    handler: data => {
                      //console.log('Cancel clicked '+data);
                    }
                  }
                ]
              }).present()
            }
          })
        })
      })
    //}
  }

  downloadLecon(name,type,file){
    if(this.platform.is("android")){
      this.download(name,type,file)
    }
  }

  download(name,type,file) {
    const url = file.content;
    this.fileTransfer.download(url, this.file.dataDirectory + name+type).then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
  }

}