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
  ADDED_UER: UserClass = new UserClass()
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
    this.ADDED_UER = new UserClass('', '', '', '', '', '');
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
    if (JSON.stringify(this.MAIN_SELECTED_UER_DATA) !== JSON.stringify(this.ADDED_UER)) {
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
      this.DELETE_ADMIN(result.data);
    });
  }

  // FETCH ALL + ADD + UPDATE + DELETE + SELECT + SEARCH + FILTER

  // GET ALL USERS
  FETCH_USERS() {
    this.show_shimmer = true;
    this.userService.GET_ALL_USER(this.Current_page, this.pageSize).subscribe({
      next: (response: any) => {
        this.current_page_array_length = response.rows.length
        this.USERS_ARRAY_LENGTH = response.count;
        this.USERS_ARRAY = new MatTableDataSource(response.rows);
      },
      error: (error) => { },
      complete: () => { this.show_shimmer = false; }
    });
  }

  // tslint:disable-next-line - Disables all
  ADD_USER(): void {
    // this.dataSource.data.unshift({
    //   id: this.admins.length + 1,
    //   Name: row_obj.Name,
    //   Position: row_obj.Position,
    //   Email: row_obj.Email,
    //   Mobile: row_obj.Mobile,

    //   DateOfJoining: new Date(),
    //   Salary: row_obj.Salary,
    //   Projects: row_obj.Projects,
    //   imagePath: row_obj.imagePath,
    // });
    // this.dialog.open(AppAddEmployeeComponent);
    this.table.renderRows();
  }

  UPDATE_USER() {

  }

  //SELECT USER TO UPDATE
  SELECT_USER(obj: any): void {
    // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
    this.ShowAddButoon = false;
    this.CurrentAction = 'Update User'
    // FILL THE OBJ WITH THE SELECTED USER TO UPDATE
    this.ADDED_UER = { ...obj };
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
    this.ADDED_UER = new UserClass('', '', '', '', '', '');
    this.MAIN_SELECTED_UER_DATA = new UserClass('', '', '', '', '', '');

    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

  // tslint:disable-next-line - Disables all
  DELETE_ADMIN(row_obj: any) {

  }

}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: './users-dialog.component.html',
  styleUrl: './users-dialog.component.scss'
})
// tslint:disable-next-line: component-class-suffix
export class UserDialogComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd',
      );
    }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }


  typeOptions = [
    { value: 'office', viewValue: 'Office' },
    { value: 'admin', viewValue: 'Admin' },

  ];
  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }

  selectedPermission: string = ''; // Track the selected permission

  toggleSubPermissions(permission: string) {
    if (this.selectedPermission === permission) {
      this.selectedPermission = ''; // If the same permission is clicked again, close it
    } else {
      this.selectedPermission = permission; // Otherwise, set the selected permission
    }
  }
}

