import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { stocksService } from 'src/app/services/stock.service';
import { Product, products } from 'src/app/classes/products.class';
import { Download_Options, GeneralService, Month_Filter_Array, PRODUCT_CATEGORY_ARRAY, STOCK_Array_Filter } from 'src/app/services/general.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
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

export class StockComponent implements OnInit {
  // ARRAYS 

  // STOCK FILTER
  STOCK_Filter_array: any[] = STOCK_Array_Filter
  selectedFilteraTION: string = '';
  // DOWNLOAD
  Options: any[] = Download_Options;
  selectedDownloadOption: string = 'Download as';
  ShowAddButoon = true;
  selectedMonth: string = '';

  //TABLE COLUMNS
  displayedColumns: string[] = [
    'barcode',
    'name',
    'category',
    'onHandQuantity',
    'action'
  ];

  show_shimmer = false;
  STOCKS_ARRAY_LENGTH = 0
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

  categoryArray = PRODUCT_CATEGORY_ARRAY

  //MONTHS FOR FILTER DROPDOWN
  months = Month_Filter_Array


  // DATE SELECTION
  SEARCK_KEY = '';
  FILTER_TYPE = ''
  START_DATE = ''
  END_DATE = ''
  STATUS = ''

  //MAIN stock ARRAY
  showCalendar: boolean = false;
  selectedDate: Date | null = null; // Adjusted the type to accept null
  //stockS ARRAY
  stocksArray = new MatTableDataSource<Product>([]);

  //stock ON EDIT
  viewstock: Product
  stockExample = new Product('', '', '', '', '', '', 0, 0);
  editedstock = new Product('', '', '', '', '', '', 0, 0);

  constructor(public generalService: GeneralService, public dialog: MatDialog, private stocksService: stocksService) {
    this.viewstock = new Product('', '', '', '', '', '', 0, 0);
  }

  ngOnInit(): void {
    this.FETCH_STOCKS();
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


  // cancelSelection() {
  //     this.showCalendar = false;
  //     this.selectedMonth = '';
  //     this.selectedDate = null;
  // }

  ngAfterViewInit(): void {
    this.stocksArray.paginator = this.paginator;
  }

  FILTER_BY_CATEGORY(value: string) {
    if (value == 'All') { this.FETCH_STOCKS() }
    else { this.stocksArray.filter = value.trim().toLowerCase(); }
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

  //FETCH stocksArray FROM API
  FETCH_STOCKS(): void {
    this.stocksArray = new MatTableDataSource();
  }

  SORT() {

  }

  // CANCEL UPDATE
  CANCEL_UPDATE(): void {
    this.ShowAddButoon = true;
    this.editedstock = new Product('', '', '', '', '', '', 0, 0);
  }

  APPLY_SEARCH_FILTER(filterValue: string): void {
    this.stocksArray.filter = filterValue.trim().toLowerCase();
  }

  //ADD stock
  ADD_STOCK() {
    this.stocksService.ADD_stock(this.stockExample).subscribe({
      next: (response: any) => { },
      error: (error: any) => { console.error(error); },
      complete: () => {
        this.CANCEL_UPDATE();
        this.FETCH_STOCKS();
      }
    });
  }

  //TRIGGER THE DROP DOWN FILTER VALUES
  ON_CHANGE_DROPDOWN(value: string) {
    if (value === 'Calendar') {
      // this.OPEN_CALENDAR_DIALOG();
    }
    else {
      this.stocksService.FILTER_stock(value).subscribe({
        next: (response: any) => {
          this.stocksArray = new MatTableDataSource(response);
          this.totalCount = this.stocksArray.data.length;
          // this.Inprogress = this.btnCategoryClick('pending');
        },
        error: (error: any) => {},
        complete: () => {
        }
      });
    }
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
            this.FETCH_STOCKS()
          },
          error: (error: any) => { console.error('Error:', error); },
          complete: () => { }
        });
      }
    });
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
  styleUrl: '../../../../../assets/scss/apps/_dialog_delete.scss'
})
export class deleteAjustDialogComponent {
  action: string;
  local_data: any;
  PRODUCT: Product
  categoryArray = PRODUCT_CATEGORY_ARRAY

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