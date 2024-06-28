import { Component } from '@angular/core';
import { products } from 'src/app/classes/products.class';
import { Suppliers_ARRAY } from 'src/app/services/general.service';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: [
    '../../../../../assets/scss/apps/_add_expand.scss',
    './purchase-add.component.scss',
  ],
})
export class PurchaseAddComponent {

  // VARIABLES
  // These two valus are used for the add expnad row in the top of the page
  panelOpenState = false;
  open_expansion_value = 0;

  dataSource = products;

  filteredProducts: any[]
  filteredSuppliers: any[]

  suppliers = Suppliers_ARRAY

    constructor() {
      this.filteredProducts = this.dataSource
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

      // Method to handle the panel closed event
  CLOSE_PANEL() {
    this.open_expansion_value = 0;
    this.panelOpenState = false
  }

  OPEN_PANEL() {
    this.open_expansion_value = 1;
    this.panelOpenState = true;
  }
  
    nextStep() {
      this.step++;
    }
  
    prevStep() {
      this.step--;
    }
  
    displayedColumns: string[] = [   'barcode', 'name', 'cost', 'sale', 'Quantity', 'Total','action' ];

      searchQuery: string;
    editRowIndex: number = -1;

    onEdit(element: Element, field: string, event: any, rowIndex: number) {
      this.editRowIndex = rowIndex; // Set the rowIndex to highlight the editing cell
      // Handle your edit logic here
    }



    filterProducts() {
      this.filteredProducts = this.dataSource
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.dataSource.filter(product => product.name.toLowerCase().includes(query));
    }

     // Function to handle selecting the filtered option on Enter key press
  selectFilteredOption() {
    if (this.filteredProducts.length > 0) {
      // Select the first filtered product or handle selection logic here
      console.log('Selected product:', this.filteredProducts[0]);
      // Implement your logic to do something with the selected product
    }
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
  

