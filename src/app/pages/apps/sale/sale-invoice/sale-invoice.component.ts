import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/classes/products.class';
import { ProductsService } from 'src/app/services/products.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Download_Options, GeneralService } from 'src/app/services/general.service';
import { SalesInvoiceClass, Sales_Invoice_array } from 'src/app/classes/sales.invoice.service';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrl:'../../../../../assets/scss/apps/general_table.scss',
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

// DOWNLOAD
Options: any[] = Download_Options;
selectedDownloadOption: string = 'Download as';

  displayedColumns: string[] = [
    'orderNumber',
    'orderDate',
    'inventoryStatus',
    'paymentStatus',
    'customer',
    'dueDate',
    'total',
    'paid',
    'balance'
  ];

  TableHeaders: string[] = [
    'Order#',
    'Order Date',
    'Inventory Status',
    'Payment Status',
    'Customer',
    'Due Date',
    'Total',
    'Paid',
    'Balance'
  ];
  // VARIABLES
  // These two valus are used for the add expnad row in the top of the page
  panelOpenState = false;
  open_expansion_value = 1;
  // SHOW ADD BUTTON FOR ADD PRODUCT / IF NOT SHOWN THE UPDATE BTN WILL BE SHOWN
  ShowAddButoon = true;
  CurrentAction: string = 'Add Product'
  // 
  selectedMonth: string = '';
  selectedCategory: string = '';
  // 
  searchText: any;
  totalCount = 0;

  // DATE SELECTION
  SEARCK_KEY = '';
  FILTER_TYPE = ''
  START_DATE = ''
  END_DATE = ''
  STATUS = ''

  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: SalesInvoiceClass | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

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
 SALES_INVIOCE_ARRAY: any[] = []
 showCalendar: boolean = false;
 selectedDate: Date | null = null; // Adjusted the type to accept null
//PRODUCTS ARRAY
dataSource = new MatTableDataSource(this.SALES_INVIOCE_ARRAY);

  //PRODUCT ON EDIT
  viewInvoice: SalesInvoiceClass
 purchaseInvoiceExample = new SalesInvoiceClass('', '', '', '' ,'', '', '', '', '');
  editedInvoice = new SalesInvoiceClass('', '', '', '' ,'', '', '', '', '');

constructor(public generalService: GeneralService, public dialog: MatDialog, private productsService: ProductsService) {
  this.viewInvoice = new SalesInvoiceClass('', '', '', '' ,'', '', '', '', '');
}

ngOnInit(): void {
  this.FETCH_PRODUCTS();
}

onDateSelect(date: Date) {
  console.log('Selected Date:', date);
}

  // SEARCH
  APPLY_SEARCH_FILTER(filterValue: string): void {
    // this.productsArray.filter = filterValue.trim().toLowerCase();
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

        // this.FILTER_ARRAY_BY_DATE(value)
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
    this.SALES_INVIOCE_ARRAY =Sales_Invoice_array ;
    this.totalCount = Sales_Invoice_array.length;

    console.log(this.SALES_INVIOCE_ARRAY)
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
      // this.productsService.FILTER_PRODUCT(value).subscribe({
      //   next: (response: any) => {
      //     console.log("Response:", response)
      //     this.purchaseInvoicesArray = response;
      //     this.dataSource = new MatTableDataSource(this.purchaseInvoicesArray);
      //     this.totalCount = this.dataSource.data.length;
      //     this.Inprogress = this.btnCategoryClick('pending');
      //   },
      //   error: (error: any) => {
      //     console.log("Error:", error)
      //   },
      //   complete: () => {
      //   }
      // });
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
  this.editedInvoice =new SalesInvoiceClass('', '', '', '' ,'', '', '', '', '');
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