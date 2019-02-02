import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CourseListService} from '../../services/course.service'
import {UserListService} from '../../services/user.service';
import {User} from '../../provider/user';
import {CourseProvider} from '../../providers/course/course'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

/**
 * Generated class for the MyStudentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-student',
  templateUrl: 'my-student.html',
})
export class MyStudentPage {
  headerbg: any;
  darkHeader: any;

  myStudentList:any[];
  email;

  form: FormGroup;
  form2: FormGroup;

  seenWork:boolean = true;
  matrice:any[]=new Array(1000);
  observeOffline: boolean=false;
  constructor(public navCtrl: NavController,
    public renderer: Renderer, 
    public user:User,
    public formBuilder:FormBuilder,
    public userServices:UserListService,
    public courseServices:CourseListService,
    public courseProvider: CourseProvider,
    public notification: NotificationService,
    public navParams: NavParams
    ) {
      this.form = this.formBuilder.group({
        teacherComment: ['', Validators.required],
        note:['', Validators.required]
      })

      this.form2 = this.formBuilder.group({
        comm: ['', Validators.required]
      })
    window.addEventListener("offline",()=>{
      this.offlineLoadStudents()
    })
    this.offlineLoadStudents()
    this.onlineStudentsList();
  }

  removeDuplicated(userList){
    if(userList!==undefined){
      for(let i=0;i<userList.length;i++){
        for(let j=i+1;j<userList.length;j++){
          if(userList[i].email === userList[j].email){
            userList.splice(i,1)
          }
        }
      }
    }
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

  onlineStudentsList(){
    
    this.user.getUsermail().then(email=>{
      this.email = email;
      this.courseServices.getACourse('PostedBy',email).subscribe(courses=>{//the courses I posted
        this.observeOffline = true;
        this.myStudentList = undefined
        courses.forEach(course=>{
          this.userServices.getUserList().valueChanges().subscribe(list=>{
            list.forEach(user=>{
              if(user.courses!==undefined){
                user.courses.forEach(co=>{
                  if(co.title===course.title){
                    if(this.myStudentList===undefined){
                      this.myStudentList=[user]
                    }else{
                      this.myStudentList.push(user)
                    }
                    for(let i=0;i<this.myStudentList.length;i++){
                      if(this.myStudentList[i].homeworks !== undefined){
                        for(let j=0;j<this.myStudentList[i].homeworks.length;j++){
                          this.matrice[i] = [true];
                        }
                      }
                    }
                  }
                })
                this.removeDuplicated(this.myStudentList)
              }
            })
          })
        })
      })
      //add to that list the user enrolled in 
      this.courseServices.getCourseList().valueChanges().subscribe(courses=>{
        courses.forEach(course=>{
          if(course.associateProf !== undefined){
            course.associateProf.forEach(prof=>{
              if(prof.email === email){//if my email occures in a course as associate prof, then
                this.userServices.getUserList().valueChanges().subscribe(list=>{
                  //this.myStudentList = undefined
                  list.forEach(user=>{
                    if(user.courses!==undefined){
                      user.courses.forEach(co=>{
                        //console.log(courses);
                        if(co.title===course.title){
                          if(this.myStudentList===undefined){
                            this.myStudentList=[user]
                          }else{
                            this.myStudentList.push(user)
                          }
                          for(let i=0;i<this.myStudentList.length;i++){
                            if(this.myStudentList[i].homeworks != undefined)
                              for(let j=0;j<this.myStudentList[i].homeworks.length;j++){
                                for(let k=0;k<this.myStudentList[i].homeworks[j].associateProf.length;k++){
                                  if(this.myStudentList[i].homeworks[j].associateProf[k].email===this.email){
                                    this.matrice[i] = [true];
                                  }else{
                                    this.matrice[i] = [false];
                                  }
                                }
                              }
                          }
                        }
                      })               
                      this.removeDuplicated(this.myStudentList);
                    }
                  })
                })
              }
            })
          }
        })
      })
    })
  }

  offlineLoadStudents(){
    let co:any[];
    this.user.getUsermail().then(email=>{
      this.email = email;
      this.courseProvider.getCourseList().then(courseList=>{
        if(courseList!== null){
          courseList.forEach(c=>{
            if(c.PostedBy===email){
              if(co===undefined) co=[c]
              else co.push(c)
            }
          })
          this.myStudentList = undefined
          if(co !== undefined)
          co.forEach(course=>{
            this.user.getUserList().then(list=>{
              list.forEach(user=>{
                if(user.courses!==undefined){
                  user.courses.forEach(co=>{
                    if(co.title===course.title){
                      if(this.myStudentList===undefined){
                        this.myStudentList=[user]
                      }else{
                        this.myStudentList.push(user)
                      }
                      for(let i=0;i<this.myStudentList.length;i++){
                        if(this.myStudentList[i].homeworks !== undefined){
                          for(let j=0;j<this.myStudentList[i].homeworks.length;j++){
                            this.matrice[i] = [true];
                          }
                        }
                      }
                    }
                  })     
                  this.removeDuplicated(this.myStudentList);
                }
              })
            })
          })
        }
      })

      //add to that list the user enrolled in 
      this.courseProvider.getCourseList().then(courses=>{
        if(courses !== null){
          courses.forEach(course=>{
            if(course.associateProf !== undefined){
              course.associateProf.forEach(prof=>{
                if(prof.email === email){//if my email occures in a course as associate prof, then
                  this.user.getUserList().then(list=>{
                    list.forEach(user=>{
                      if(user.courses!==undefined){
                        user.courses.forEach(co=>{
                          //console.log(courses);
                          if(co.title===course.title){
                            if(this.myStudentList===undefined){
                              this.myStudentList=[user]
                            }else{
                              this.myStudentList.push(user)
                            }
                            for(let i=0;i<this.myStudentList.length;i++){
                              if(this.myStudentList[i].homeworks != undefined)
                                for(let j=0;j<this.myStudentList[i].homeworks.length;j++){
                                  for(let k=0;k<this.myStudentList[i].homeworks[j].associateProf.length;k++){
                                    if(this.myStudentList[i].homeworks[j].associateProf[k].email===this.email){
                                      this.matrice[i] = [true];
                                    }else{
                                      this.matrice[i] = [false];
                                    }
                                  }
                                }
                            }
                          }
                        })     
                        this.removeDuplicated(this.myStudentList);
                      }
                    })
                  })
                }
              })
            }
          })
        }
      })
    })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MyStudentPage');
    //this.offlineLoadStudents();    
  }

  

  seen(work,student){
    student.homeworks.forEach((w,i)=>{
      if(w.exerciseName===work.exerciseName && w.leconName===work.leconName && w.pfmName===work.pfmName && w.chapterName===work.chapterName){
        student.homeworks[i].seen = true;
      }
    })
    this.userServices.updateUser(student);
  }

  noter(val,work,j,student){
    work.seen = true;
    work.teacherComment = val.teacherComment;
    work.note = val.note;
    student.homeworks[j].comments.push({"date":new Date().toString().split(" GMT")[0],"author":work.teacher,"message":val.teacherComment})
    student.homeworks[j].teacherComment = val.teacherComment
    student.homeworks[j].note = val.note;
    this.userServices.updateUser(student).then(()=>{
      this.notification.sendNotification(null,student.email,work.teacher,"Devoir vu et corrigé : "+work.work.exerciseName);
    });
    this.form.patchValue({teacherComment:"",note:0})
  }

  post(val,work,m,j,student){
    student.homeworks[j].comments.push({"date":new Date().toString().split(" GMT")[0],"author":work.teacher,"message":val.comm})
    this.userServices.updateUser(student).then(()=>{
      this.notification.sendNotification(null,student.email,work.teacher,"message: "+val.comm)
    });
    this.form2.patchValue({comm:""})
  }
}
