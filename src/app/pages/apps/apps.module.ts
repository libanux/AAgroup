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

//Notes
import { AppNotesComponent } from './notes/notes.component';
//Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppsRoutes } from './apps.routing';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductsComponent, productsDialogComponent } from './products/products.component';
import { ReportsComponent } from './reports/reports.component';
import { UserDialogComponent, UsersComponent } from './users/users.component';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseAddComponent } from './purchase/purchase-add/purchase-add.component';
import { PurchaseInvoicesComponent } from './purchase/purchase-invoices/purchase-invoices.component';
import { StockComponent, deleteAjustDialogComponent } from './stock/view/stock.component';
import { AdjustComponent, AdjustDialogComponent } from './stock/adjust/adjust.component';
import { AdjustementComponent, deleteAjustmentDialogComponent } from './stock/adjustement/adjustement.component';
import { SaleModule } from './sale/sale.module';
import { CreateSaleComponent } from './sale/create-sale/create-sale.component';
import { SaleInvoiceComponent } from './sale/sale-invoice/sale-invoice.component';
import { MatFormField } from "@angular/material/form-field";
import { CustomersComponent, CustomersDialogComponent } from './sale/customers/customers.component';
import { SuppliersComponent } from './purchase/suppliers/suppliers.component';
import { TableShimmerComponent } from './table-shimmer/table-shimmer.component';
import { EditPurchaseComponent } from './purchase/edit-purchase/edit-purchase.component';
import { SettingsModule } from './settings/settings.module';
import { MainComponent } from './settings/main/main.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { InvoiceSettingsComponent } from './settings/invoice-settings/invoice-settings.component';
import { NoItemsFoundComponent } from './no-items-found/no-items-found.component';

@NgModule({
    exports: [TablerIconsModule],
    declarations: [
        AppNotesComponent,
        ProductsComponent,
        ReportsComponent,
        UsersComponent,
        productsDialogComponent,
        PurchaseAddComponent,
        PurchaseInvoicesComponent,
        StockComponent,
        AdjustComponent,
        AdjustementComponent,
        CreateSaleComponent,
        SaleInvoiceComponent,
        AdjustDialogComponent,
        deleteAjustDialogComponent,
        UserDialogComponent,
        CustomersComponent,
        SuppliersComponent,
        deleteAjustmentDialogComponent,
        TableShimmerComponent,
        CustomersDialogComponent,
        UsersComponent,
        EditPurchaseComponent,
        MainComponent,
        ProfileComponent,
        InvoiceSettingsComponent,
        NoItemsFoundComponent
    ],
    providers: [DatePipe],
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
        PurchaseModule,
        SaleModule,
        SettingsModule,
        MatFormField
    ]
})
export class AppsModule {}
