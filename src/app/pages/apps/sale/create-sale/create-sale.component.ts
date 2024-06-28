import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { products } from 'src/app/classes/products.class';
import { Suppliers_ARRAY } from 'src/app/services/general.service';
interface Supplier {
  id: number;
  name: string;
}
@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: [
    './create-sale.component.scss',     
    '../../../../../assets/scss/apps/_add_expand.scss',
  ],
 
})
export class CreateSaleComponent {
    // VARIABLES
  // These two valus are used for the add expnad row in the top of the page
  panelOpenState = false;
  open_expansion_value = 0;

  dataSource = products;
  filteredProducts: any[]
  filteredSuppliers: any[]
  paymentOption: string = 'full';
  suppliers = Suppliers_ARRAY

    constructor() {
      this.filteredProducts = products
      this.filteredSuppliers = this.suppliers
    }
    hide = true;
    hide2 = true;
    conhide = true;
    alignhide = true;
  

    // 3 accordian
    step = 0;
  
    setStep(index: number) {
      this.step = index;
    }
  
    nextStep() {
      this.step++;
    }
  
    prevStep() {
      this.step--;
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
    displayedColumns: string[] = [  
      'barcode',
      'name',
      'description',
      'category',
      'cost',
      'sale',
      'action'
      ];

  
      
      getTotalSale() {
        // console.log("bb",this.dataSource.map(t => t.sale).reduce((acc, value) => acc + value, 0))
        // return this.dataSource.map(t => t.sale).reduce((acc, value) => acc + value, 0);
      }
      searchQuery: string;
    editRowIndex: number = -1;

    onEdit(element: Element, field: string, event: any, rowIndex: number) {
      this.editRowIndex = rowIndex; // Set the rowIndex to highlight the editing cell
      // Handle your edit logic here
    }



    filterProducts() {
      // this.filteredProducts = this.dataSource
      console.log("filtered prod",this.filteredProducts)
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.dataSource.filter(product => product.name.toLowerCase().includes(query));
    }

    filterSuppliers() {
      this.filteredSuppliers = this.suppliers
      const query = this.searchQuery.toLowerCase();
      this.filteredSuppliers = this.suppliers.filter(supplier => supplier.name.toLowerCase().includes(query));
    }
  
  
    addNewProduct() {
      // Logic to add a new product
      console.log('Add new product clicked');
    }
  
    displayFn(product: { id: number, name: string }): string {
      return product ? product.name : '';
    }
}
