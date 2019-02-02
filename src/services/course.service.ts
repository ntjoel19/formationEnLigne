import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { UserListService } from './user.service';
import { NotificationService } from './notification.service';
import { DataProvider } from '../providers/data/data';


@Injectable()
export class CourseListService {
    
    private courseListRef = this.db.list<Course>('/courses');
    private userListRef = this.db.list<User>('/users');
    constructor(private db: AngularFireDatabase,private userListService:UserListService,
        private notificationService:NotificationService,
        private data:DataProvider ) {
        
    }

    getCourseList() {
        return this.courseListRef;
    }

    addCourse(courses: Course) {
        let key = this.courseListRef.push(courses).key;
        courses.key = key;
        return this.updateCourse(courses,false);
    }
    /**
     * 
     * @param courses the course we want to update 
     * @param test true if it the function is called when updating a course and false if calleed when creating it
     */
    updateCourse(courses,test) {
        //then update the reference of this course in users document
       
        if(test){    
            this.userListRef.valueChanges(['child_added','child_removed']).subscribe(next=>{
                next.map(user=>{
                    if(user.courses !== undefined){
                        let course = user.courses;
                        if(user.courses!==undefined){
                            course.forEach((c,i)=>{
                                if(c.subtitle === courses.subtitle){
                                    courses['authorisation'] = courses.authorisation;
                                    
                                    user.courses.splice(i,1);
                                    if(user.courses===undefined) user.courses=[courses]; else user.courses.push(courses)
                                    
                                    this.userListService.updateUser(user);
                                }
                            })
                        }else{
                            user.courses=[courses];
                            this.userListService.updateUser(user);
                        }
                    }
                })
            })
            
        }
        return this.courseListRef.update(courses.key, courses);
    }

    getACourse(keyName:string , keyVal:string){
        return this.db.list<Course>('/courses',ref => ref.orderByChild(keyName).equalTo(keyVal)).valueChanges();
    }

    removeCourse(courses: Course) {
        //then remove the reference of this course in users document
        //let users:User[]=null
        this.userListRef.valueChanges(['child_added','child_removed']).forEach(next=>{
            next.map(user=>{
                if(user.courses !== undefined){
                    user.courses.forEach((c,i)=>{
                        if(c.subtitle === courses.subtitle){
                            user.courses.splice(i,1);
                        }
                    })
                    this.userListService.updateUser(user);
                }
            })
        })
        //delete associated files in storage and ref in db
        if(courses.descriptImage !== undefined){
            this.db.list<any>('/files').valueChanges(['child_added']).subscribe(file=>{
                file.forEach((f,i)=>{
                    let key = f.key;
                    if(f.url === courses.descriptImage){
                        this.data.deleteFile(f);
                        this.db.list<any>('/files').remove(key); 
                    }  
                })
            })
        }
        if(courses.chapter!==undefined){
            for(let i=0;i<courses.chapter.length;i++){
                if(courses.chapter[i].lecon!==undefined){
                    for(let j=0;j<courses.chapter[i].lecon.length;j++){
                        if(courses.chapter[i].lecon[j].materials!==undefined){
                            for(let k=0;k<courses.chapter[i].lecon[j].materials.length;k++){
                                this.db.list<any>('/files').valueChanges(['child_added']).subscribe(file=>{
                                    file.forEach((f,i)=>{
                                        let key = f.key;
                                        if(f.fullPath === courses.chapter[i].lecon[j].materials[k].content){
                                            this.data.deleteFile(f);
                                            this.db.list<any>('/files').remove(key); 
                                        }
                                    })
                                })
                            }
                        }  
                        if(courses.chapter[i].lecon[j].quizz!==undefined){
                            for(let k=0;k<courses.chapter[i].lecon[j].quizz.length;k++){
                                this.db.list<any>('/files').valueChanges(['child_added']).subscribe(file=>{
                                    file.forEach((f,i)=>{
                                        let key = f.key;
                                        if(f.fullPath === courses.chapter[i].lecon[j].quizz[k].content){
                                            this.data.deleteFile(f);
                                            this.db.list<any>('/files').remove(key); 
                                        }
                                    })
                                })
                            }
                        }   
                    }
                }
            }
        }
        return this.courseListRef.remove(courses.key)
    }

    authorisationToDelCourse(courses: Course,email) {
        //then remove the reference of this course in users document
        this.notificationService.sendNotification(null,courses.PostedBy,email,"Demande de suppression de "+courses.subtitle)
    }
}