import { Component, OnInit } from '@angular/core';
import { Product, products } from 'src/app/classes/products.class';
import { SupplierClass } from 'src/app/classes/suppliers.class';
import { Suppliers_ARRAY } from 'src/app/services/general.service';
import { ProductsService } from 'src/app/services/products.service';
import { SuppliersService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: [
    '../../../../../assets/scss/apps/_add_expand.scss',
    './purchase-add.component.scss',
  ],
})
export class PurchaseAddComponent implements OnInit {
  PURCHASE_ARRAY_LENGTH = 0

  // PANEL : OPEN AND CLOSE
  panelOpenState = false;
  open_expansion_value = 1;

  //PRODUCTS ARRAY
  PRODUCTS_ARRAY: Product[] = [];
  //SUPPLIERS ARRAY
  SUPPLIER_ARRAY: SupplierClass[] = [];
  //PURCHASE ARRAY
  PURCHASE_ARRAY: any[] = [];

  ADDED_PRODUCT: Product = new Product('', '', '', '', '', '', 0, 0);


  // 3 accordian
  step = 0;



  filteredProducts: any[]
  filteredSuppliers: any[]

  suppliers = Suppliers_ARRAY

  constructor(private productsService: ProductsService,
    private suppliersService: SuppliersService
  ) {
  }

  ngOnInit(): void {
    this.FETCH_PRODUCTS();
    this.FETCH_SUPPLIERS();
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

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  displayedColumns: string[] = ['barcode', 'name', 'cost', 'sale', 'Quantity', 'Total', 'action'];

  searchQuery: string;
  editRowIndex: number = -1;

  onEdit(element: Element, field: string, event: any, rowIndex: number) {
    this.editRowIndex = rowIndex; // Set the rowIndex to highlight the editing cell
    // Handle your edit logic here
  }

  onProductSelected(event: any) {

  // Add the selected product to PURCHASE_ARRAY
  this.PURCHASE_ARRAY.push(event);   
  this.FETCH_PURCHASE_ARRAY(event)
  // if (event != 'Add New Customer') {

      // this.ADDED_PRODUCT =
      // {
      //   _id: event._id,
      //   name: event.name,
      //   phoneNumber: event.phoneNumber
      // }

    // }

    // else {
    //   this.CUSTOMER_SELECTED = { id: '', name: '', phoneNumber: '' }
    //   this.OPEN_DIALOG('Add New Customer', this.NEW_CUSTOMER_ADDED)
    // }


  }

  // Function to handle selecting the filtered option on Enter key press
  selectFilteredOption() {
    if (this.filteredProducts.length > 0) {
      // Select the first filtered product or handle selection logic here
      // Implement your logic to do something with the selected product
    }
  }


  filterSuppliers() {
    // this.filteredSuppliers = this.suppliers
    // const query = this.searchQuery.toLowerCase();
    // this.filteredSuppliers = this.suppliers.filter(supplier => supplier.name.toLowerCase().includes(query));
  }


  addNewProduct() {
    // Logic to add a new product
    console.log('Add new product clicked');
  }


  //FETCH PRODUCTS_ARRAY FROM API
  FETCH_PRODUCTS(): void {
    this.productsService.GET_ALL_PRODUCT(0, 10, 'id', 'ASC').subscribe({
      next: (response: any) => {
        // this.current_page_array_length = response.products.rows.length
        // this.PRODUCTS_ARRAY_LENGTH = response.products.count;
        this.PRODUCTS_ARRAY = response.products.rows;
      },
      error: (error) => { },
      complete: () => {  }
    });
  }

  //FETCH SUPPLIERS FROM API
  FETCH_SUPPLIERS(): void {
    this.suppliersService.GET_ALL_SUPPLIER(0, 10, 'id', 'ASC').subscribe({
      next: (response: any) => {
        // this.current_page_array_length = response.products.rows.length
        // this.PRODUCTS_ARRAY_LENGTH = response.products.count;
        this.SUPPLIER_ARRAY = response.rows;
      },
      error: (error) => { },
      complete: () => {  }
    });
  }

  FETCH_PURCHASE_ARRAY(obj:any){
    this.PURCHASE_ARRAY.push(obj)
    this.ADDED_PRODUCT = new Product('', '', '', '', '', '', 0, 0);
  }

}


