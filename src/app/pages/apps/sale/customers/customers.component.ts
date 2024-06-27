import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Admin } from 'src/app/classes/admin.class';
import { AdminService } from 'src/app/services/Admins.service';
import { UserDialogComponent } from '../../users/users.component';

import { Customer, customersArray } from 'src/app/classes/customers.class';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: [
    '../../../../../assets/scss/apps/_add_expand.scss',
    '../../../../../assets/scss/apps/general_table.scss',
  ],})
export class CustomersComponent {
 // VARIABLES
  // These two valus are used for the add expnad row in the top of the page
  panelOpenState = false;
  open_expansion_value = 0;
  // SHOW ADD BUTTON FOR ADD CUSTOMER / IF NOT SHOWN THE UPDATE BTN WILL BE SHOWN
  ShowAddButoon = true;
  CurrentAction: string = 'Add Customer'
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

  
  SHOW_LOADING_SPINNER: boolean = false;
  DATA_CHANGED: boolean = false;

  showUpdate: boolean = false;
  customers : Customer [] = [];
SELECTED_CUSTOMER: Customer
  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'email',
    'phone',
    'companyname',
    'balance',
    'actions'
  ];
    
  dataSource = new MatTableDataSource(this.customers);
  columnsToDisplayWithExpand = [...this.displayedColumns];
  
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  
  constructor(public dialog: MatDialog, public datePipe: DatePipe, private adminService : AdminService) {
    this.SELECTED_CUSTOMER = new Customer('','','','','','', '');
   }
  
  ngOnInit(): void {
    this.FETCH_ADMINS()
    this.dataSource = new MatTableDataSource(this.customers);
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
  
  FETCH_ADMINS(){
    this.customers = customersArray
      // this.adminService.GET_ALL_ADMINS().subscribe({
      //   next: (response: any) => {
      //     console.log(response)
      //     this.admins = response
      //     console.log(this.dataSource)
      //   },
      //   error: (error) => {},
      //   complete: () => {}
      // });
  }
  
  APPLY_FILTER(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  UPDATE_CUSTOMER(){

  }

  
  //SELECT CUSTOMER TO UPDATE
  SELECT_CUSTOMER(obj: any): void {
    // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
    this.ShowAddButoon = false;
    this.CurrentAction = 'Update Customer'
    // FILL THE OBJ WITH THE SELECTED CUSTOMER TO UPDATE
    this.SELECTED_CUSTOMER = { ...obj };
    // OPEN THE PANEL
    this.OPEN_PANEL()
  }

  // CANCEL UPDATE
  CANCEL_UPDATE(): void {
    // CLOSE THE PANEL
    this.CLOSE_PANEL();
    // HIDE THE UPDATE BUTTON AND DISPLAY THE ADD BTN INSTEAD
    this.ShowAddButoon = true;
    this.CurrentAction = 'Add Customer'
    // EMPTY THE SELECTED CUSTOMER TO UPDATE
    // this.SELECTED_CUSTOMER = new CUSTOMER('', '', '', '', '', '', 0, 0);
    // 
    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }
  
  // tslint:disable-next-line - Disables all
  ADD_CUSTOMER(): void {
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
  
  
  expandedElement: Admin | null = null;
  //EXPAND THE ROW AND CHECK IF THE COLUMN IS ACTION THEN DO NOT EXPAND
  EXPAND_RAW(event: Event, element: any, column: string): void {
      if (column === 'action') 
        { this.expandedElement = element; }
  
      else {
        this.expandedElement = this.expandedElement === element ? null : element;
        event.stopPropagation();
          }
  }
  
  // tslint:disable-next-line - Disables all
  DELETE_CUSTOMER(row_obj: Admin): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      // return value.id !== row_obj.id;
    });
  }
  
  }


  
  
