export class Product {
  _id: string;
  barcode: string;
    name: string;
    category: string;
    cost: string;
    sale: string;
    onHandQuantity: number; // New field for current quantity
    previousQuantity: number; // New field for previous quantity
    
  
    constructor(barcode: string, name: string, category: string, cost: string, sale: string, onHandQuantity: number, previousQuantity: number) {
      this.barcode = barcode;
      this.name = name;
      this.category = category;
      this.cost = cost;
      this.sale = sale;
      this.onHandQuantity = onHandQuantity;
      this.previousQuantity = previousQuantity;
    }
}