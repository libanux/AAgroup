import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/classes/products.class';
import { PurchaseInvoice, purchaseInvoices } from 'src/app/classes/purchase-invoices.class';
import { ProductsService } from 'src/app/services/products.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrl: './sale-invoice.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SaleInvoiceComponent {
  ShowAddButoon = true;
  selectedMonth: string = '';

  //TABLE COLUMNS
  displayedColumns: string[] = [
    'supplier',
    'date',
    'total',
    'paid',
    'balance',
    'action'
  ];

  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: PurchaseInvoice | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // 
  searchText: any;
  totalCount = 0;
  Cancelled = 0;
  Inprogress = 0;
  Completed = 0;

  //MONTHS FOR FILTER DROPDOWN
  months: month[] = [
    { value: 'today', viewValue: 'Today' },
    { value: 'yesterday', viewValue: 'Yesterday' },
    { value: 'last Week', viewValue: 'Last Week' },
    { value: 'Last Month', viewValue: 'Last Month' },
    { value: 'Last Year', viewValue: 'Last Year' },
    { value: 'Calendar', viewValue: 'Custom' },
  ];

 //MAIN PRODUCT ARRAY
 purchaseInvoicesArray: any[] = []
 showCalendar: boolean = false;
 selectedDate: Date | null = null; // Adjusted the type to accept null
//PRODUCTS ARRAY
dataSource = new MatTableDataSource(this.purchaseInvoicesArray);

  //PRODUCT ON EDIT
  viewInvoice: PurchaseInvoice
 purchaseInvoiceExample = new PurchaseInvoice('', '', 0, 0 ,0, "");
  editedInvoice = new PurchaseInvoice('', '', 0, 0 ,0, "");

constructor(public dialog: MatDialog, private productsService: ProductsService) {
  this.viewInvoice = new PurchaseInvoice('', '', 0, 0 ,0, "");
}

ngOnInit(): void {
  this.FETCH_PRODUCTS();
}

onDateSelect(date: Date) {
  console.log('Selected Date:', date);
}

// cancelSelection() {
//     this.showCalendar = false;
//     this.selectedMonth = '';
//     this.selectedDate = null;
// }

ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
}

//EXPAND THE ROW AND CHECK IF THE COLUMN IS ACTION THEN DO NOT EXPAND
expandRow(event: Event, element: any, column: string): void {
    if (column === 'action') {
      this.expandedElement = element;
    }
    else {
      this.expandedElement = this.expandedElement === element ? null : element;
      event.stopPropagation();
    }
}

//FETCH productsArray FROM API
FETCH_PRODUCTS(): void {
    this.purchaseInvoicesArray =purchaseInvoices ;
    this.totalCount = purchaseInvoices.length;
    // this.productsService.GET_productsArray().subscribe({
    //   next: (response: any) => {
    //     this.productsArray = response;
    //     this.dataSource = new MatTableDataSource(this.productsArray);
    //     this.totalCount = this.dataSource.data.length;
    //     this.Inprogress = this.btnCategoryClick('pending');
    //     // this.Completed = this.btnCategoryClick('complete');
    //     // this.Cancelled = this.btnCategoryClick('cancelled');
    //   },
    //   error: (error: any) => {
    //     console.log("Error:", error)
    //   },
    //   complete: () => {
    //   }
    // });
}

//ADD PRODUCT
ADD_PRODUCT() {
    // this.productsService.ADD_PRODUCT(this.purchaseInvoiceExample).subscribe({
    //   next: (response: any) => {
    //     console.log("Response:", response);
    //   },
    //   error: (error: any) => {
    //     console.error(error);
    //     console.log("Error::", error);
    //   },
    //   complete: () => { }
    // });
}

//TRIGGER THE DROP DOWN FILTER VALUES
ON_CHANGE_DROPDOWN(value: string) {
    if (value === 'Calendar') {
      // this.OPEN_CALENDAR_DIALOG();
    }
    else{
      this.productsService.FILTER_PRODUCT(value).subscribe({
        next: (response: any) => {
          console.log("Response:", response)
          this.purchaseInvoicesArray = response;
          this.dataSource = new MatTableDataSource(this.purchaseInvoicesArray);
          this.totalCount = this.dataSource.data.length;
          this.Inprogress = this.btnCategoryClick('pending');
        },
        error: (error: any) => {
          console.log("Error:", error)
        },
        complete: () => {
        }
      });
    }
}

//UPDATE ROW VALUES
EDIT_PRODUCT(obj: any): void {
  this.ShowAddButoon = false
  this.viewInvoice = obj;
  this.editedInvoice = obj;
}

CANCEL(){
  this.ShowAddButoon = true;
  this.editedInvoice = new PurchaseInvoice('', '', 0, 0 ,0, "");
}

// OPEN UPDATE & DELETE DIALOGS
OPEN_DIALOG(action: string, delPRODUCT: Product): void {
//     const dialogRef = this.dialog.open(productsDialogComponent, {
//       data: { action, delPRODUCT }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result && result.event === 'Delete') {

// this.productsService.DELETE_PRODUCT(delPRODUCT).subscribe({
//     next: (response: any) => {
//         console.log('Response:', response);
//          this.FETCH_PRODUCTS()
//     },
//     error: (error: any) => {console.error('Error:', error);},
//     complete: () => { }
//       });
//     }
//   });
}

//GET THE CATEGORY LENGTH
btnCategoryClick(val: string): number {
  this.dataSource.filter = val.trim().toLowerCase();
  return this.dataSource.filteredData.length;
}

//TRUNCATE THE TEXT INTO 20 CHARS
truncateText(text: string, limit: number): string {
if (text && text.length > limit) { return text.substring(0, limit) + '...';  }
  return text;
}

//GET THE STATUS CLASS
getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-light-warning mat-body-2 f-w-500 p-x-8 p-y-4 f-s-12 rounded-pill';
      case 'completed':
        return 'bg-light-success mat-body-2 f-w-500 p-x-8 p-y-4 f-s-12 rounded-pill';
      case 'cancelled':
        return 'bg-light-error mat-body-2 f-w-500 p-x-8 p-y-4 f-s-12 rounded-pill';
      default:
        return '';
    }
  }
}

//MONTHS INTERFACE
interface month {
  value: string;
  viewValue: string;
}