import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyStudentPage } from './my-student';

@NgModule({
  declarations: [
    MyStudentPage,
  ],
  imports: [
    IonicPageModule.forChild(MyStudentPage),
  ],
})
export class MyStudentPageModule {}
