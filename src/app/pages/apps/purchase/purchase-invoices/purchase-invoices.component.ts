import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Product, products } from 'src/app/classes/products.class';
import { ProductsService } from 'src/app/services/products.service';
import { PurchaseInvoice, purchaseInvoices } from 'src/app/classes/purchase-invoices.class';
import { Download_Options, GeneralService, Month_Filter_Array } from 'src/app/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrl: '../../../../../assets/scss/apps/general_table.scss',
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
export class PurchaseInvoicesComponent {

  // DOWNLOAD
  Options: any[] = Download_Options;
  selectedDownloadOption: string = 'Download as';

  //TABLE COLUMNS
  displayedColumns: string[] = [
    'supplier',
    'date',
    'total',
    'paid',
    'balance',
    'action'
  ];
  
  // 
  selectedMonth: string = '';
  selectedCategory: string = '';
  
  //MONTHS FOR FILTER DROPDOWN
  months = Month_Filter_Array

  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: PurchaseInvoice | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

    // DATE SELECTION
    SEARCK_KEY = '';
    FILTER_TYPE = ''
    START_DATE = ''
    END_DATE = ''
    STATUS = ''
  // 
  searchText: any;
  totalCount = 0;
  Cancelled = 0;
  Inprogress = 0;
  Completed = 0;


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

constructor(private router: Router, public generalService: GeneralService, public dialog: MatDialog, private productsService: ProductsService) {
  this.viewInvoice = new PurchaseInvoice('', '', 0, 0 ,0, "");
}

ngOnInit(): void {
  this.FETCH_PRODUCTS();
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

  // SEARCH
  APPLY_SEARCH_FILTER(filterValue: string): void {
    // this.purchaseInvoicesArray.filter = filterValue.trim().toLowerCase();
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
        },
        error: (error: any) => {
          console.log("Error:", error)
        },
        complete: () => {
        }
      });
    }
}

 // FILTERING BY DROPDOWN SELECTION : DATE OR STATUS
 showDatePicker = false;
 DROPDOWN_FILTERATION(value: string, dropdown: string) {

   // Date filtering
   if (dropdown == 'month') {
     if (value === 'Calendar') {
       this.showDatePicker = true;
     }

     else {
       this.START_DATE = '';
       this.END_DATE = '';

       this.showDatePicker = false;

       this.FILTER_TYPE = value;

       this.FILTER_ARRAY_BY_DATE(value)
     }
   }

   // Status filtering
   else if (dropdown == 'status') {
     if (value == 'all') {
       // this.FILTER_ARRAY_BY_STATUS('')
       this.STATUS = ''
     }
     else {
       // this.FILTER_ARRAY_BY_STATUS(value)
       this.STATUS = value
     }
   }

   else if (dropdown == 'Download') {
     // this.DOWNLOAD(value);
     // this.selectedDownloadOption = 'Download as';
   }
 }

 // DATE FILTERATION
 FILTER_ARRAY_BY_DATE(filter_type: any) {
   // this.FILTER_TYPE = filter_type
   // this.paginator.firstPage();
   // this.FILTER_VISAS(this.SEARCK_KEY, filter_type, this.START_DATE, this.END_DATE, this.STATUS)
 }

 // Method to handle changes in start date input
 handleStartDateChange(event: any): void {
   this.START_DATE = this.FORMAT_DATE_YYYYMMDD(event);
   this.FILTER_ARRAY_BY_DATE('custom')
 }

 // Method to handle changes in end date input
 handleEndDateChange(event: any): void {
   this.END_DATE = this.FORMAT_DATE_YYYYMMDD(event);
   this.FILTER_ARRAY_BY_DATE('custom')
 }

 FORMAT_DATE_YYYYMMDD(date: Date): string {
   return this.generalService.FORMAT_DATE_YYYYMMDD(date)
 }

 // Function to format date
 FORMAT_DATE(dateString: string): string {
   return this.generalService.FORMAT_DATE_WITH_HOUR(dateString)
 }

//UPDATE ROW VALUES
EDIT_PRODUCT(obj: any): void {
  this.viewInvoice = obj;
  this.editedInvoice = obj;

  this.router.navigate(['/apps/purchase/edit']).then(() => {
    window.scrollTo(0, 0);
  });
}

CANCEL(){
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

// @Component({
//   // tslint:disable-next-line - Disables all
//   selector: 'products-dialog-content',
//   templateUrl: '..pro/products-dialog-content.html',
// })
// // tslint:disable-next-line - Disables all
// export class productsDialogComponent {
//   action: string;
//   // tslint:disable-next-line - Disables all
//   local_data: any;
//   PRODUCT: Product

//   constructor(
//     public dialogRef: MatDialogRef<productsDialogComponent>,
//     @Optional() @Inject(MAT_DIALOG_DATA) public data: Product
//   ) {
//     this.local_data = { ...data };
//     this.action = this.local_data.action;
//   }

//   doAction(): void {
//     this.dialogRef.close({ event: this.action, data: this.local_data });
//   }

//   closeDialog(): void {
//     this.dialogRef.close({ event: 'Cancel' });
//   }
// }
