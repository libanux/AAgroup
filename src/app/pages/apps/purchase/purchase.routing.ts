import { Routes } from '@angular/router';
import { PurchaseAddComponent } from './purchase-add/purchase-add.component';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';


export const PurchaseRoutes: Routes = [
  {
  path: '',
  children: [
      {path: 'add', component: PurchaseAddComponent},
      {path: 'invoices', component: PurchaseInvoicesComponent},
      {path: 'suppliers', component: SuppliersComponent},
      {path: 'edit', component: EditPurchaseComponent}
],
},
];
