import { products } from "./products.class";

export class Adjustment {
  id: string;
  dateCreation: string;
  LastModifiedTime: string;
  LastModifiedUser: string;
  adjustedItems: string;
  user: string;
  description: string;

  constructor(id: string, dateCreation: string, LastModifiedTime: string, LastModifiedUser: string, adjustedItems: string, user: string, description: string) {
      this.id = id;
      this.dateCreation = dateCreation;
      this.LastModifiedTime = LastModifiedTime;
      this.LastModifiedUser = LastModifiedUser;
      this.adjustedItems = adjustedItems;
      this.user = user;
      this.description = description;
  }
}

// Example array of Adjustment objects
export const adjustments: Adjustment[] = [
  new Adjustment("1", "2024-06-14", "12:00 PM", "John Doe", products[0].itemName + ", " + products[1].itemName, "Admin", "Adjusted quantities based on stock review"),
  new Adjustment("2", "2024-06-15", "10:30 AM", "Jane Smith", products[2].itemName + ", " + products[3].itemName, "Manager", "Corrected discrepancies found during inventory audit"),
  new Adjustment("3", "2024-06-16", "03:45 PM", "Michael Johnson", products[4].itemName + ", " + products[5].itemName, "Admin", "Updated quantities after receiving new stock"),
  new Adjustment("4", "2024-06-17", "09:15 AM", "Emily Brown", products[6].itemName + ", " + products[7].itemName, "Manager", "Made adjustments to match sales data"),
  new Adjustment("5", "2024-06-18", "11:00 AM", "David Wilson", products[8].itemName + ", " + products[9].itemName, "Admin", "Modified quantities due to expiration dates"),
  new Adjustment("6", "2024-06-14", "12:00 PM", "John Doe", products[0].itemName + ", " + products[1].itemName, "Admin", "Adjusted quantities based on stock review"),
  new Adjustment("7", "2024-06-15", "10:30 AM", "Jane Smith", products[2].itemName + ", " + products[3].itemName, "Manager", "Corrected discrepancies found during inventory audit"),
  new Adjustment("8", "2024-06-16", "03:45 PM", "Michael Johnson", products[4].itemName + ", " + products[5].itemName, "Admin", "Updated quantities after receiving new stock"),
  new Adjustment("9", "2024-06-17", "09:15 AM", "Emily Brown", products[6].itemName + ", " + products[7].itemName, "Manager", "Made adjustments to match sales data"),
  new Adjustment("10", "2024-06-18", "11:00 AM", "David Wilson", products[8].itemName + ", " + products[9].itemName, "Admin", "Modified quantities due to expiration dates"),
  new Adjustment("11", "2024-06-14", "12:00 PM", "John Doe", "Item1, Item2", "Admin", "Adjusted item quantities"),
  new Adjustment("12", "2024-06-15", "10:30 AM", "Jane Smith", "Item3, Item4", "Manager", "Corrected inventory discrepancies"),
  new Adjustment("13", "2024-06-14", "12:00 PM", "John Doe", "Item1, Item2", "Admin", "Adjusted item quantities"),
  new Adjustment("14", "2024-06-15", "10:30 AM", "Jane Smith", "Item3, Item4", "Manager", "Corrected inventory discrepancies"),
];
