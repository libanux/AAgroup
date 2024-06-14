import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Category } from 'src/app/classes/category.class';
import { GeneralService } from 'src/app/services/general.service';
import { adjustmentsService } from 'src/app/services/adjustment.service';
import { Adjustment, adjustments } from 'src/app/classes/adjustment.class';

@Component({
  selector: 'app-adjustement',
  templateUrl: './adjustement.component.html',
  styleUrl: './adjustement.component.scss',
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

export class AdjustementComponent implements OnInit {

  ShowAddButoon = true;
  selectedMonth: string = '';

  //TABLE COLUMNS
  displayedColumns: string[] = [
    'id',
    'dateCreation',
    'user',
    'adjustedItems',
    'description',
    'LastModifiedTime',
    'LastModifiedUser',
    'action'
  ];

  TableHeaders: string[] = [
    'ID',
    'Date Creation',
    'User',
    'Adjusted Products',
    'description',
    'Last Modified Date',
    'Last Modified User',
    'Action'
  ];

  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: Adjustment | null = null;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  // 
  selectedCategory: string = '';
  searchText: any;
  totalCount = 0;
  Cancelled = 0;
  Inprogress = 0;
  Completed = 0;


  //MONTHS FOR FILTER DROPDOWN
  months: month[] = [
    { value: 'today', viewValue: 'Today' },
    { value: 'yesterday', viewValue: 'Yesterday' },
    { value: 'last Week', viewValue: 'Last Week' },
    { value: 'Last Month', viewValue: 'Last Month' },
    { value: 'Last Year', viewValue: 'Last Year' },
    { value: 'Calendar', viewValue: 'Custom' },
  ];

 //MAIN stock ARRAY
 showCalendar: boolean = false;
 selectedDate: Date | null = null; // Adjusted the type to accept null
//stockS ARRAY
ADJUSTMENTsArray = new MatTableDataSource<Adjustment>([]);

  //stock ON EDIT
  viewADJUSTMENT: Adjustment
  ADJUSTMENTExample = new Adjustment('', '', '', '', '', '', '');
  editedADJUSTMENT = new Adjustment('', '', '', '', '', '', '');

constructor(public generalService: GeneralService, public dialog: MatDialog, private AdjustmentService: adjustmentsService) {
  this.viewADJUSTMENT = new Adjustment('', '', '', '', '', '', '');
}

ngOnInit(): void {
  this.FETCH_ADJUSTMENTS();
}

onDateSelect(date: Date) {
  console.log('Selected Date:', date);
}

// cancelSelection() {
//     this.showCalendar = false;
//     this.selectedMonth = '';
//     this.selectedDate = null;
// }

ngAfterViewInit(): void {
  this.ADJUSTMENTsArray.paginator = this.paginator;
}

FILTER_BY_CATEGORY(value: string){
  if(value == 'All'){this.FETCH_ADJUSTMENTS()}
  else {this.ADJUSTMENTsArray.filter = value.trim().toLowerCase();}
}

//EXPAND THE ROW AND CHECK IF THE COLUMN IS ACTION THEN DO NOT EXPAND
expandRow(event: Event, element: any, column: string): void {
    if (column === 'action') {
      this.expandedElement = element;
    }
    else {
      this.expandedElement = this.expandedElement === element ? null : element;
      event.stopPropagation();
    }
}

//FETCH stocksArray FROM API
FETCH_ADJUSTMENTS(): void {
  this.ADJUSTMENTsArray = new MatTableDataSource(adjustments);
  // this.totalCount = stockArray.length;
    // this.AdjustmentService.GET_stocksArray().subscribe({
    //   next: (response: any) => {
    //     this.stocksArray = response;
    //     this.dataSource = new MatTableDataSource(this.stocksArray);
    //     this.totalCount = this.dataSource.data.length;
    //     this.Inprogress = this.btnCategoryClick('pending');
    //     // this.Completed = this.btnCategoryClick('complete');
    //     // this.Cancelled = this.btnCategoryClick('cancelled');
    //   },
    //   error: (error: any) => {
    //     console.log("Error:", error)
    //   },
    //   complete: () => {
    //   }
    // });
}

SORT(){

}

// CANCEL UPDATE
CANCEL_UPDATE(): void {
  this.ShowAddButoon = true;
  this.editedADJUSTMENT = new Adjustment('', '', '', '', '', '', '');
}

APPLY_SEARCH_FILTER(filterValue: string): void {
  this.ADJUSTMENTsArray.filter = filterValue.trim().toLowerCase();
}

//ADD stock
ADD_ADJUSTMENT() {
    this.AdjustmentService.ADD_ADJUSTMENT(this.ADJUSTMENTExample).subscribe({
      next: (response: any) => {},
      error: (error: any) => {console.error(error);},
      complete: () => {    
        this.CANCEL_UPDATE();
        this.FETCH_ADJUSTMENTS();}
    });
}

//TRIGGER THE DROP DOWN FILTER VALUES
ON_CHANGE_DROPDOWN(value: string) {
    if (value === 'Calendar') {
      this.OPEN_CALENDAR_DIALOG();
    }
    else{
      this.AdjustmentService.FILTER_ADJUSTMENT(value).subscribe({
        next: (response: any) => {
          this.ADJUSTMENTsArray = new MatTableDataSource(response);
          this.totalCount = this.ADJUSTMENTsArray.data.length;
          // this.Inprogress = this.btnCategoryClick('pending');
        },
        error: (error: any) => {
          console.log("Error:", error)
        },
        complete: () => {
        }
      });
    }
}

//OPEN THE CALENDAR DIALOG
OPEN_CALENDAR_DIALOG(): void {
    // const dialogRef = this.dialog.open(CalendarDialogComponent, {
    //   width: '350px',
    //   data: { selectedDate: this.selectedDate }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    //   if (result) {
    //     if (result.startDate && result.endDate) {
    //       this.selectedMonth = `${result.startDate.toLocaleString('default', { month: 'long' })} - ${result.endDate.toLocaleString('default', { month: 'long' })}`;
    //       this.AdjustmentService.FILTER_stock("custom").subscribe({
    //         next: (response: any) => {
    //           console.log("Response:", response)
    //           this.stocksArray = response;
    //           this.dataSource = new MatTableDataSource(this.stocksArray);
    //           this.totalCount = this.dataSource.data.length;
    //           this.Inprogress = this.btnCategoryClick('pending');
    //         },
    //         error: (error: any) => {
    //           console.log("Error:", error)
    //         },
    //         complete: () => {
    //         }
    //       });
    //     } else {
    //       this.selectedMonth = 'Custom';
    //     }
    //     this.selectedDate = result;
    //   }
    // });
}

//UPDATE ROW VALUES
EDIT_ADJUSTMENT(obj: any): void {
  this.ShowAddButoon = false
  this.viewADJUSTMENT = obj;
  this.editedADJUSTMENT = obj;
}


// OPEN UPDATE & DELETE DIALOGS
OPEN_DIALOG(action: string, delstock: Adjustment): void {
//     const dialogRef = this.dialog.open(deleteAjustDialogComponent, {
//       data: { action, delstock }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result && result.event === 'Delete') {

// this.AdjustmentService.DELETE_stock(delstock).subscribe({
//     next: (response: any) => {
//         console.log('Response:', response);
//          this.FETCH_STOCKS()
//     },
//     error: (error: any) => {console.error('Error:', error);},
//     complete: () => { }
//       });
//     }
//   });
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
