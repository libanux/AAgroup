import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Admin } from 'src/app/classes/admin.class';
import { AdminService } from 'src/app/services/Admins.service';
import { UserDialogComponent } from '../../users/users.component';
import { CustomerClass } from 'src/app/classes/customers.class';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: [
    '../../../../../assets/scss/apps/_add_expand.scss',
    '../../../../../assets/scss/apps/general_table.scss',
  ],
})
export class CustomersComponent {

  //  PANEL : OPEN AND CLOSE
  panelOpenState = false;
  open_expansion_value = 0;

  // SHOW ADD BUTTON FOR ADD CUSTOMER / IF NOT SHOWN THE UPDATE BTN WILL BE SHOWN
  ShowAddButoon = true;
  CurrentAction: string = 'Add Customer'

  // FILTER VALUES
  selectedMonth: string = '';
  selectedCategory: string = '';

  SEARCK_KEY = '';
  FILTER_TYPE = ''
  START_DATE = ''
  END_DATE = ''
  STATUS = ''

  // LOADIN SPINNER FOR BUTTONS
  SHOW_LOADING_SPINNER: boolean = false;

  // CHECK IF DAAT CHANGED TO REMOVE THE DISABLED BUTTON
  DATA_CHANGED: boolean = false;

  // MAIN CUSTOMERS ARRAY
  CUSTOMERS_ARRAY = new MatTableDataSource();
  CUSTOMMERS_ARRAY_LENGTH = 0

  // START AND END ROW FOR API
  START_ROW = 0
  END_ROW = 10;

  // OBJECTS
  //CUSTOMER TO EDIT|ADD
  // THESE TWO OBJECTS ARE TO CHECK IF THE SELECTED PRODUCT TO UPDATE HAVE DIFFERENT VALUES THAN THE MAIN ONE SO THAT THE DISBALE BUTTON IS ABLE
  // ADDED CUSTOMER IS THE CUSTOMER SELECTED BUT WITH CHANGED VALUE
  ADDED_CUSTOMER: CustomerClass = new CustomerClass()
  // MAIN CUSTOMER IS THE CUSTOMER SELECTED BUT WITHOUT CHANGED VALUE
  MAIN_SELECTED_CUSTOMER_DATA: CustomerClass = new CustomerClass()

  // TABLE SHIMMER
  show_shimmer = true;

  // PAGING
  current_page_array_length = 0

  //  TABLE COLUMNS
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'companyname', 'actions'];
  columnsToDisplayWithExpand = [...this.displayedColumns];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private customerService: CustomerService) {
    this.ADDED_CUSTOMER = new CustomerClass('', '', '', '', '', '', '');
  }

  // FETCH ALL CUSTOMERS ON START
  ngOnInit(): void {
    this.FETCH_CUSTOMERS()
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
    if (JSON.stringify(this.MAIN_SELECTED_CUSTOMER_DATA) !== JSON.stringify(this.ADDED_CUSTOMER)) {
      this.DATA_CHANGED = true;
    }
    else {
      this.DATA_CHANGED = false;
    }

  }

  OPEN_DIALOG(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        // this.ADD_ADMIN(result.data);
      } else if (result.event === 'Update') {
        // this.UPDATE_ADMIN(result.data);
      } else if (result.event === 'Delete') {
        // this.DELETE_ADMIN(result.data);
      }
    });
  }


  // FETCH ALL + ADD + UPDATE + DELETE + SELECT + SEARCH + FILTER

  // GET ALL COSTUMERS
  FETCH_CUSTOMERS() {
    this.show_shimmer = true;
    this.customerService.GET_ALL_CUSTOMER(this.START_ROW, this.END_ROW).subscribe({
      next: (response: any) => {
        console.log(response)
        // this.current_page_array_length = response.visas.length
        // this.CUSTOMMERS_ARRAY_LENGTH = response.pagination.totalVisas;
        this.CUSTOMERS_ARRAY = new MatTableDataSource(response.rows);
      },
      error: (error) => { },
      complete: () => { this.show_shimmer = false; }
    });
  }

  // FILTER
  APPLY_FILTER(filterValue: string): void {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // UPDATE CUSTOMER
  UPDATE_CUSTOMER() {

  }

  //SELECT CUSTOMER TO UPDATE
  SELECT_CUSTOMER(obj: any): void {
    // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
    this.ShowAddButoon = false;
    this.CurrentAction = 'Update Customer'
    // FILL THE OBJ WITH THE SELECTED CUSTOMER TO UPDATE
    this.ADDED_CUSTOMER = { ...obj };
    this.MAIN_SELECTED_CUSTOMER_DATA = obj;

    // OPEN THE PANEL
    this.OPEN_PANEL()
  }

  // CANCEL UPDATE
  CANCEL_UPDATE() {
    // CLOSE THE PANEL
    this.CLOSE_PANEL();
    // HIDE THE UPDATE BUTTON AND DISPLAY THE ADD BTN INSTEAD
    this.ShowAddButoon = true;
    this.CurrentAction = 'Add Customer'
    // EMPTY THE SELECTED CUSTOMER TO UPDATE
    this.MAIN_SELECTED_CUSTOMER_DATA = new CustomerClass('', '', '', '', '', '');
    this.ADDED_CUSTOMER = new CustomerClass('', '', '', '', '', '');
    //  
    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

  // ADD NEW CUSTOMER
  ADD_CUSTOMER() {
    // this.ADDED_VISA.customer =
    // {
    //   id: this.CUSTOMER_SELECTED.id,
    //   name: this.CUSTOMER_SELECTED.name,
    //   phoneNumber: this.CUSTOMER_SELECTED.phoneNumber,
    // }

    // this.SHOW_LOADING_SPINNER = true;
    // this.visaService.ADD_VISA(this.ADDED_VISA).subscribe({
    //   next: (response: any) => { },
    //   error: (error) => { },
    //   complete: () => { this.FETCH_VISA(); this.CANCEL_UPDATE(); }
    // });
  }


  expandedElement: Admin | null = null;
  //EXPAND THE ROW AND CHECK IF THE COLUMN IS ACTION THEN DO NOT EXPAND
  EXPAND_RAW(event: Event, element: any, column: string): void {
    if (column === 'action') { this.expandedElement = element; }

    else {
      this.expandedElement = this.expandedElement === element ? null : element;
      event.stopPropagation();
    }
  }

  // tslint:disable-next-line - Disables all
  DELETE_CUSTOMER(row_obj: Admin): boolean | any {
    // this.dataSource.data = this.dataSource.data.filter((value: any) => {
    // return value.id !== row_obj.id;
    // });
  }

}




