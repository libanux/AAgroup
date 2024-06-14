import { Routes } from '@angular/router';
import { StockComponent } from './view/stock.component';
import { AdjustComponent } from './adjust/adjust.component';
import { AdjustementComponent } from './adjustement/adjustement.component';

export const ChartsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'view',
        component: StockComponent,
      },
      {
        path: 'Adjust',
        component: AdjustComponent,
      },
      {
        path: 'Adjustment',
        component: AdjustementComponent,
      },
    ],
  },
];
