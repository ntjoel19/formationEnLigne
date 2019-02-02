import { Component,ViewChild, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { Nav, IonicPage, AlertController, NavController, ViewController, ToastController, NavParams, Slides, Content, Platform, Loading, ActionSheetController, Button } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {FileChooser} from '@ionic-native/file-chooser'
import { Base64 } from '@ionic-native/base64';
declare var cordova: any;

import { Course } from '../../models/course.model'
import { User as userModel } from '../../models/user.model'
import { CourseListService } from '../../services/course.service'
import { UserListService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User} from '../../provider/user';

import firebase from 'firebase';
import { DataProvider } from '../../providers/data/data';
import { AngularFireUploadTask } from 'angularfire2/storage';
import { NotificationService } from '../../services/notification.service';
import { CourseProvider } from '../../providers/course/course';

/**
 * Generated class for the ClassManagementPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-management',
  templateUrl: 'course-management.html'
})
export class CourseManagementPage {
  @ViewChild('fileInput') fileInput;
  @ViewChild('mySlider') slider: Slides;
  @ViewChild(Content) content: Content;
  @ViewChild(Nav) nav: Nav;
  
  edit = false;
  section : boolean[] = [false,false,false,false, false,false];
  slides: any;
  imagePath="";
  tabs: any = '0';
  chapterTemplateForm : string;

  //public users: FirebaseListObservable<any[]>;

  isReadyToSave: boolean;
  item: any;
  task: AngularFireUploadTask;

  progress: any;  // Observable 0 to 100
  lastImage: string = null;
  loading: Loading;
  authorisation : boolean = true;
  image: string=''; // base64
  downloadURL;
  form1: FormGroup;
  form: FormGroup;

  public date = new Date();
  public convertedDate = '';

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

  matos = [{
    name:"",
    type:"",
    content: ""
  }]
  lessons = [{
    title:"",
    description:'',
    material : this.matos
  }]
  chapter = [{
    title:'',
    duration:'',
    description:'',
    lessons:this.lessons
  }]
  courses: Course = { 
    key:'',
    descriptImage:"",
    authorisation:false,
    PostedBy:'',
    title : '',
    subtitle : '',
    description: '',
    teacher : '',
    associateProf:null,
    post_date: '',
    duration : '',
    startDate:'',
    numberOfStudents : 0,
    chapter : null
  };
  fileToUpload:[
    {
      type: string;
      text: string;
      node:string;
      index1:number;
      index2:number;
      fatherIndex:number
    }
  ]
  ref:[
    {
      created:string;
      fullPath: string;
      contentType: string;
      key:string;
      url: string;
    }
  ]
  headerbg: any;
  darkHeader: any;
  searchPosition: any;

  selectOptions;
  currencyList:any[];


  //courseList : AngularFireList<any>;
  //courseList : Observable<Course[]>;
  observeOffline:boolean = false;
  teacherList : Observable<userModel[]>
  imageForView: string="";
  offlineCourseList: any[];
  onlineCourseList:any[];
  plateformSetup: string;
  teacherListTable: any;
  tableSelect:boolean[];

  constructor(public navCtrl: NavController, 
    public viewCtrl: ViewController, 
    public navPar: NavParams,
    public alertCtrl: AlertController,
    public renderer: Renderer,
    public formBuilder: FormBuilder, 
    public camera: Camera,
    public platform: Platform,
    public datePipe: DatePipe,
    private base64 : Base64,
    public user: User,
    public fileChooser: FileChooser,
    
    public toasCtrl: ToastController,
    public courseListService: CourseListService,
    public userService : UserListService,
    public filePath:FilePath,
    public dataProvider: DataProvider,
    public notificationService:NotificationService,
    public toastCtrl : ToastController, 
    public actionSheetCtrl : ActionSheetController,
    public courseProvider : CourseProvider,
    public file: File
  ) {
    //let val;
    /*window.addEventListener('offline', () => {
      //Do task when no internet connection
      this.courseProvider.getCourseList().then(coursList=>{
        this.observeOffline = false;
        this.offlineCourseList = coursList;
        //console.log(coursList)
      })
    });*/
    this.courseProvider.getCourseList().then(coursList=>{
      this.observeOffline = false;
      this.offlineCourseList = coursList;
    })
    
    if (this.platform.is('android')){
      this.plateformSetup = "android";
    }else{
      this.plateformSetup = "notAndroid";
    }
    //console.log("the platform is ",this.plateformSetup);

    this.courseListService.getCourseList().valueChanges(['child_added','child_removed']).subscribe(list=>{
      this.observeOffline = true;
      this.onlineCourseList = undefined;
      list.forEach(c=>{
        if(this.onlineCourseList === undefined){
          this.onlineCourseList = [c]
        }else{
          this.onlineCourseList.push(c);
        }
      })
      this.courseProvider.setCourseList(this.onlineCourseList);
    })
    this.teacherList = this.userService.getAnUser('status','Formateur').valueChanges(['child_added','child_removed']);
    this.teacherList.subscribe(teach=>{
      this.teacherListTable = undefined;
      teach.forEach(t=>{
        if(this.teacherListTable !== undefined){
          this.teacherListTable.push(t)
        }else{
          this.teacherListTable = [t]
        }
      })
      this.tableSelect=new Array(this.teacherListTable.length);
      for(let i=0;i<this.tableSelect.length;i++) this.tableSelect[i]=false;
    })

    this.myPhotosRef = firebase.storage().ref('/image_course/');
    
    //this.convertedDate = datePipe.transform(this.date, 'dd-MM-yyyy hh:mm:ss a','en-US')
    ////console.log(this.convertedDate);
    this.courses.post_date =  new Date().toString().split(" GMT")[0];
    this.user.getUsermail().then(email=>{
      this.courses.PostedBy = email;
    })
    this.form = this.formBuilder.group({
      profilePic: new FormControl(''),
      key:'',
      descriptImage: new FormControl('',Validators.required),
      PostedBy:new FormControl('',Validators.required),
      authorisation: new FormControl('',Validators.required),
      teacher:new FormControl(this.courses.teacher),
      associateProf: new FormControl(this.courses.associateProf, Validators.required),
      title: new FormControl(this.courses.title, Validators.required),
      subtitle: new FormControl(this.courses.subtitle, Validators.required),
      startDate:new FormControl(this.courses.startDate, Validators.required),
      duration:new FormControl(this.courses.duration, Validators.required),
      description : new FormControl(this.courses.description, Validators.required),
      chapter : this.formBuilder.array([
        this.initChapterFields()
      ])
    })
    
    //Add class
    this.selectOptions = {
      cssClass : 'course-popover'
    };

    this.currencyList = [
      'pdf',
      'word',
      'powerpoint',
      'video',
      'image',
      'excel'
    ];
  }

  /**
    * Generates a FormGroup object with input field validation rules for
    * the technologies form object
    *
    * @public
    * @method initTechnologyFields
    * @return {FormGroup}
    */
  initChapterFields() : FormGroup
  {
    let form =  this.formBuilder.group({
      name : '',
      durationChap : '',
      description: '',
      lecon : this.formBuilder.array([
        this.initLeconFields()
      ])
    });
    return form;
  }

  initLeconFields() : FormGroup
  {
    return this.formBuilder.group({
      leconTitle : '',
      description: '',
      material: this.formBuilder.array([
        this.initMaterialFields()
      ]),
      quizz: this.formBuilder.array([
        this.initQuizzFields()
      ])
    });
  }

  initMaterialFields() : FormGroup
  {
    return this.formBuilder.group({
      name : '',
      type : '',
      content : ''
    });
  }

  initQuizzFields() : FormGroup
  {
    return this.formBuilder.group({
      name : '',
      type : '',
      content : ''
    });
  }

   /**
    * Programmatically generates a new technology input field
    * @public
    * @method addNewInputField
    * @return {none}
    */
    addNewInputField() : void
    {
      const control = <FormArray>this.form.controls.chapter;
      control.push(this.initChapterFields());
    }

    addNewLeconInputField(i : number,p) : void
    {
      this.toggleSection(p,true)
      const control =(<FormArray>(<FormGroup>(<FormArray>this.form.controls.chapter).at(i)).controls.lecon)
      control.push(this.initLeconFields());
    }
   
    addNewFileInputField(i : number, j:number,p) : void
    {
      this.toggleSection(p,true)
      const control =(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.form.controls.chapter).at(i)).controls.lecon).at(j)).controls.material)
     
      control.push(this.initMaterialFields());
    }

    addNewQuizzInputField(i : number, j:number,p) : void
    {
      this.toggleSection(p,true)
      const control =(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.form.controls.chapter).at(i)).controls.lecon).at(j)).controls.quizz)
     
      control.push(this.initQuizzFields());
    }

   /**
    * Programmatically removes a recently generated chapter input field
    *
    * @public
    * @method removeInputField
    * @param i    {number}      The position of the object in the array that needs to removed
    * @return {none}
    */
    removeInputField(j : number) : void
    {
        if(this.fileToUpload!=undefined){
          for(let i=0;i<this.fileToUpload.length;i++){
            if(this.fileToUpload[i].fatherIndex==i)
              this.fileToUpload.splice(i,1);
          }
        }
        const control = <FormArray>this.form.controls.chapter
        control.removeAt(j);
    }
    
    removeLeconInputField(i: number, j : number) : void
    {
        if(this.fileToUpload!=undefined){
          for(let i=0;i<this.fileToUpload.length;i++){
            if(this.fileToUpload[i].fatherIndex==i && this.fileToUpload[i].index2==j)
              this.fileToUpload.splice(i,1);
          }
        }
        const control = (<FormArray>(<FormGroup>(<FormArray>this.form.controls.chapter).at(i)).controls.lecon)
        control.removeAt(j);
    }

    removeFileInputField(i: number, j : number, k:number) : void
    {
      if(this.fileToUpload!=undefined){
        for(let i=0;i<this.fileToUpload.length;i++){
          if(this.fileToUpload[i].fatherIndex==i && this.fileToUpload[i].index2==j && this.fileToUpload[i].index1==k)
            this.fileToUpload.splice(i,1);
        }
      }
      const control =(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.form.controls.chapter).at(i)).controls.lecon).at(j)).controls.material)
      control.removeAt(k);
    }

    removeQuizzInputField(i: number, j : number, k:number) : void
    {
      const control =(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.form.controls.chapter).at(i)).controls.lecon).at(j)).controls.quizz)
      control.removeAt(k);
    }

    selectFile(node,indexSon,indexFather,indexChap){
      let file;
      let reader = new FileReader();
      reader.onload = ((readerEvent) => {

        let objData = (readerEvent.target as any).result;
        //console.log(objData)
        this.filePath.resolveNativePath(objData.toString().split(",")[1]).then((fileentry) => {
          let filename = this.getfilename(fileentry);
          let fileext = this.getfileext(fileentry);
          //console.dir("file path: ",fileentry)
          if(fileext == "pdf"){
            this.makeFileIntoBlob(fileentry, fileext,"application/pdf").then((fileblob) => {
              file={
                blob : fileblob,
                type: "application/pdf",
                fileext: fileext,
                filename: filename
              }
              this.imageForView = fileentry;
              this.imagePath = file.blob
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
          })
          }if(fileext == "docx"){
            this.makeFileIntoBlob(fileentry, fileext,"application/vnd.openxmlformats-officedocument.wordprocessingml.document").then((fileblob) => {
            file={
                blob : fileblob,
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                fileext: fileext,
                filename: filename
              }
              this.imageForView = fileentry;
              this.imagePath = file.blob
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
            })
          }if(fileext == "doc"){
            this.makeFileIntoBlob(fileentry, fileext,"application/msword").then((fileblob) => {
              file={
                  blob : fileblob,
                type: "application/msword",
                fileext: fileext,
                filename: filename
              }
              this.imageForView = fileentry;
              this.imagePath = file.blob
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
            })
          }if(fileext == "epub"){
            this.makeFileIntoBlob(fileentry, fileext,"application/octet-stream").then((fileblob) => {
            file={
                  blob : fileblob,
                type: "application/octet-stream",
                fileext: fileext,
                filename: filename
              }
              this.imageForView = fileentry;
              this.imagePath = file.blob
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
            })
          }if(fileext == "accdb"){
            this.makeFileIntoBlob(fileentry, filename,"application/msaccess").then((fileblob) => {
            file={
                  blob : fileblob,
                type: "application/msaccess",
                fileext: fileext,
                filename: filename
              }
              this.imageForView = fileentry;
              this.imagePath = file.blob
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
            })
          }if(fileext == "xlsx"){
            this.makeFileIntoBlob(fileentry, filename,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then((fileblob) => {
            file={
                  blob : fileblob,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileext: fileext,
                filename: filename
              }
              this.imageForView = fileentry;
              this.imagePath = file.blob
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:file.fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
            })
          }            
        })
        //this.form.patchValue({ 'profilePic': imageData });
      });
    }

  gotoFilePage(file){
    cordova.InAppBrowser.open(file,"_system", "location=yes");
  }
    
  makeFileIntoBlob(_imagePath, name, type) {
    
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      window['resolveLocalFileSystemURL'](_imagePath, (fileEntry) => {
  
        fileEntry.file((resFile) => {
  
          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: type });
            imgBlob.name = name;
            resolve(imgBlob);
          };
  
          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };
  
          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }
      
  getfilename(filestring){
    let file 
    file = filestring.replace(/^.*[\\\/]/, '')
    return file;
  }

  getfilePath(filestring){
    let file 
    file = filestring.substr(0, filestring.lastIndexOf('/') + 1);
    return file;
  }
      
  getfileext(filestring){
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
  }

  /*
  getRequestFiles(sbaid): any {
    return this.sbaList.child('sbafiles');
  }*/
    
  addAssignmentFile(file:any, folder):any{
    let downloadURL
    let task = this.dataProvider.uploadToStorage(file.blob,folder,file.fileext);
    //let progress = task.percentageChanges();
    task.then(task=>{
      downloadURL = task.downloadURL
    })
    task.then().then(res=>{
      this.dataProvider.storeInfoToDatabase(res.metadata,downloadURL)
      //this.user.avatar = ref
      this.toastCtrl.create({
        message: 'New file added!!',
        duration : 3000
      }).present()
    })
  }

  uploadInformation(text,ext,course,node,indexSon,indexFather,i){
    let wait = false;
    this.dataProvider.uploadToStorage(text,'course_files',ext).then(promise=>{

      promise.ref.getDownloadURL().then(url=>{
        this.downloadURL = url
        let ref = this.dataProvider.storeInfoToDatabase(promise.metadata,url)
        if(node==="descriptImage"){
          course.descriptImage = url;
          this.courses.descriptImage = url;
          this.courseListService.updateCourse(course,true)
        }else{
          /*let tmp = {
            name:ref.fullPath,
            type:ext,
            content : url,
          }*/
          if(node==='quizz'){
            if(course.chapter[i].lecon[indexFather].quizz[indexSon]!==undefined)
              course.chapter[indexFather].lecon[indexSon].quizz[i].content = url
          }else{
            if(course.chapter[i].lecon[indexFather].material[indexSon]!==undefined)
              course.chapter[i].lecon[indexFather].material[indexSon].content = url
          }
          this.courseListService.updateCourse(course,true)
        }

        if(this.ref==null){
          this.ref=[ref]
        }else{
          this.ref.push(ref);
        }
        //this.user.avatar = ref
        this.toastCtrl.create({
          message: 'New file added!!',
          duration : 3000
        }).present()
      });
    });
    
  }

  public presentActionSheet(ext,node,indexSon,indexFather,indexChap) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,ext,node,indexSon,indexFather,indexChap);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA,ext,node,indexSon,indexFather,indexChap);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public presentActionSheet2(ext,node,indexSon,indexFather,indexChap) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select a file',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            if(this.platform.is('android')){
              //console.log("android plateform");
              this.loadFile(node,indexSon,indexFather,indexChap)
            }else{
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,ext,node,indexSon,indexFather,indexChap);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public loadFile(node,indexSon,indexFather,indexChap){
    this.fileChooser.open().then(url=>{
      this.filePath.resolveNativePath(url)
        .then(filePath => {
          //console.log("fie path ",filePath)
          let fileext = this.getfileext(filePath);
          //console.log("file ext = ",fileext)
          //let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          //let currentName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?'));
          this.base64.encodeFile(filePath).then(file=>{
            this.image = 'data:image/jpeg;base64,'+ file.split(",")[1];
            this.imageForView = filePath;
            this.imagePath = file.split(",")[1];
            if(this.fileToUpload==null){
              this.fileToUpload = [{type:fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
            }else{
              this.fileToUpload.push({type:fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
            }
          })
        }).catch(err=>{
          //console.dir(err)
        })
    })
  }

  public takePicture(sourceType,ext,node,indexSon,indexFather,indexChap) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.plateformSetup = "android";
            let fileext = this.getfileext(filePath);
            //let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            //let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            //console.dir("file path: ",filePath)

            this.base64.encodeFile(imagePath).then(file=>{
              this.image = 'data:image/jpeg;base64,'+ file.split(",")[1];
              this.imageForView = filePath;
              this.imagePath = file.split(",")[1];
              if(this.fileToUpload==null){
                this.fileToUpload = [{type:fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
              }else{
                this.fileToUpload.push({type:fileext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
              }
            })
          });
      } else {
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.plateformSetup = "notAndroid";
        this.image = 'data:image/jpeg;base64,' + imagePath
        this.imagePath = imagePath
        if(this.fileToUpload==null){
          this.fileToUpload = [{type:ext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap}]
        }else{
          this.fileToUpload.push({type:ext,text:this.imagePath,node:node,index1:indexSon,index2:indexFather,fatherIndex:indexChap})
        }
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      //console.log(err)
      let text = 'Error while selecting image '+err.toString();
      this.presentToast(text);
    });
  }

 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
  /**
  * Receive the submitted form data
  *
  * @public
  * @method manage
  * @param val    {object}      The posted form data
  * @return {none}
  */
  manage(val : any) : void
  {
    this.done(val)
  }

  ionViewDidLoad() {

  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  authorize(){
    this.authorisation = ! this.authorisation;
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done(val) {
    //if (!this.form.valid) { return; }
    this.courses.title = val.title;
    this.courses.authorisation = this.authorisation;
    this.courses.subtitle = "PFM "+val.subtitle;
    this.courses.teacher = val.teacher;
    this.courses.post_date = new Date().toString().split(" GMT")[0];
    this.courses.duration = val.duration;
    this.courses.startDate = val.startDate
    this.courses.numberOfStudents = 0;
    this.courses.description = val.description;
    this.courses.startDate = val.startDate
    this.courses.chapter = val.chapter;
    this.courses.key = val.key;
    this.authorisation = val.authorisation;
    //this.courses.PostedBy = this.email;
    //console.log(this.courses.descriptImage,this.imagePath)
    if(val.associateProf!==null){
      let profList:[
        {email:string}
      ]=[{"email":val.associateProf[0]}]
      for(let k=1;k<val.associateProf.length;k++){
        profList.push({"email":val.associateProf[k]});
      }
      this.courses.associateProf = profList;
    }
    if(!this.edit){ 
      this.addCourse(this.courses)
    }else{
      this.updateCourse(this.courses)
    }
    //this.viewCtrl.dismiss(this.form.value);
  }

  // for tab to nextslide
  selectTab(index) {
    this.slider.slideTo(index);
    this.content.scrollToTop();
  }

  // for changeWillSlide
  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
    setTimeout(()=>{
      this.content.scrollToTop();
    },200)
  }

  // for next slide
  goToslideNext(){
    this.slider.slideNext();
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
   * before sending the form to database, set the extnesions of files to u
   * @param course The course to save to databse
   */
  setFilesExtension(course){

    for(let l=0;l<this.fileToUpload.length;l++){
      if(this.fileToUpload[l].node === "descriptImage"){
        this.uploadInformation(
          this.fileToUpload[l].text,
          '.jpg',
          course,this.fileToUpload[l].node,
          this.fileToUpload[l].index1,this.fileToUpload[l].index2,
          this.fileToUpload[l].fatherIndex
        )
      }else if(this.fileToUpload[l].node === "materials"){
        this.uploadInformation(
          this.fileToUpload[l].text,
          course.chapter[this.fileToUpload[l].fatherIndex].lecon[this.fileToUpload[l].index2].material[this.fileToUpload[l].index1].type,
          course,this.fileToUpload[l].node,
          this.fileToUpload[l].index1,this.fileToUpload[l].index2,
          this.fileToUpload[l].fatherIndex
        )
      }else{
        this.uploadInformation(
          this.fileToUpload[l].text,
          course.chapter[this.fileToUpload[l].fatherIndex].lecon[this.fileToUpload[l].index2].quizz[this.fileToUpload[l].index1].type,
          course,this.fileToUpload[l].node,
          this.fileToUpload[l].index1,this.fileToUpload[l].index2,
          this.fileToUpload[l].fatherIndex
        )
      }
    }
    //console.log(course.chapter,this.fileToUpload);  
  }

  /**
   * This function process the form data ans save the course into db
   * @param course The course to save to database
   */
  addCourse(course){
    let test = false;
    if(this.onlineCourseList!==undefined){
      this.onlineCourseList.forEach(c=>{
        if(c.subtitle === course.subtitle){
          test = true;
        }
      })
    }
    if(!test){
      this.courseListService.addCourse(course).then(good=>{
        this.section[0]=this.section[1]=this.section[2]=this.section[3]=false
        if(this.fileToUpload!==undefined){ 
          this.setFilesExtension(course)
        }
        
        let toast = this.toasCtrl.create({
          message : 'Cours ajouté avec succès!',
          duration: 3000,
          position : 'top'
        })
        toast.present();
      },err=>{
        let toast = this.toasCtrl.create({
          message : err,
          duration: 3000,
          position : 'top'
        })
        toast.present();
        this.navCtrl.push('CourseManagementPage');
      })
    }else{
      this.alertCtrl.create({
        title: "Attention!",
        message: "Un PFM a déjà été publié avec ce numéro : '"+course.title+"'. En continuant vous remplacez l'ancien PFM",
        buttons:[
          {
            text: 'Annuler',
            handler: data => {
              //console.log('Cancel clicked '+data);
            }
          },
          {
            text: 'Continuer',
            handler:data=>{
              this.courseListService.addCourse(course).then(good=>{
                this.section[0]=this.section[1]=this.section[2]=this.section[3]=false
                if(this.fileToUpload!==undefined){ 
                  this.setFilesExtension(course)
                }
                
                let toast = this.toasCtrl.create({
                  message : 'Cours ajouté avec succès!',
                  duration: 3000,
                  position : 'top'
                })
                toast.present();
              },err=>{
                let toast = this.toasCtrl.create({
                  message : err,
                  duration: 3000,
                  position : 'top'
                })
                toast.present();
                this.navCtrl.setRoot('CourseManagementPage');
              })
            }
          }
        ]
      }).present()
    }
  }

  updateCourse(course){
    //console.log("course to update = ",course)
    this.section[0]=this.section[1]=this.section[2]=this.section[3]=false
    this.courseListService.updateCourse(course,true).then(()=>{
      if(this.fileToUpload !== undefined){
        this.setFilesExtension(course)
      }
      this.toasCtrl.create({
        message : 'Cours Mis à jour avec succès!',
        duration: 3000,
        position : 'top'
      }).present();
    },err=>{
      this.toasCtrl.create({
        message : err,
        duration: 3000,
        position : 'top'
      }).present();
    })
    this.navCtrl.setRoot('CourseManagementPage');
  }

  editCourse(val){
    this.user.getUsermail().then(email=>{
      if(email === val.PostedBy){
        this.editCourseTrue(val);
      }else{
        this.alertCtrl.create({
          title: 'Attention?',
          message : 'Vous ne pouvez pas modifier ce cours car vous n\'en êtes pas le publicateur.' ,
          buttons: [
            {
              text: 'Okay',
              handler: data => {
               this.notificationService.sendNotification(null,val.PostedBy,email,"Demande de modification de "+val.subtitle+ ' par '+ email)
              }
            }
          ]
        }).present();
      }
    })
  }

  editCourseTrue(val){
    this.courses.title = val.title;
    this.courses.subtitle = val.subtitle.split(" ")[1];
    this.courses.description = val.description;
    this.courses.teacher = val.teacher;
    this.courses.post_date = val.post
    this.courses.startDate = val.startDate
    this.courses.duration = val.duration;
    this.courses.numberOfStudents = val.numberOfStudents;
    this.courses.chapter = val.chapter;
    this.courses.key = val.key;
    this.authorisation = val.authorisation;
    this.courses.authorisation = val.authorisation;
    this.courses.descriptImage = val.descriptImage;
    this.courses.PostedBy = val.PostedBy;
    //console.log("form data = ",this.courses,this.fileToUpload)
    console.log(this.courses.startDate,val.duration)
    let profList:[
      {email:string}
    ]=[{"email":val.associateProf[0].email}]
    for(let k=1;k<val.associateProf.length;k++){
      profList.push({"email":val.associateProf[k].email});
    }
    
    this.courses.associateProf = profList;
    
    for(let i=0;i<this.tableSelect.length;i++){
      for(let k=0;k<val.associateProf.length;k++){
        if(profList[k].email===this.teacherListTable[i].email){
          this.tableSelect[i]=true;
        }
      }
    }
    
    this.form.patchValue(this.courses);
    
    if(val.chapter !== undefined){
      for(let i=0;i<val.chapter.length;i++){
        if(val.chapter[i].lecon !== undefined){
          for(let j=0;j<val.chapter[i].lecon.length;j++){
            if(val.chapter[i].lecon[j].material !== undefined){
              for(let k=0;k<val.chapter[i].lecon[j].material[k].length;k++){
                if(this.fileToUpload === undefined)
                  this.fileToUpload.push({"type":val.chapter[i].lecon[j].material[k].type,"text":val.chapter[i].lecon[j].material[k].content,
                  "node":"material","index1":k,"index2":j,"fatherIndex":i});
                else
                  this.fileToUpload = [{"type":val.chapter[i].lecon[j].material[k].type,"text":val.chapter[i].lecon[j].material[k].content,
                  "node":"material","index1":k,"index2":j,"fatherIndex":i}];
              }
            }
            if(val.chapter[i].lecon.quizz !== undefined){
              for(let k=0;k<val.chapter[i].lecon[j].quizz[k].length;k++){
                if(this.fileToUpload === undefined)
                  this.fileToUpload.push({"type":val.chapter[i].lecon[j].material[k].type,"text":val.chapter[i].lecon[j].material[k].content,
                  "node":"quizz","index1":k,"index2":j,"fatherIndex":i});
                else
                  this.fileToUpload = [{"type":val.chapter[i].lecon[j].material[k].type,"text":val.chapter[i].lecon[j].material[k].content,
                  "node":"quizz","index1":k,"index2":j,"fatherIndex":i}];
              }
            }
          }
        }
      }
    }
    
    this.section = [true,true,true,true, true,true];
    this.edit = true;
    this.selectTab(1);
  }

  delCourse(course){
    this.user.getUsermail().then(email=>{
      if(email === course.PostedBy){
        this.alertCtrl.create({
          title: 'Supprimer ce cours?',
          message : 'Attention ce cours sera rétiré ainsi que tous les fichiers et les utilisateurs n\'y auront plus accès',
          buttons: [
            {
              text: 'Annuler',
              handler: data => {
                //console.log('Cancel clicked');
              }
            },
            {
              text: 'Continuer',
              handler: data => {
                this.courseListService.removeCourse(course).then(ref => {
                  let toast = this.toasCtrl.create({
                    message : 'Ce cours a été supprimé!',
                    duration: 3000,
                    position : 'top'
                  })
                  toast.present();
                })
              }
            }
          ]
        }).present();
      }else{
        this.alertCtrl.create({
          title: 'Attention?',
          message : 'Vous ne pouvez pas supprimer ce cours car vous n\'en êtes pas le publicateur.' ,
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                //console.log('Cancel clicked');
              }
            },
            {
              text: 'Demander autorisation',
              handler: data => {
                this.courseListService.authorisationToDelCourse(course,email)
                this.toasCtrl.create({
                  message : 'Demande de suppression envoyée à '+course.PostedBy+' !',
                  duration: 3000,
                  position : 'top'
                }).present();
              }
            }
          ]
        }).present();
      }
    })
  }

  toggleSection(i,test){
    if(!test)
      this.section[i] = !this.section[i]
    else
      this.section[i] = true
  }
}
