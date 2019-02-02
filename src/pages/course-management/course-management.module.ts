import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseManagementPage } from './course-management';

@NgModule({
  declarations: [
    CourseManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseManagementPage),
  ],
})
export class CourseManagementPageModule {}
