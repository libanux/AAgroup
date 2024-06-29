import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { stocksService } from 'src/app/services/stock.service';
import { Download_Options, GeneralService, Month_Filter_Array, PRODUCT_CATEGORY_ARRAY, STOCK_Array_Filter } from 'src/app/services/general.service';
import { StockClass } from 'src/app/classes/stock.class';

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
  //STOCK CATEGORIES ARRAY
  categoryArray = PRODUCT_CATEGORY_ARRAY
  //MONTHS FOR FILTER DROPDOWN
  months = Month_Filter_Array
  // DOWNLOAD
  Options: any[] = Download_Options;
  selectedDownloadOption: string = 'Download as';
  ShowAddButoon = true;
  selectedMonth: string = '';
  //STOCKS ARRAY
  STOCKS_ARRAY = new MatTableDataSource<StockClass>([]);
  STOCKS_ARRAY_LENGTH = 0;
  //TABLE COLUMNS
  displayedColumns: string[] = ['barcode', 'product_id', 'category', 'on_hand_quantity', 'action'];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: StockClass | null = null;
  // SORTING FOR FETCH FUNCTION
  SORT_FIELD: string = 'id';
  SORT_ORDER: string = 'ASC';
  ASC: boolean = true;
  DESC: boolean = false;
  // TABLE SHIMMER
  show_shimmer = false;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // DATE SELECTION
  SEARCK_KEY = '';
  FILTER_TYPE = ''
  START_DATE = ''
  END_DATE = ''
  STATUS = ''

  // PAGING
  current_page_array_length = 0
  pageSize = 30;
  Current_page = 0

  //MAIN stock ARRAY
  showCalendar: boolean = false;
  selectedDate: Date | null = null; // Adjusted the type to accept null
  //stockS ARRAY

  //stock ON EDIT
  stockExample = new StockClass('', '', '', '', '');
  editedstock = new StockClass('', '', '', '', '');

  constructor(public generalService: GeneralService, public dialog: MatDialog, private stocksService: stocksService) {
  }

  ngOnInit(): void {
    this.show_shimmer = true;
    this.FETCH_STOCKS(this.SORT_FIELD, this.SORT_ORDER);
   }


  // function when page number changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;

    // if (this.STATUS != '' || this.FILTER_TYPE != '') {
    //   this.Current_page = event.pageIndex + 1;
      // this.FILTER_VISAS(this.SEARCK_KEY, this.FILTER_TYPE, this.START_DATE, this.END_DATE, this.STATUS)
    // }

    // else {
      this.Current_page = event.pageIndex + 1;
      this.FETCH_STOCKS(this.SORT_FIELD, this.SORT_ORDER);
    // }

  }
  // THIS FUNCTION IS FOR THE PAGING TO GO TO PREVOIUS PAGE
  goToPreviousPage(): void {
    if (this.paginator && this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
  }

  FILTER_BY_CATEGORY(value: string) {
    // if (value == 'All') { this.FETCH_STOCKS() }
    // else { this.stocksArray.filter = value.trim().toLowerCase(); }
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



  SORT() {

  }

  
  APPLY_SEARCH_FILTER(filterValue: string): void {
    // this.stocksArray.filter = filterValue.trim().toLowerCase();
  }


  //TRIGGER THE DROP DOWN FILTER VALUES
  ON_CHANGE_DROPDOWN(value: string) {
    if (value === 'Calendar') {
      // this.OPEN_CALENDAR_DIALOG();
    }
    else {
      
    }
  }



  // OPEN UPDATE & DELETE DIALOGS
  OPEN_DIALOG(action: string, delstock: StockClass): void {
    const dialogRef = this.dialog.open(deleteAjustDialogComponent, {
      data: { action, delstock }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event === 'Delete') {

        // this.stocksService.DELETE_stock(delstock).subscribe({
        //   next: (response: any) => {
        //     this.FETCH_STOCKS()
        //   },
        //   error: (error: any) => { console.error('Error:', error); },
        //   complete: () => { }
        // });
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

  //FETCH STOCKS_ARRAY FROM API
  FETCH_STOCKS(SORT_FIELD: string, SORT_ORDER: string): void {
    this.stocksService.GET_ALL_STOCKS(this.Current_page, this.pageSize, SORT_FIELD, SORT_ORDER).subscribe({
      next: (response: any) => {
        console.log(response)
        this.current_page_array_length = response.stock.stock.length
        this.STOCKS_ARRAY_LENGTH = response.stock.count;
        this.STOCKS_ARRAY = new MatTableDataSource(response.stock.stock);
      },
      error: (error) => {  this.show_shimmer = false; },
      complete: () => { this.show_shimmer = false; }
    });
  }

  //ADD STOCK
  ADD_STOCK() {
    // this.show_shimmer = true;
    // this.SHOW_LOADING_SPINNER = true;
    // this.STOCKsService.ADD_STOCK(this.ADDED_STOCK).subscribe({
    //   next: (response: any) => {},
    //   error: (error) => { this.SHOW_LOADING_SPINNER = false},
    //   complete: () => { this.FETCH_STOCKS(this.SORT_FIELD, this.SORT_ORDER); this.CANCEL_UPDATE(); }
    // });
  }

  // DELETE STOCK BY STOCK ID
  DELETE_STOCK(ID: any): void {
    // this.show_shimmer = true;
    // this.STOCKsService.DELETE_STOCK(ID).subscribe({
    //   next: (response: any) => {
    //     // CHECK IF I AM DELETING THE LAST ITEM LEFT IN THE PAGE I AM AT
    //     // IF YES --> GO BACK TO THE PREVOUIS PAGE
    //     if (this.current_page_array_length == 1 && this.STOCKS_ARRAY_LENGTH>1) {
    //       this.Current_page = this.Current_page - 1
    //       this.goToPreviousPage()
    //     }
    //   },
    //   error: (error) => {  },
    //   complete: () => { this.FETCH_STOCKS(this.SORT_FIELD, this.SORT_ORDER); this.CANCEL_UPDATE() }
    // });
  }

  // UPDATE
  UPDATE_STOCK(): void {
    // this.show_shimmer = true;
    // this.SHOW_LOADING_SPINNER = true;
    // this.stocksService.UPDATE_STOCK(this.ADDED_STOCK).subscribe({
    //   next: (response: any) => { },
    //   error: (error) => { },
    //   complete: () => {
    //     this.CANCEL_UPDATE(); this.FETCH_STOCKS(this.SORT_FIELD, this.SORT_ORDER);
    //   }
    // });
  }

  // //SELECT STOCK TO UPDATE
  // SELECTED_STOCK(obj: any): void {
  //   // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
  //   this.ShowAddButoon = false;
  //   this.CurrentAction = 'Update STOCK'
  //   // FILL THE OBJ WITH THE SELECTED STOCK TO UPDATE
  //   this.ADDED_STOCK = { ...obj };
  //   this.MAIN_SELECTED_STOCK_DATA = obj;
  //   // OPEN THE PANEL
  //   this.OPEN_PANEL()
  // }

  // // CANCEL UPDATE
  // CANCEL_UPDATE(): void {
  //   // CLOSE THE PANEL
  //   this.CLOSE_PANEL();
  //   // HIDE THE UPDATE BUTTON AND DISPLAY THE ADD BTN INSTEAD
  //   this.ShowAddButoon = true;
  //   this.CurrentAction = 'Add STOCK'
  //   // EMPTY THE SELECTED STOCK TO UPDATE
  //   this.MAIN_SELECTED_STOCK_DATA = new STOCK('', '', '', '', '', 0, 0);
  //   this.ADDED_STOCK = new STOCK('', '',  '', '', '', 0, 0);
  //   // 
  //   this.DATA_CHANGED = false;
  //   this.SHOW_LOADING_SPINNER = false
  // }
}

//MONTHS INTERFACE
interface month {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'STOCKs-dialog-content',
  templateUrl: 'delete-dialog-content.html',
  styleUrl: '../../../../../assets/scss/apps/_dialog_delete.scss'
})
export class deleteAjustDialogComponent {
  action: string;
  local_data: any;
  STOCK: any
  categoryArray = PRODUCT_CATEGORY_ARRAY

  constructor(
    public dialogRef: MatDialogRef<deleteAjustDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
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