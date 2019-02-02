import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyMarksPage } from './my-marks';

@NgModule({
  declarations: [
    MyMarksPage,
  ],
  imports: [
    IonicPageModule.forChild(MyMarksPage),
  ],
})
export class MyMarksPageModule {}
