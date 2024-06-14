import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Adjust } from 'src/app/classes/adjust.class';
import { Category, categories } from 'src/app/classes/category.class';
import { Product, products } from 'src/app/classes/products.class';

@Component({
  selector: 'app-adjust',
  templateUrl: './adjust.component.html',
  styleUrl: './adjust.component.scss'
})
export class AdjustComponent implements OnInit{

  PRODUCTS_ARRAY = products;
  filteredProducts: any[]
  quantity_adjusted = 0;
  added_Product : Product =  new Product('', '', '', '', 0, 0, 0, 0);

  New_adjust_Array: Product[] = []
  ADJUST_ARRAY = new MatTableDataSource<Product>([]);

  hide = true;
  hide2 = true;
  conhide = true;
  alignhide = true;
  step = 0;
  panelOpenState = false;

  displayedColumns: string [] = [
    'barcode',
    'itemName',
    'category',
    'new_quantity_on_hand',
    'quantity_available',
    'quantity_adjusted',
    'action'
  ];

// Define your column headers
columnHeaders = [
  { key: 'itemName', title: 'Item Name' },
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

  constructor( public dialog: MatDialog ) {
  }

  ngOnInit(): void {
    console.log(this.ADJUST_ARRAY);
    this.displayedColumns = this.columnHeaders.map(column => column.key);
  }
  

  onEdit(element: Element, field: string, event: any, rowIndex: number) {
    this.editRowIndex = rowIndex;
    // Set the rowIndex to highlight the editing cell
    // Handle your edit logic here
  }

  new_quantity_on_hand = 0
  ON_CHANGE_ADJUST_QUANTITY(element: any, field: string, event: any, rowIndex: number) {
    console.log('element ', element)
    console.log('field ', field)
    console.log('event ', event)
    console.log('rowIndex ', rowIndex)

    this.new_quantity_on_hand = element.onHandQuantity + event
    // return element.onHandQuantity*quantity_adjusted
  }

  //FETCH productsArray FROM API
  FETCH_ADJUSTS(): void {
    this.ADJUST_ARRAY = new MatTableDataSource(this.New_adjust_Array);
    console.log(this.ADJUST_ARRAY)
  }

  ADD_ADUST(object: Product) {
    this.New_adjust_Array.push(object);
    this.FETCH_ADJUSTS();
    
  }

// OPEN UPDATE & DELETE DIALOGS
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
  REMOVE_ADJUST() {
    this.New_adjust_Array.pop()
    this.FETCH_ADJUSTS()
  }

  CREATE_ADJUSTEMENT() {

  }

  filterProducts() {
    // this.filteredProducts = this.dataSource
    const query = this.searchQuery.toLowerCase();
    // this.filteredProducts = this.dataSource.filter(product => product.itemName.toLowerCase().includes(query));
  }

  displayFn(product: { id: number, name: string }): string {
    return product ? product.name : '';
  }
}



@Component({
  selector: 'products-dialog-content',
  templateUrl: 'adjust-dialog-content.html',
  styleUrl: 'adjust-dialog-content.scss'
})
export class AdjustDialogComponent {
  action: string;
  local_data: any;
  PRODUCT: Product
  categoryArray = categories
  
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