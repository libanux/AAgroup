import { DatePipe } from '@angular/common';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { UserClass } from 'src/app/classes/users.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: [
    '../../../../assets/scss/apps/_add_expand.scss',
    '../../../../assets/scss/apps/general_table.scss',
  ],
})

export class UsersComponent {

  //  PANEL : OPEN AND CLOSE
  panelOpenState = false;
  open_expansion_value = 0;

  // SHOW ADD BUTTON FOR ADD CUSTOMER / IF NOT SHOWN THE UPDATE BTN WILL BE SHOWN
  ShowAddButoon = true;
  CurrentAction: string = 'Add User'

  // FILTER VALUES
  selectedMonth: string = '';
  selectedCategory: string = '';
  
  // DATE SELECTION
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
  USERS_ARRAY = new MatTableDataSource();
  USERS_ARRAY_LENGTH = 0

  // TABLE SHIMMER
  show_shimmer = true;

  // PAGING
  current_page_array_length = 0
  pageSize = 10;
  Current_page = 0

  // OBJECTS
  //CUSTOMER TO EDIT|ADD
  // THESE TWO OBJECTS ARE TO CHECK IF THE SELECTED PRODUCT TO UPDATE HAVE DIFFERENT VALUES THAN THE MAIN ONE SO THAT THE DISBALE BUTTON IS ABLE
  // ADDED CUSTOMER IS THE CUSTOMER SELECTED BUT WITH CHANGED VALUE
  ADDED_USER: UserClass = new UserClass()
  // MAIN CUSTOMER IS THE CUSTOMER SELECTED BUT WITHOUT CHANGED VALUE
  MAIN_SELECTED_UER_DATA: UserClass = new UserClass()

  //  TABLE COLUMNS
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'role', 'action'];
  columnsToDisplayWithExpand = [...this.displayedColumns];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private userService: UserService) {
    this.ADDED_USER = new UserClass('', '', '', '', '', '');
  }

  ngOnInit(): void {
    this.FETCH_USERS()
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
    this.FETCH_USERS();
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
    if (JSON.stringify(this.MAIN_SELECTED_UER_DATA) !== JSON.stringify(this.ADDED_USER)) {
      this.DATA_CHANGED = true;
    }
    else {
      this.DATA_CHANGED = false;
    }

  }

  APPLY_FILTER(filterValue: string): void {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // OPEN DELETE DIALOG
  OPEN_DIALOG(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.DELETE_USER(result.data);
    });
  }

  // FETCH ALL + ADD + UPDATE + DELETE + SELECT + SEARCH + FILTER

  // GET ALL USERS
  FETCH_USERS() {
    this.show_shimmer = true;
    this.userService.GET_ALL_USER(this.Current_page, this.pageSize).subscribe({
      next: (response: any) => {
        console.log(response)
        this.current_page_array_length = response.rows.length
        this.USERS_ARRAY_LENGTH = response.count;
        this.USERS_ARRAY = new MatTableDataSource(response.rows);
      },
      error: (error) => { },
      complete: () => { this.show_shimmer = false; }
    });
  }

  // ADD USER
  ADD_USER() {
    this.SHOW_LOADING_SPINNER = true;
    this.userService.ADD_USER(this.ADDED_USER).subscribe({
      next: (response: any) => { },
      error: (error) => { },
      complete: () => { this.FETCH_USERS(); this.CANCEL_UPDATE(); }
    });
  }

//  DELETE USER BY USER ID
  DELETE_USER(ID: any) {
    this.userService.DELETE_USER(ID).subscribe({
      next: (response: any) => {
        // CHECK IF I AM DELETING THE LAST ITEM LEFT IN THE PAGE I AM AT
        // IF YES --> GO BACK TO THE PREVOUIS PAGE
        if (this.current_page_array_length == 1) {
          this.Current_page = this.Current_page - 1
          this.goToPreviousPage()
        }
      },
      error: (error) => { },
      complete: () => { this.FETCH_USERS(); this.CANCEL_UPDATE(); }
    });
  }

  UPDATE_USER() {
    this.SHOW_LOADING_SPINNER = true;
    this.userService.UPDATE_USER(this.ADDED_USER).subscribe({
      next: (response: any) => { },
      error: (error) => { },
      complete: () => { this.FETCH_USERS(); this.CANCEL_UPDATE(); }
    });
  }

  //SELECT USER TO UPDATE
  SELECT_USER(obj: any): void {
    // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
    this.ShowAddButoon = false;
    this.CurrentAction = 'Update User'
    // FILL THE OBJ WITH THE SELECTED USER TO UPDATE
    this.ADDED_USER = { ...obj };
    this.MAIN_SELECTED_UER_DATA = obj;

    // OPEN THE PANEL
    this.OPEN_PANEL()
  }

  // CANCEL UPDATE
  CANCEL_UPDATE(): void {
    // CLOSE THE PANEL
    this.CLOSE_PANEL();
    // HIDE THE UPDATE BUTTON AND DISPLAY THE ADD BTN INSTEAD
    this.ShowAddButoon = true;
    this.CurrentAction = 'Add User'
    // EMPTY THE SELECTED USER TO UPDATE
    this.ADDED_USER = new UserClass('', '', '', '', '', '');
    this.MAIN_SELECTED_UER_DATA = new UserClass('', '', '', '', '', '');

    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: './users-dialog.component.html',
  styleUrl: '../../../../assets/scss/apps/_dialog_delete.scss'
})
// tslint:disable-next-line: component-class-suffix
export class UserDialogComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  USER_ID: any

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.USER_ID = data._id

  }



  doAction(): void {
    if(this.action == 'Delete'){
      this.dialogRef.close({ event: this.action, data: this.USER_ID });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}

