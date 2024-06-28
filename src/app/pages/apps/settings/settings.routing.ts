import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

export const SettingsRoutes: Routes = [
  {
  path: '',
  children: [
      {path: 'main', component: MainComponent},
],
},
];
