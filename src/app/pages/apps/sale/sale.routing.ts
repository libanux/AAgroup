import { Routes } from '@angular/router';
import { CreateSaleComponent } from './create-sale/create-sale.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { CustomersComponent } from './customers/customers.component';

export const SaleRoutes: Routes = [
  {
  path: '',
  children: [
      {path: 'create', component: CreateSaleComponent,},
      {path: 'invoices', component: SaleInvoiceComponent,},
      {path: 'customers', component: CustomersComponent,}
],
},
];
