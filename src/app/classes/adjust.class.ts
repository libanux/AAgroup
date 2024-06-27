
export class Adjust {
    barcode: string;
    itemName: string;
    description: string;
    category: any;
    cost: number;
    sale: number;
    new_quantity_on_hand: number; // New field for current quantity
    quantity_available: number; // New field for previous quantity
    quantity_adjusted: number ;
  
    constructor(barcode: string, itemName: string, description: string, category: any, cost: number, sale: number, new_quantity_on_hand: number, quantity_available: number, quantity_adjusted: number) {
      this.barcode = barcode;
      this.itemName = itemName;
      this.description = description;
      this.category = category;
      this.cost = cost;
      this.sale = sale;
      this.new_quantity_on_hand = new_quantity_on_hand;
      this.quantity_available = quantity_available;
      this.quantity_adjusted = quantity_adjusted
    }
}
