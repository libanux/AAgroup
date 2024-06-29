import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/classes/products.class';
import { Download_Options, GeneralService, Month_Filter_Array, PRODUCT_CATEGORY_ARRAY } from 'src/app/services/general.service';

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
  // CATEGORY
  CATEGORY_Array_Filter: any[] = PRODUCT_CATEGORY_ARRAY
  SELECTED_CATEGORY_FILTERATION = ''
  // DOWNLOAD
  Options: any[] = Download_Options;
  selectedDownloadOption: string = 'Download as';
  //PRODUCT CATEGORIES ARRAY
  categoryArray = PRODUCT_CATEGORY_ARRAY
  //MONTHS FOR FILTER DROPDOWN
  months = Month_Filter_Array
  //PRODUCTS ARRAY
  PRODUCTS_ARRAY = new MatTableDataSource<Product>([]);
  PRODUCTS_ARRAY_LENGTH = 0;
  // New_product_Array: Product[] = []

  //  PANEL : OPEN AND CLOSE
  panelOpenState = false;
  open_expansion_value = 1;

  // SHOW ADD BUTTON FOR ADD PRODUCTPRODUCT / IF NOT SHOWN THE UPDATE BTN WILL BE SHOWN
  ShowAddButoon = true;
  CurrentAction: string = 'Add Product'

  // FILTER VALUES
  selectedMonth: string = '';

  // DATE SELECTION
  SEARCK_KEY = '';
  FILTER_TYPE = ''
  START_DATE = ''
  END_DATE = ''
  CATEGORY = ''
// TABLE SHIMMER
  show_shimmer = false;

// SORTING FOR FETCH FUNCTION
  SORT_FIELD: string = 'id';
  SORT_ORDER: string = 'ASC';
  ASC: boolean = true;
  DESC: boolean = false;
  // LOADIN SPINNER FOR BUTTONS
  SHOW_LOADING_SPINNER: boolean = false;
    // CHECK IF DAAT CHANGED TO REMOVE THE DISABLED BUTTON
  DATA_CHANGED: boolean = false;

  //TABLE COLUMNS
  displayedColumns: string[] = ['barcode', 'name', 'category', 'cost', 'sale', 'action'];
  TableHeaders: string[] = ['Barcode', 'Name', 'Category', 'Cost', 'Sale', 'Action'];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: Product | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // OBJECTS
  //PRODUCT TO EDIT|ADD
  // THESE TWO OBJECTS ARE TO CHECK IF THE SELECTED PRODUCT TO UPDATE HAVE DIFFERENT VALUES THAN THE MAIN ONE SO THAT THE DISBALE BUTTON IS ABLE
  // ADDED PRODUCT IS THE PRODUCT SELECTED BUT WITH CHANGED VALUE
  ADDED_PRODUCT = new Product('', '', '', '', '', 0, 0);
  // MAIN PRODUCT IS THE PRODUCT SELECTED BUT WITHOUT CHANGED VALUE
  MAIN_SELECTED_PRODUCT_DATA = new Product('', '', '', '', '', 0, 0);

  // PAGING
  current_page_array_length = 0
  pageSize = 30;
  Current_page = 0


  constructor(public generalService: GeneralService, public dialog: MatDialog, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.show_shimmer = true;
    this.FETCH_PRODUCTS(this.SORT_FIELD, this.SORT_ORDER);
  }

  // function when page number changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;

    if (this.CATEGORY != '' || this.FILTER_TYPE != '') {
      this.Current_page = event.pageIndex + 1;
      this.FILTER_PRODUCTS(this.SEARCK_KEY, this.FILTER_TYPE, this.START_DATE, this.END_DATE, this.CATEGORY)
    }

    else {
    this.Current_page = event.pageIndex;
    this.FETCH_PRODUCTS(this.SORT_FIELD, this.SORT_ORDER);
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
    console.log(this.ADDED_PRODUCT)
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

  SORT(SORT_FIELD: string) {

    if (SORT_FIELD === 'cost') {
      if (this.ASC) {
        this.FETCH_PRODUCTS(SORT_FIELD, 'DESC');
        this.ASC = false;
        this.DESC = true;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'Desc'
      } 
      else {
        this.FETCH_PRODUCTS(SORT_FIELD, 'ASC');
        this.ASC = true;
        this.DESC = false;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'ASC'
      }
    } 
    
    else {
      if (this.ASC) {
        this.FETCH_PRODUCTS(SORT_FIELD, 'DESC');
        this.ASC = false;
        this.DESC = true;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'DESC'
      } 
      else {
        this.FETCH_PRODUCTS(SORT_FIELD, 'ASC');
        this.ASC = true;
        this.DESC = false;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'ASC'
      }
    }
 
  }

  // FILTERING BY DROPDOWN SELECTION : DATE OR CATEGORY
  showDatePicker = false;
  DROPDOWN_FILTERATION(value: string, dropdown: string) {
    console.log('value ', value)
    console.log('dropdown ', dropdown)

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

    // CATEGORY filtering
    else if (dropdown == 'category') {
      if (value == 'all') {
        this.FILTER_ARRAY_BY_CATEGORY('')
        this.CATEGORY = ''
      }
      else {
        this.FILTER_ARRAY_BY_CATEGORY(value)
        this.CATEGORY = value
      }
    }

    else if (dropdown == 'Download') {
      // this.DOWNLOAD(value);
      // this.selectedDownloadOption = 'Download as';
    }
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


    // OPEN DIALOG TO MAKE SURE OF DELETION
    OPEN_DIALOG(action: string, obj: any): void {
      obj.action = action;

      console.log(action)
      console.log(obj)

      const dialogRef = this.dialog.open(productsDialogComponent, {
        data: obj,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
  
        if (result.event === 'Cancel') {
         
        }
  
        else if (result.event === 'Delete') {
          this.DELETE_PRODUCT(obj._id)
        }
  
        else if (result.event === 'Add Category') {
          console.log(result.data)
          this.ADDED_PRODUCT.category = result.data
          // this.ADD_NEW_CUSTOMER(result.data);
          // this.CUSTOMER_SELECTED = result.data.name
        }
      });
    }

    
  //TRUNCATE THE TEXT INTO 20 CHARS
  TRUNCATE_TEXT(text: string, limit: number): string {
    return this.generalService.truncateText(text, limit);
  }

  //GET THE CATEGORY CLASS
  getCATEGORYClass(CATEGORY: string): string {
    switch (CATEGORY) {
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

  //FETCH PRODUCTS_ARRAY FROM API
  FETCH_PRODUCTS(SORT_FIELD: string, SORT_ORDER: string): void {
    this.productsService.GET_ALL_PRODUCT(this.Current_page, this.pageSize, SORT_FIELD, SORT_ORDER).subscribe({
      next: (response: any) => {
        this.current_page_array_length = response.products.rows.length
        this.PRODUCTS_ARRAY_LENGTH = response.products.count;
        this.PRODUCTS_ARRAY = new MatTableDataSource(response.products.rows);
      },
      error: (error) => {  this.show_shimmer = false; },
      complete: () => { this.show_shimmer = false; }
    });
  }

  //ADD PRODUCT
  ADD_PRODUCT() {
    this.show_shimmer = true;
    this.SHOW_LOADING_SPINNER = true;
    console.log(this.ADDED_PRODUCT)
    this.productsService.ADD_PRODUCT(this.ADDED_PRODUCT).subscribe({
      next: (response: any) => {},
      error: (error) => { console.log(error);  this.SHOW_LOADING_SPINNER = false; this.show_shimmer = false;},
      complete: () => { this.FETCH_PRODUCTS(this.SORT_FIELD, this.SORT_ORDER); this.CANCEL_UPDATE(); }
    });
  }

  // DELETE PRODUCT BY PRODUCT ID
  DELETE_PRODUCT(ID: any): void {
    this.show_shimmer = true;
    this.productsService.DELETE_PRODUCT(ID).subscribe({
      next: (response: any) => {
        // CHECK IF I AM DELETING THE LAST ITEM LEFT IN THE PAGE I AM AT
        // IF YES --> GO BACK TO THE PREVOUIS PAGE
        if (this.current_page_array_length == 1 && this.PRODUCTS_ARRAY_LENGTH>1) {
          this.Current_page = this.Current_page - 1
          this.goToPreviousPage()
        }
      },
      error: (error) => {  console.log(error); this.show_shimmer = false;},
      complete: () => { this.FETCH_PRODUCTS(this.SORT_FIELD, this.SORT_ORDER); this.CANCEL_UPDATE() }
    });
  }

  // UPDATE
  UPDATE_PRODUCT(): void {
    this.show_shimmer = true;
    this.SHOW_LOADING_SPINNER = true;
    this.productsService.UPDATE_PRODUCT(this.ADDED_PRODUCT).subscribe({
      next: (response: any) => { this.show_shimmer = false;  this.SHOW_LOADING_SPINNER = false;},
      error: (error) => { },
      complete: () => {
        this.CANCEL_UPDATE(); this.FETCH_PRODUCTS(this.SORT_FIELD, this.SORT_ORDER);
      }
    });
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
    this.MAIN_SELECTED_PRODUCT_DATA = new Product('', '', '', '', '', 0, 0);
    this.ADDED_PRODUCT = new Product('', '',  '', '', '', 0, 0);
    // 
    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

  
  // CATEGORY FILTERATION
  FILTER_ARRAY_BY_CATEGORY(val: any) {
    this.CATEGORY = val;   
    this.Current_page = 1;
    this.FILTER_PRODUCTS(this.SEARCK_KEY, this.FILTER_TYPE, this.START_DATE, this.END_DATE, val)
  }

  // DATE FILTERATION
  FILTER_ARRAY_BY_DATE(filter_type: any) {
    this.FILTER_TYPE = filter_type;
    this.Current_page = 1;
    this.FILTER_PRODUCTS(this.SEARCK_KEY, filter_type, this.START_DATE, this.END_DATE, this.CATEGORY)
  }

  // FILTER BY SEARCH KEY
  APPLY_SEARCH_FILTER(searchValue: string): void {
    this.Current_page = 1;
    this.SEARCK_KEY = searchValue
    this.FILTER_PRODUCTS(searchValue, this.FILTER_TYPE, this.START_DATE, this.END_DATE, this.CATEGORY)
  }

  FILTER_PRODUCTS(SEARCK_KEY: string, FILTER_TYPE: string, START_DATE: string, END_DATE: string, CATEGORY: string) {
    this.productsService.FILTER_PRODUCT(SEARCK_KEY, FILTER_TYPE, START_DATE, END_DATE, CATEGORY, this.Current_page, this.pageSize).subscribe({
      next: (response: any) => {
          console.log(response)
        this.current_page_array_length = response.pagination.totalProducts
        this.PRODUCTS_ARRAY_LENGTH = response.products.length;
        this.PRODUCTS_ARRAY = new MatTableDataSource(response.products);
      },
      error: (error) => {           
        console.log(error)
        this.PRODUCTS_ARRAY = new MatTableDataSource()
        this.PRODUCTS_ARRAY_LENGTH = 0
 },
      complete: () => { }
    });
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
  SHOW_LOADING_SPINNER: boolean = false;

  PRODUCT_SELECTED: any;
  NEW_CATEGORY: any;

  constructor(
    public dialogRef: MatDialogRef<productsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)

    this.PRODUCT_SELECTED = { ...data };
    this.action = data.action;

  }

  doAction(): void {
    this.SHOW_LOADING_SPINNER = true

    if (this.action == 'Add Category') {
      this.dialogRef.close({ event: this.action, data: this.NEW_CATEGORY });
    }

    else {
      this.dialogRef.close({ event: this.action, data: this.PRODUCT_SELECTED });
    }
  }

  CLOSE_DIALOG(event: string): void {
    this.dialogRef.close({ event: event });
  }

}


