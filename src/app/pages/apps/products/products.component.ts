import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductsService } from 'src/app/services/products.service';
import { Product, products } from 'src/app/classes/products.class';
import { Download_Options, GeneralService, Month_Filter_Array, PRODUCT_CATEGORY_ARRAY, STATUS_ARRAY } from 'src/app/services/general.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [
    '../../../../assets/scss/apps/_add_expand.scss',
    '../../../../assets/scss/apps/general_table.scss',
  ],
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

  // ARRAYS 
  // STATUS
  Status_Array_Filter: any[] = STATUS_ARRAY
  selectedStatusFilteraTION: string = '';
  // DOWNLOAD
  Options: any[] = Download_Options;
  selectedDownloadOption: string = 'Download as';
  //PRODUCT CATEGORIES ARRAY
  categoryArray = PRODUCT_CATEGORY_ARRAY
  //MONTHS FOR FILTER DROPDOWN
  months = Month_Filter_Array
  //PRODUCTS ARRAY
  productsArray = new MatTableDataSource<Product>([]);
  New_product_Array: Product[] = []



  // VARIABLES
  // These two valus are used for the add expnad row in the top of the page
  panelOpenState = false;
  open_expansion_value = 0;
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

  show_shimmer = false;

  ASC: boolean = true;
  DES: boolean = false;

  SHOW_LOADING_SPINNER: boolean = false;
  DATA_CHANGED: boolean = false;

  //TABLE COLUMNS
  displayedColumns: string[] = ['barcode', 'itemName', 'description', 'category', 'cost', 'sale', 'action'];
  TableHeaders: string[] = ['Barcode', 'Item Name', 'Description', 'Category', 'Cost', 'Sale', 'Action'];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: Product | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // OBJECTS
  //PRODUCT TO EDIT|ADD
  // THESE TWO OBJECTS ARE TO CHECK IF THE SELECTED PRODUCT TO UPDATE HAVE DIFFERENT VALUES THAN THE MAIN ONE SO THAT THE DISBALE BUTTON IS ABLE
  // ADDED PRODUCT IS THE PRODUCT SELECTED BUT WITH CHANGED VALUE
  ADDED_PRODUCT = new Product('', '', '', '', '', '', 0, 0);
  // MAIN PRODUCT IS THE PRODUCT SELECTED BUT WITHOUT CHANGED VALUE
  MAIN_SELECTED_PRODUCT_DATA =  new Product('', '', '', '', '', '', 0, 0);
  constructor(public generalService: GeneralService, public dialog: MatDialog, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.New_product_Array = products
    this.FETCH_PRODUCTS();
  }

// PAGING
    pageSize = 10;
    Current_page = 1
  // function when page number changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;

    if (this.STATUS != '' || this.FILTER_TYPE != '') {
      this.Current_page = event.pageIndex + 1;
      // this.FILTER_VISAS(this.SEARCK_KEY, this.FILTER_TYPE, this.START_DATE, this.END_DATE, this.STATUS)
    }

    else {
      this.Current_page = event.pageIndex + 1;
      // this.FETCH_VISA();
    }

  }
  // THIS FUNCTION IS FOR THE PAGING TO GO TO PREVOIUS PAGE
  goToPreviousPage(): void {
    if (this.paginator && this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
  }
  
  GENERATE_BARCODE() {
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10);
    }

    this.ADDED_PRODUCT.barcode = result
  }

  // Method to handle the panel closed event
  CLOSE_PANEL() {
    this.open_expansion_value = 0;
    this.panelOpenState = false
  }

  OPEN_PANEL() {
    this.open_expansion_value = 1;
    this.panelOpenState = true;
  }

  // Function to log input changes
  onInputChange() {
    // When inputs changes -> i check if they are the same as the main one
    // if they are the same keep the update button disabled
    if (JSON.stringify(this.MAIN_SELECTED_PRODUCT_DATA) !== JSON.stringify(this.ADDED_PRODUCT)) {
      this.DATA_CHANGED = true;
    }
    else {
      this.DATA_CHANGED = false;
    }

  }


  //EXPAND THE ROW AND CHECK IF THE COLUMN IS ACTION THEN DO NOT EXPAND
  EXPAND_ROW(event: Event, element: any, column: string): void {
    if (column === 'action') {
      this.expandedElement = element;
    }
    else {
      this.expandedElement = this.expandedElement === element ? null : element;
      event.stopPropagation();
    }
  }

  SORT(value: string) {
    if (value === 'cost') {
      if (this.ASC) {
        this.New_product_Array.sort((a, b) => {
          return parseFloat(a.cost) - parseFloat(b.cost);
        });
        this.ASC = false;
        this.DES = true;
      } else {
        this.New_product_Array.sort((a, b) => {
          return parseFloat(b.cost) - parseFloat(a.cost);
        });
        this.ASC = true;
        this.DES = false;
      }
    } else {
      if (this.ASC) {
        this.New_product_Array.sort((a, b) => {
          return parseFloat(a.sale) - parseFloat(b.sale);
        });
        this.ASC = false;
        this.DES = true;
      } else {
        this.New_product_Array.sort((a, b) => {
          return parseFloat(b.sale) - parseFloat(a.sale);
        });
        this.ASC = true;
        this.DES = false;
      }
    }
    this.FETCH_PRODUCTS();
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


// FETCH ALL + ADD + UPDATE + DELETE + SELECT + SEARCH + FILTER

  //FETCH productsArray FROM API
  FETCH_PRODUCTS(): void {
    this.productsArray = new MatTableDataSource(this.New_product_Array);
    this.totalCount = products.length;
    // this.productsService.GET_productsArray().subscribe({
    //   next: (response: any) => {
    //     this.productsArray = response;
    //     this.productsArray = new MatTableDataSource(this.productsArray);
    //     this.totalCount = this.productsArray.data.length;
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
    this.New_product_Array.push(this.ADDED_PRODUCT);
    this.FETCH_PRODUCTS();
    this.ADDED_PRODUCT = new Product('', '', '', '', '', '', 0, 0);

    // this.productsService.ADD_PRODUCT(obj).subscribe({
    //   next: (response: any) => { },
    //   error: (error) => { },
    //   complete: () => {
    //     this.CANCEL_UPDATE();
    //     this.FETCH_PRODUCTS();
    //   }
    // });
  }

  // UPDATE
  UPDATE_PRODUCT(): void {
    // this.productsService.UPDATE_PRODUCT(this.ADDED_PRODUCT).subscribe({
    //   next: (response: any) => { },
    //   error: (error) => { },
    //   complete: () => {
    //     this.CANCEL_UPDATE();
    //     this.FETCH_PRODUCTS();
    //   }
    // });
  }

  // DELETE 
  DELETE_PRODUCT(ID: any): void {
    // this.productsService.DELETE_PRODUCT(ID).subscribe({
    //   next: (response: any) => { },
    //   error: (error) => { },
    //   complete: () => { this.FETCH_PRODUCTS(); }
    // });
  }

  //SELECT PRODUCT TO UPDATE
  SELECTED_PRODUCT(obj: any): void {
    // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
    this.ShowAddButoon = false;
    this.CurrentAction = 'Update Product'
    // FILL THE OBJ WITH THE SELECTED PRODUCT TO UPDATE
    this.ADDED_PRODUCT = { ...obj };
    this.MAIN_SELECTED_PRODUCT_DATA = obj;
    // OPEN THE PANEL
    this.OPEN_PANEL()
  }

  // CANCEL UPDATE
  CANCEL_UPDATE(): void {
    // CLOSE THE PANEL
    this.CLOSE_PANEL();
    // HIDE THE UPDATE BUTTON AND DISPLAY THE ADD BTN INSTEAD
    this.ShowAddButoon = true;
    this.CurrentAction = 'Add Product'
    // EMPTY THE SELECTED PRODUCT TO UPDATE
    this.MAIN_SELECTED_PRODUCT_DATA = new Product('', '', '', '', '', '', 0, 0);
    this.ADDED_PRODUCT = new Product('', '', '', '', '', '', 0, 0);
    // 
    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

  // SEARCH
  APPLY_SEARCH_FILTER(filterValue: string): void {
    this.productsArray.filter = filterValue.trim().toLowerCase();
  }

}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'products-dialog-content',
  templateUrl: 'products-dialog-content.html',
  styleUrl: '../../../../assets/scss/apps/_dialog_delete.scss'
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


