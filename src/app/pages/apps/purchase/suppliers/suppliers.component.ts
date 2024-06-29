import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { UserDialogComponent } from '../../users/users.component';
import { SupplierClass } from 'src/app/classes/suppliers.class';
import { Download_Options } from 'src/app/services/general.service';
import { SuppliersService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: [
    '../../../../../assets/scss/apps/_add_expand.scss',
    '../../../../../assets/scss/apps/general_table.scss',
  ],
})
export class SuppliersComponent {

  //  PANEL : OPEN AND CLOSE
  panelOpenState = false;
  open_expansion_value = 1;
  // DOWNLOAD
  Options: any[] = Download_Options;
  selectedDownloadOption: string = 'Download as';
  // SHOW ADD BUTTON FOR ADD SUPPLIER / IF NOT SHOWN THE UPDATE BTN WILL BE SHOWN
  ShowAddButoon = true;
  CurrentAction: string = 'Add Supplier'
  // FILTER VALUES
  selectedMonth: string = '';
  // DATE SELECTION
  SEARCK_KEY = '';
  FILTER_TYPE = ''
  START_DATE = ''
  END_DATE = ''
  STATUS = ''

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
  displayedColumns: string[] = ['contact_name', 'companyname', 'email', 'phone', 'actions'];
  columnsToDisplayWithExpand = [...this.displayedColumns];

  //SUPPLIERS ARRAY
  SUPPLIERS_ARRAY = new MatTableDataSource();
  SUPPLIER_ARRAY_LENGTH = 0;


  // OBJECTS
  //SUPPLIER TO EDIT|ADD
  // THESE TWO OBJECTS ARE TO CHECK IF THE SELECTED SUPPLIER TO UPDATE HAVE DIFFERENT VALUES THAN THE MAIN ONE SO THAT THE DISBALE BUTTON IS ABLE
  // ADDED SUPPLIER IS THE SUPPLIER SELECTED BUT WITH CHANGED VALUE
  ADDED_SUPPLIER = new SupplierClass('', '', '', '', '');
  // MAIN SUPPLIER IS THE SUPPLIER SELECTED BUT WITHOUT CHANGED VALUE
  MAIN_SELECTED_SUPPLIER_DATA = new SupplierClass('', '', '', '', '');

  // PAGING
  current_page_array_length = 0
  pageSize = 30;
  Current_page = 0

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, public supplierService: SuppliersService) {
  }

  ngOnInit(): void {
    this.show_shimmer = true;
    this.FETCH_SUPPLIERS(this.SORT_FIELD, this.SORT_ORDER);
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

  // function when page number changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;

    // if (this.STATUS != '' || this.FILTER_TYPE != '') {
    //   this.Current_page = event.pageIndex + 1;
    //   // this.FILTER_VISAS(this.SEARCK_KEY, this.FILTER_TYPE, this.START_DATE, this.END_DATE, this.STATUS)
    // }

    // else {
    this.Current_page = event.pageIndex;
    this.FETCH_SUPPLIERS(this.SORT_FIELD, this.SORT_ORDER);
    // }

  }
  // THIS FUNCTION IS FOR THE PAGING TO GO TO PREVOIUS PAGE
  goToPreviousPage(): void {
    if (this.paginator && this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
  }

  APPLY_FILTER(filterValue: string): void {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  OPEN_DIALOG(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.DELETE_SUPPLIER(result.data);
    });
  }

  // Function to log input changes
  onInputChange() {
    // When inputs changes -> i check if they are the same as the main one
    // if they are the same keep the update button disabled
    if (JSON.stringify(this.MAIN_SELECTED_SUPPLIER_DATA) !== JSON.stringify(this.ADDED_SUPPLIER)) {
      this.DATA_CHANGED = true;
    }
    else {
      this.DATA_CHANGED = false;
    }

  }

  SORT(SORT_FIELD: string) {
    if (SORT_FIELD === 'cost') {
      if (this.ASC) {
        this.FETCH_SUPPLIERS(SORT_FIELD, 'DESC');
        this.ASC = false;
        this.DESC = true;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'Desc'
      }
      else {
        this.FETCH_SUPPLIERS(SORT_FIELD, 'ASC');
        this.ASC = true;
        this.DESC = false;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'ASC'
      }
    }

    else {
      if (this.ASC) {
        this.FETCH_SUPPLIERS(SORT_FIELD, 'DESC');
        this.ASC = false;
        this.DESC = true;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'DESC'
      }
      else {
        this.FETCH_SUPPLIERS(SORT_FIELD, 'ASC');
        this.ASC = true;
        this.DESC = false;
        this.SORT_FIELD = SORT_FIELD;
        this.SORT_ORDER = 'ASC'
      }
    }
  }

  // FETCH ALL + ADD + UPDATE + DELETE + SELECT + SEARCH + FILTER

  //FETCH SUPPLIERS_ARRAY FROM API
  FETCH_SUPPLIERS(SORT_FIELD: string, SORT_ORDER: string): void {
    this.supplierService.GET_ALL_SUPPLIER(this.Current_page, this.pageSize, SORT_FIELD, SORT_ORDER).subscribe({
      next: (response: any) => {
        this.current_page_array_length = response.rows.length
        this.SUPPLIER_ARRAY_LENGTH = response.count;
        this.SUPPLIERS_ARRAY = new MatTableDataSource(response.rows);
      },
      error: (error) => { },
      complete: () => { this.show_shimmer = false; }
    });
  }

  //ADD SUPPLIER
  ADD_SUPPLIER() {
    this.show_shimmer = true;
    this.SHOW_LOADING_SPINNER = true;
    this.supplierService.ADD_SUPPLIER(this.ADDED_SUPPLIER).subscribe({
      next: (response: any) => { },
      error: (error) => {   
        console.log(error)  
        this.show_shimmer = false;
        this.SHOW_LOADING_SPINNER = false;
      },
      complete: () => { this.FETCH_SUPPLIERS(this.SORT_FIELD, this.SORT_ORDER); this.CANCEL_UPDATE(); }
    });
  }

  // DELETE SUPPLIER BY SUPPLIER ID
  DELETE_SUPPLIER(ID: any): void {
    this.show_shimmer = true;
    this.supplierService.DELETE_SUPPLIER(ID).subscribe({
      next: (response: any) => {
        // CHECK IF I AM DELETING THE LAST ITEM LEFT IN THE PAGE I AM AT
        // IF YES --> GO BACK TO THE PREVOUIS PAGE
        if (this.current_page_array_length == 1) {
          this.Current_page = this.Current_page - 1
          this.goToPreviousPage()
        }
      },
      error: (error) => { },
      complete: () => { this.FETCH_SUPPLIERS(this.SORT_FIELD, this.SORT_ORDER); this.CANCEL_UPDATE() }
    });
  }

  // UPDATE
  UPDATE_SUPPLIER(): void {
    this.show_shimmer = true;
    this.SHOW_LOADING_SPINNER = true;
    this.supplierService.UPDATE_SUPPLIER(this.ADDED_SUPPLIER).subscribe({
      next: (response: any) => { },
      error: (error) => { },
      complete: () => {
        this.CANCEL_UPDATE(); this.FETCH_SUPPLIERS(this.SORT_FIELD, this.SORT_ORDER);
      }
    });
  }


  //SELECT SUPPLIER TO UPDATE
  SELECTED_SUPPLIER(obj: any): void {
    // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
    this.ShowAddButoon = false;
    this.CurrentAction = 'Update Supplier'
    // FILL THE OBJ WITH THE SELECTED SUPPLIER TO UPDATE
    this.ADDED_SUPPLIER = { ...obj };
    this.MAIN_SELECTED_SUPPLIER_DATA = obj;
    // OPEN THE PANEL
    this.OPEN_PANEL()
  }

  // CANCEL UPDATE
  CANCEL_UPDATE(): void {
    // CLOSE THE PANEL
    this.CLOSE_PANEL();
    // HIDE THE UPDATE BUTTON AND DISPLAY THE ADD BTN INSTEAD
    this.ShowAddButoon = true;
    this.CurrentAction = 'Add Supplier'
    // EMPTY THE SELECTED SUPPLIER TO UPDATE
    this.ADDED_SUPPLIER = new SupplierClass('', '', '', '', '');
    this.MAIN_SELECTED_SUPPLIER_DATA = new SupplierClass('', '', '', '', '');

    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

}



