import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Adjust } from 'src/app/classes/adjust.class';
import { Product } from 'src/app/classes/products.class';
import { PRODUCT_CATEGORY_ARRAY } from 'src/app/services/general.service';
import { ProductsService } from 'src/app/services/products.service';
import { SuppliersService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-adjust',
  templateUrl: './adjust.component.html',
  styleUrls: [
    './adjust.component.scss',
    '../../../../../assets/scss/apps/_add_expand.scss'
  ],
})
export class AdjustComponent implements OnInit {
  // PANEL : OPEN AND CLOSE
  panelOpenState = false;
  open_expansion_value = 1;

  //PRODUCTS ARRAY
  PRODUCTS_ARRAY: Product[] = [];
  PRODUCTS_ARRAY_DROPDOWN: Product[] = []
  PRODUCTS_ARRAY_DISPLYAED_LENGTH = 0
  PRODUCTS_ARRAY_DISPLYAED = new MatTableDataSource<Product>([]);
  //ADJUST ARRAY
  ADJUST_ARRAY = new MatTableDataSource<Product>([]);

  //  PRODUCT ADDED 
  ADDED_PRODUCT: Product = new Product('', '', '', '', '', 0, 0);
NEW_PRODUCT_ADDED: Product = new Product('', '', '', '', '', 0, 0);
  
filteredProducts: any[]
  quantity_adjusted = 0;

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
    { key: 'category', title: 'Category' },
    { key: 'quantity_available', title: 'Quantity Available' },
    { key: 'new_quantity_on_hand', title: 'New Quantity on Hand' },
    { key: 'quantity_adjusted', title: 'Quantity Adjusted' },
    { key: 'action', title: 'Action' }
  ];

  // Extract the keys from columnHeaders for mat-table
  searchQuery: string;
  editRowIndex: number = -1;

  constructor(public dialog: MatDialog
    , private productsService: ProductsService,
    private suppliersService: SuppliersService
  ) {
  }

  ngOnInit(): void {
    this.FETCH_PRODUCTS();
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

  // OPEN DIALOG TO ADD NEW PRODUCT
  OPEN_DIALOG(action: string, product: any): void {
    product.action = action;
    
      const dialogRef = this.dialog.open(AdjustDialogComponent, {
        data: product,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
  
        // if (result.event === 'Cancel') {
         
        // }
  
        // else if (result.event === 'Delete') {
        //   this.DELETE_PRODUCT(obj._id)
        // }
  
         if (result.event === 'Add Product') {
          this.ADDED_PRODUCT = result.data
          this.ADD_PRODUCT()
        }
      });
    }
  // ADD NEW ADJUSTMENT
  CREATE_ADJUSTEMENT() {

  }

  filterProducts() {

  }

  // ADJUST
  //FETCH ALL ADJUSTS
  FETCH_ADJUST() {
    this.PRODUCTS_ARRAY_DISPLYAED = new MatTableDataSource(this.PRODUCTS_ARRAY);
    this.PRODUCTS_ARRAY_DISPLYAED_LENGTH = this.PRODUCTS_ARRAY_DISPLYAED.filteredData.length
  }


  // PRODUCTS
  //FETCH PRODUCTS_ARRAY FROM API
  FETCH_PRODUCTS(): void {
    this.productsService.GET_ALL_PRODUCT(0, 10, 'id', 'ASC').subscribe({
      next: (response: any) => {
        // this.current_page_array_length = response.products.rows.length
        // this.PRODUCTS_ARRAY_LENGTH = response.products.count;
        this.PRODUCTS_ARRAY_DROPDOWN = response.products.rows;
      },
      error: (error) => { },
      complete: () => { }
    });
  }

  // GET SELECTED PRODUCT AND ADD IT
  onProductSelected(event: any) {
    if(event != 'Add Product'){
      this.ADDED_PRODUCT = event
      this.ADD_PRODUCT()
    }

    else {
      this.OPEN_DIALOG('Add Product', this.NEW_PRODUCT_ADDED)
    }

  }

  // ADD PRODUCT TO THE TABLE
  ADD_PRODUCT() {
    this.PRODUCTS_ARRAY.push(this.ADDED_PRODUCT);
    this.FETCH_ADJUST();

  }

  REMOVE_PRODUCT(index: number) {
    this.PRODUCTS_ARRAY.splice(index, 1); // Remove product at index
    this.FETCH_ADJUST()
  }


}



@Component({
  selector: 'products-dialog-content',
  templateUrl: 'adjust-dialog-content.html',
  styleUrl: '../../../../../assets/scss/apps/_dialog_delete.scss'
})
export class AdjustDialogComponent {
  action: string;
  NEW_PRODUCT_ADDED: any

  categoryArray = PRODUCT_CATEGORY_ARRAY

  constructor(
    public dialogRef: MatDialogRef<AdjustDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.NEW_PRODUCT_ADDED = { ...data };
    this.action = this.NEW_PRODUCT_ADDED.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.NEW_PRODUCT_ADDED });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  GENERATE_BARCODE() {
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10);
    }

    this.NEW_PRODUCT_ADDED.barcode = result
  }

}