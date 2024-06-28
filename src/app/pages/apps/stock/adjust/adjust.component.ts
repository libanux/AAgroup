import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Adjust } from 'src/app/classes/adjust.class';
import { Product, products } from 'src/app/classes/products.class';
import { PRODUCT_CATEGORY_ARRAY } from 'src/app/services/general.service';

@Component({
  selector: 'app-adjust',
  templateUrl: './adjust.component.html',
  styleUrls: [
    './adjust.component.scss',
    '../../../../../assets/scss/apps/_add_expand.scss'
  ],
})
export class AdjustComponent implements OnInit {

  // These two valus are used for the add expnad row in the top of the page
  panelOpenState = false;
  open_expansion_value = 1;

  PRODUCTS_ARRAY:any [] = [];
  filteredProducts: any[]
  quantity_adjusted = 0;
  added_Product: Product = new Product('', '', '','', '', '', 0, 0);

  New_adjust_Array: Product[] = []
  ADJUST_ARRAY = new MatTableDataSource<Product>([]);
  ADJUST_ARRAY_LENGTH = 0
  
  hide = true;
  hide2 = true;
  conhide = true;
  alignhide = true;
  step = 0;

  displayedColumns: string[] = [
    'barcode',
    'name',
    'category',
    'new_quantity_on_hand',
    'quantity_available',
    'quantity_adjusted',
    'action'
  ];

  // Define your column headers
  columnHeaders = [
    { key: 'name', title: 'Item Name' },
    { key: 'barcode', title: 'Barcode' },
    { key: 'description', title: 'Description' },
    { key: 'category', title: 'Category' },
    { key: 'quantity_available', title: 'Quantity Available' },
    { key: 'new_quantity_on_hand', title: 'New Quantity on Hand' },
    { key: 'quantity_adjusted', title: 'Quantity Adjusted' },
    { key: 'action', title: 'Action' }
  ];

  // Extract the keys from columnHeaders for mat-table
  searchQuery: string;
  editRowIndex: number = -1;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.displayedColumns = this.columnHeaders.map(column => column.key);
  }

  onInputChange(element: Element, field: string, event: any, rowIndex: number) {
    this.editRowIndex = rowIndex;
    // Set the rowIndex to highlight the editing cell
    // Handle your edit logic here
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

  new_quantity_on_hand = 0
  ON_CHANGE_ADJUST_QUANTITY(element: any, field: string, event: any, rowIndex: number) {
    // console.log('element ', element)
    // console.log('field ', field)
    // console.log('event ', event)
    // console.log('rowIndex ', rowIndex)

    this.new_quantity_on_hand = element.onHandQuantity + event
    // return element.onHandQuantity*quantity_adjusted
  }

// FETCH ALL + ADD NEW PRODUCT + CREATE ADJUSTMENT + REMOVE PRODUCT + SELECT 

  //FETCH ALL PRODUCTS
  FETCH_ADJUSTS(): void {
    this.ADJUST_ARRAY = new MatTableDataSource();
  }

  // ADD PRODUCT TO THE TABLE
  ADD_ADUST(object: Product) {
    this.New_adjust_Array.push(object);
    this.FETCH_ADJUSTS();

  }

  // REMOVE ADDED PRODUCT FROM TABLE
  REMOVE_ADJUST() {
    this.New_adjust_Array.pop()
    this.FETCH_ADJUSTS()
  }

  // OPEN DIALOG TO ADD NEW PRODUCT
  OPEN_DIALOG(action: string, product: Product): void {
    const dialogRef = this.dialog.open(AdjustDialogComponent, {
      data: { action, product }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result && result.event === 'Delete') {
      //   this.DELETE_PRODUCT(product.barcode)
      // }
    });
  }

  // ADD NEW ADJUSTMENT
  CREATE_ADJUSTEMENT() {
  }

  filterProducts() {

  }

}



@Component({
  selector: 'products-dialog-content',
  templateUrl: 'adjust-dialog-content.html',
  styleUrl: '../../../../../assets/scss/apps/_dialog_delete.scss'
})
export class AdjustDialogComponent {
  action: string;
  local_data: any;
  PRODUCT: Product
  categoryArray = PRODUCT_CATEGORY_ARRAY

  constructor(
    public dialogRef: MatDialogRef<AdjustDialogComponent>,
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