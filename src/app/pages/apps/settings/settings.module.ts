import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsRoutes } from './settings.routing';

@NgModule({
  imports: [
    RouterModule.forChild(SettingsRoutes),
    FormsModule,
  ],

})
export class SettingsModule {}
