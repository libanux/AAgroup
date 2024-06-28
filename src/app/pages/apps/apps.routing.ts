import { Routes } from '@angular/router';

import { AppNotesComponent } from './notes/notes.component';
import { ProductsComponent } from './products/products.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './users/users.component';


export const AppsRoutes: Routes = [
  {
  path: '',
  children: [
      // {path: 'stock', component: StockComponent,},
      { path: 'purchase',
            loadChildren: () =>
              import('./purchase/purchase.module').then(
                (m) => m.PurchaseModule
              ),
          },
        
          { path: 'stock',
            loadChildren: () =>
              import('./stock/stock.module').then(
                (m) => m.StockModule
              ),
          },

          { path: 'sale',
            loadChildren: () =>
              import('./sale/sale.module').then(
                (m) => m.SaleModule
              ),
          },
          { path: 'settings',
            loadChildren: () =>
              import('./settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },


      {path: 'reports',  component: ReportsComponent,},
      {path: 'users',  component: UsersComponent,},
      {path: 'notes', component: AppNotesComponent,},
      {path: 'products', component: ProductsComponent,},
],
},
];
