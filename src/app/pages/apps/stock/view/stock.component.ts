import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { stocksService } from 'src/app/services/stock.service';
import { Product, products } from 'src/app/classes/products.class';
import { Category, categories } from 'src/app/classes/category.class';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
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

export class StockComponent implements OnInit {

  ShowAddButoon = true;
  selectedMonth: string = '';

  //TABLE COLUMNS
  displayedColumns: string[] = [
    'barcode',
    'itemName',
    'category',
    'previousQuantity',
    'onHandQuantity',
    'action'
  ];

  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: Product | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // 
  selectedCategory: string = '';
  searchText: any;
  totalCount = 0;
  Cancelled = 0;
  Inprogress = 0;
  Completed = 0;

  categoryArray = categories

  //MONTHS FOR FILTER DROPDOWN
  months: month[] = [
    { value: 'today', viewValue: 'Today' },
    { value: 'yesterday', viewValue: 'Yesterday' },
    { value: 'last Week', viewValue: 'Last Week' },
    { value: 'Last Month', viewValue: 'Last Month' },
    { value: 'Last Year', viewValue: 'Last Year' },
    { value: 'Calendar', viewValue: 'Custom' },
  ];

 //MAIN stock ARRAY
 showCalendar: boolean = false;
 selectedDate: Date | null = null; // Adjusted the type to accept null
//stockS ARRAY
stocksArray = new MatTableDataSource<Product>([]);

  //stock ON EDIT
  viewstock: Product
  stockExample = new Product('', '', '',new Category(-1, ''), 0, 0, 0, 0);
  editedstock = new Product('', '', '',new Category(-1, ''), 0, 0, 0, 0);

constructor(public generalService: GeneralService, public dialog: MatDialog, private stocksService: stocksService) {
  this.viewstock = new Product('', '', '',new Category(-1, ''), 0, 0, 0, 0);
}

ngOnInit(): void {
  this.FETCH_STOCKS();
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
  this.stocksArray.paginator = this.paginator;
}

FILTER_BY_CATEGORY(value: string){
  if(value == 'All'){this.FETCH_STOCKS()}
  else {this.stocksArray.filter = value.trim().toLowerCase();}
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

//FETCH stocksArray FROM API
FETCH_STOCKS(): void {
  this.stocksArray = new MatTableDataSource(products);
  // this.totalCount = stockArray.length;
    // this.stocksService.GET_stocksArray().subscribe({
    //   next: (response: any) => {
    //     this.stocksArray = response;
    //     this.dataSource = new MatTableDataSource(this.stocksArray);
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

SORT(){

}

// CANCEL UPDATE
CANCEL_UPDATE(): void {
  this.ShowAddButoon = true;
  this.editedstock = new Product('', '', '',new Category(-1, ''), 0, 0, 0, 0);
}

APPLY_SEARCH_FILTER(filterValue: string): void {
  this.stocksArray.filter = filterValue.trim().toLowerCase();
}

//ADD stock
ADD_STOCK() {
    this.stocksService.ADD_stock(this.stockExample).subscribe({
      next: (response: any) => {},
      error: (error: any) => {console.error(error);},
      complete: () => {    
        this.CANCEL_UPDATE();
        this.FETCH_STOCKS();}
    });
}

//TRIGGER THE DROP DOWN FILTER VALUES
ON_CHANGE_DROPDOWN(value: string) {
    if (value === 'Calendar') {
      this.OPEN_CALENDAR_DIALOG();
    }
    else{
      this.stocksService.FILTER_stock(value).subscribe({
        next: (response: any) => {
          this.stocksArray = new MatTableDataSource(response);
          this.totalCount = this.stocksArray.data.length;
          // this.Inprogress = this.btnCategoryClick('pending');
        },
        error: (error: any) => {
          console.log("Error:", error)
        },
        complete: () => {
        }
      });
    }
}

//OPEN THE CALENDAR DIALOG
OPEN_CALENDAR_DIALOG(): void {
    // const dialogRef = this.dialog.open(CalendarDialogComponent, {
    //   width: '350px',
    //   data: { selectedDate: this.selectedDate }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    //   if (result) {
    //     if (result.startDate && result.endDate) {
    //       this.selectedMonth = `${result.startDate.toLocaleString('default', { month: 'long' })} - ${result.endDate.toLocaleString('default', { month: 'long' })}`;
    //       this.stocksService.FILTER_stock("custom").subscribe({
    //         next: (response: any) => {
    //           console.log("Response:", response)
    //           this.stocksArray = response;
    //           this.dataSource = new MatTableDataSource(this.stocksArray);
    //           this.totalCount = this.dataSource.data.length;
    //           this.Inprogress = this.btnCategoryClick('pending');
    //         },
    //         error: (error: any) => {
    //           console.log("Error:", error)
    //         },
    //         complete: () => {
    //         }
    //       });
    //     } else {
    //       this.selectedMonth = 'Custom';
    //     }
    //     this.selectedDate = result;
    //   }
    // });
}

//UPDATE ROW VALUES
EDIT_STOCK(obj: any): void {
  this.ShowAddButoon = false
  this.viewstock = obj;
  this.editedstock = obj;
}


// OPEN UPDATE & DELETE DIALOGS
OPEN_DIALOG(action: string, delstock: Product): void {
    const dialogRef = this.dialog.open(deleteAjustDialogComponent, {
      data: { action, delstock }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event === 'Delete') {

this.stocksService.DELETE_stock(delstock).subscribe({
    next: (response: any) => {
        console.log('Response:', response);
         this.FETCH_STOCKS()
    },
    error: (error: any) => {console.error('Error:', error);},
    complete: () => { }
      });
    }
  });
}

//GET THE CATEGORY LENGTH
// btnCategoryClick(val: string): number {
//   this.stocksArray.filter = val.trim().toLowerCase();
//   return this.st.filteredData.length;
// }

//TRUNCATE THE TEXT INTO 20 CHARS
TRUNCATE_TEXT(text: string, limit: number): string {
  return this.generalService.truncateText(text, limit);
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


@Component({
  selector: 'products-dialog-content',
  templateUrl: 'delete-dialog-content.html',
  styleUrl: 'delete-dialog-content.scss'
})
export class deleteAjustDialogComponent {
  action: string;
  local_data: any;
  PRODUCT: Product
  categoryArray = categories
  
  constructor(
    public dialogRef: MatDialogRef<deleteAjustDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}