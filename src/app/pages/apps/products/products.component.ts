import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CalendarDialogComponent } from './calendar-card/calendar-dialog.component';
import { ProductsService } from 'src/app/services/products.service';
import { Product, products } from 'src/app/classes/products.class';
import { GeneralService } from 'src/app/services/general.service';
import { Category, categories } from 'src/app/classes/category.class';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
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

export class ProductsComponent implements OnInit {

  ShowAddButoon = true;
  selectedMonth: string = '';
  selectedCategory: string = '';
  CurrentAction : string = 'Add Product'

  //TABLE COLUMNS
  displayedColumns: string[] = [
    'barcode',
    'itemName',
    'description',
    'category',
    'cost',
    'sale',
    'action'
  ];
  TableHeaders: string[] = [
    'Barcode',
    'Item Name',
    'Description',
    'Category',
    'Cost',
    'Sale',
    'Action'
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: Product | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // 
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

 //MAIN PRODUCT ARRAY

 showCalendar: boolean = false;
 selectedDate: Date | null = null; // Adjusted the type to accept null
//PRODUCTS ARRAY
productsArray = new MatTableDataSource<Product>([]);
New_product_Array: Product[] = []

  //PRODUCT ON EDIT
  viewPRODUCT: Product
  PRODUCTExample =  new Product('', '', '','', 0, 0, 0, 0);
  ADDED_PRODUCT =  new Product('', '', '','', 0, 0, 0, 0);

constructor(public generalService: GeneralService, public dialog: MatDialog, private productsService: ProductsService) {
  this.viewPRODUCT=  new Product('', '', '','', 0, 0, 0, 0);
  // this.categoryArray = categories
}

ngOnInit(): void {
  this.New_product_Array = products
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
  this.productsArray.paginator = this.paginator;
}

GENERATE_BARCODE() {
  let result = '';
  for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10);
  }

  this.ADDED_PRODUCT.barcode = result
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
    this.productsArray = new MatTableDataSource(this.New_product_Array);
    this.totalCount = products.length;
    // this.productsService.GET_productsArray().subscribe({
    //   next: (response: any) => {
    //     this.productsArray = response;
    //     this.productsArray = new MatTableDataSource(this.productsArray);
    //     this.totalCount = this.productsArray.data.length;
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
ADD_PRODUCT(obj: Product) {
  this.New_product_Array.push(obj);
  this.FETCH_PRODUCTS();
  this.ADDED_PRODUCT =  new Product('', '', '','', 0, 0, 0, 0);

  // this.productsService.ADD_PRODUCT(obj).subscribe({
  //   next: (response: any) => { },
  //   error: (error) => { },
  //   complete: () => {
  //     this.CANCEL_UPDATE();
  //     this.FETCH_PRODUCTS();
  //   }
  // });
}

//TRIGGER THE DROP DOWN FILTER VALUES
ON_CHANGE_DROPDOWN(value: string) {
    if (value === 'Calendar') {
      this.OPEN_CALENDAR_DIALOG();
    }
    else{
      this.productsService.FILTER_PRODUCT(value).subscribe({
        next: (response: any) => {
          this.productsArray = new MatTableDataSource(response);
          this.totalCount = this.productsArray.data.length;
          this.Inprogress = this.btnCategoryClick('pending');
        },
        error: (error: any) => {console.log("Error:", error)},
        complete: () => {
        }
      });
    }
}

FILTER_BY_CATEGORY(value: string){
  if(value == 'All'){this.FETCH_PRODUCTS()}
  else {this.productsArray.filter = value.trim().toLowerCase();}
}

ASC: boolean = true;
DES: boolean = false;

SORT(value: string){
  if (value === 'cost') {
    if (this.ASC) {
      this.New_product_Array.sort((a, b) => a.cost - b.cost);
      this.ASC = false;
      this.DES = true;
    } else {
      this.New_product_Array.sort((a, b) => b.cost - a.cost);
      this.ASC = true;
      this.DES = false;
    }
  } else {
    if (this.ASC) {
      this.New_product_Array.sort((a, b) => a.sale - b.sale);
      this.ASC = false;
      this.DES = true;
    } else {
      this.New_product_Array.sort((a, b) => b.sale - a.sale);
      this.ASC = true;
      this.DES = false;
    }
  }
  this.FETCH_PRODUCTS();
}

//OPEN THE CALENDAR DIALOG
OPEN_CALENDAR_DIALOG(): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '350px',
      data: { selectedDate: this.selectedDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.startDate && result.endDate) {
          this.selectedMonth = `${result.startDate.toLocaleString('default', { month: 'long' })} - ${result.endDate.toLocaleString('default', { month: 'long' })}`;
          this.productsService.FILTER_PRODUCT("custom").subscribe({
            next: (response: any) => {
              this.productsArray = new MatTableDataSource(response);
              this.totalCount = this.productsArray.data.length;
              this.Inprogress = this.btnCategoryClick('pending');
            },
            error: (error: any) => {console.log("Error:", error)},
            complete: () => {}
          });
        } else {
          this.selectedMonth = 'Custom';
        }
        this.selectedDate = result;
      }
    });
}

//UPDATE ROW VALUES
EDIT_PRODUCT(obj: any): void {
  this.ShowAddButoon = false;
  this.CurrentAction = 'Update Product'
  this.viewPRODUCT = obj;
  this.ADDED_PRODUCT = obj;
}
  // CONFIRM UPDATE
UPDATE_PRODUCT(obj: Product): void {
    this.productsService.UPDATE_PRODUCT(obj).subscribe({
      next: (response: any) => { },
      error: (error) => { },
      complete: () => {
        this.CANCEL_UPDATE();
        this.FETCH_PRODUCTS();
      }
    });
}

// DELETE 
DELETE_PRODUCT(ID: any): void {
  this.productsService.DELETE_PRODUCT(ID).subscribe({
    next: (response: any) => { },
    error: (error) => { },
    complete: () => { this.FETCH_PRODUCTS(); }
  });
}

// CANCEL UPDATE
CANCEL_UPDATE(): void {
  this.ShowAddButoon = true;
  this.CurrentAction = 'Add Product'
  this.ADDED_PRODUCT=  new Product('', '', '','', 0, 0, 0, 0);
}

// OPEN UPDATE & DELETE DIALOGS
OPEN_DIALOG(action: string, product: Product): void {
    const dialogRef = this.dialog.open(productsDialogComponent, {
      data: { action, product }
    });

    dialogRef.afterClosed().subscribe(result => {
    if (result && result.event === 'Delete') {
      this.DELETE_PRODUCT(product.barcode)
    }
  });
}

//GET THE CATEGORY LENGTH
btnCategoryClick(val: string): number {
  this.productsArray.filter = val.trim().toLowerCase();
  return this.productsArray.filteredData.length;
}

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

APPLY_SEARCH_FILTER(filterValue: string): void {
  this.productsArray.filter = filterValue.trim().toLowerCase();
}

}

//MONTHS INTERFACE
interface month {
  value: string;
  viewValue: string;
}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'products-dialog-content',
  templateUrl: 'products-dialog-content.html',
  styleUrl: 'products-dialog-content.scss'
})
// tslint:disable-next-line - Disables all
export class productsDialogComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  PRODUCT: Product

  constructor(
    public dialogRef: MatDialogRef<productsDialogComponent>,
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


