import { DatePipe } from '@angular/common';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
  pageSize = 10;
  Current_page = 0

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

  //  PAGING
  // function when page number changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;

    // if (this.STATUS != '' || this.FILTER_TYPE != '') {
    //   this.Current_page = event.pageIndex + 1;
    //   // this.FILTER_VISAS(this.SEARCK_KEY, this.FILTER_TYPE, this.START_DATE, this.END_DATE, this.STATUS)
    // }

    // else {
      this.Current_page = event.pageIndex;
      this.FETCH_CUSTOMERS();
    // }

  }

  // THIS FUNCTION IS FOR THE PAGING TO GO TO PREVOIUS PAGE
  goToPreviousPage(): void {
    if (this.paginator && this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
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

  // OPEN DELETE DIALOG
  OPEN_DIALOG(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(CustomersDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.DELETE_CUSTOMER(result.data);
    });
  }

  // FETCH ALL + ADD + UPDATE + DELETE + SELECT + SEARCH + FILTER

  // GET ALL COSTUMERS
  FETCH_CUSTOMERS() {
    this.show_shimmer = true;
    this.customerService.GET_ALL_CUSTOMER(this.Current_page, this.pageSize).subscribe({
      next: (response: any) => {
        this.current_page_array_length = response.rows.length
        this.CUSTOMMERS_ARRAY_LENGTH = response.count;
        this.CUSTOMERS_ARRAY = new MatTableDataSource(response.rows);
      },
      error: (error) => { },
      complete: () => { this.show_shimmer = false; }
    });
  }

  // ADD NEW CUSTOMER
  ADD_CUSTOMER() {
    this.SHOW_LOADING_SPINNER = true;
    this.customerService.ADD_CUSTOMER(this.ADDED_CUSTOMER).subscribe({
      next: (response: any) => { },
      error: (error) => { },
      complete: () => { this.FETCH_CUSTOMERS(); this.CANCEL_UPDATE(); }
    });
  }

  // UPDATE CUSTOMER
  UPDATE_CUSTOMER() {
    this.SHOW_LOADING_SPINNER = true;
    this.customerService.UPDATE_CUSTOMER(this.ADDED_CUSTOMER).subscribe({
      next: (response: any) => { },
      error: (error) => { },
      complete: () => { this.FETCH_CUSTOMERS(); this.CANCEL_UPDATE(); }
    });
  }

  // DELETE COSTUMER
  DELETE_CUSTOMER(ID: any) {
    this.customerService.DELETE_CUSTOMER(ID).subscribe({
      next: (response: any) => {
        // CHECK IF I AM DELETING THE LAST ITEM LEFT IN THE PAGE I AM AT
        // IF YES --> GO BACK TO THE PREVOUIS PAGE
        if (this.current_page_array_length == 1) {
          this.Current_page = this.Current_page - 1
          this.goToPreviousPage()
        }
      },
      error: (error) => { },
      complete: () => { this.FETCH_CUSTOMERS(); this.CANCEL_UPDATE(); }
    });
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

  // FILTER
  APPLY_FILTER(filterValue: string): void {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'customer-dialog-content',
  templateUrl: 'customer-dialog-content.html',
  styleUrl: '../../../../../assets/scss/apps/_dialog_delete.scss'
})
// tslint:disable-next-line - Disables all
export class CustomersDialogComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  CUSTOMER_ID: any
  CUSTOMER_NAME: any

  constructor(
    public dialogRef: MatDialogRef<CustomersDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.CUSTOMER_ID = data._id
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.CUSTOMER_ID });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}




