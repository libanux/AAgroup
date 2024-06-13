import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgScrollbarModule } from 'ngx-scrollbar';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Contact
import { AppContactDialogContentComponent } from './contact/contact.component';
import { AppContactComponent } from './contact/contact.component';

//Notes
import { AppNotesComponent } from './notes/notes.component';

// Permission
import { AppPermissionComponent } from './permission/permission.component';

//Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppEmployeeComponent } from './employee/employee.component';
import { AppEmployeeDialogContentComponent } from './employee/employee.component';
import { AppAddEmployeeComponent } from './employee/add/add.component';

import { AppsRoutes } from './apps.routing';
import { MatNativeDateModule } from '@angular/material/core';

//Invoice
import { AppInvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { AppInvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { AppAddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AppEditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { OkDialogComponent } from './invoice/edit-invoice/ok-dialog/ok-dialog.component';
import { AddedDialogComponent } from './invoice/add-invoice/added-dialog/added-dialog.component';

// visa
import { AdminDialogContentComponent, AdminsComponent } from './admins/admins.component';
import { AddComponent } from './admins/add-admin/add.component';
import { ProductsComponent, productsDialogComponent } from './products/products.component';
import { StockComponent } from './stock/stock.component';

import { SaleComponent } from './sale/sale.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { ChangeLogoImageComponent } from './settings/Account/change-logo-image/change-logo-image.component';
import { ChangeBusinessInfoComponent } from './settings/Account/change-business-info/change-business-info.component';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseAddComponent } from './purchase/purchase-add/purchase-add.component';
import { PurchaseInvoicesComponent } from './purchase/purchase-invoices/purchase-invoices.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons),
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    PurchaseModule
    
  ],
  exports: [TablerIconsModule],
  declarations: [
    AppPermissionComponent,
    AppNotesComponent,
    AppContactComponent,
    AppContactDialogContentComponent,
    AppEmployeeComponent,
    AppEmployeeDialogContentComponent,
    AppAddEmployeeComponent,
    AppInvoiceListComponent,
    AppInvoiceViewComponent,
    AppAddInvoiceComponent,
    AppEditInvoiceComponent,
    AddedDialogComponent,
    OkDialogComponent,
    AdminsComponent,
    AdminDialogContentComponent,
    AddComponent,
    ProductsComponent,
    StockComponent,
    SaleComponent,
    ReportsComponent,
    SettingsComponent,
    UsersComponent,
    productsDialogComponent,
    ChangeLogoImageComponent,
    ChangeBusinessInfoComponent,
   PurchaseAddComponent,
   PurchaseInvoicesComponent
  ],
  providers: [DatePipe],
})
export class AppsModule {}
