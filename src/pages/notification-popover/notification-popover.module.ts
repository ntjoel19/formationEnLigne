import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPopoverPage } from './notification-popover';

@NgModule({
  declarations: [
    NotificationPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPopoverPage),
  ],
})
export class NotificationPopoverPageModule {}
