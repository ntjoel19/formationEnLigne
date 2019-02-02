import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LessonsListPage } from './lessons-list';

@NgModule({
  declarations: [
    LessonsListPage,
  ],
  imports: [
    IonicPageModule.forChild(LessonsListPage),
  ],
})
export class LessonsListPageModule {}
