import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCoursesPage } from './my-courses';

@NgModule({
  declarations: [
    MyCoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCoursesPage),
  ],
})
export class MyCoursesPageModule {}
