export class PurchaseInvoice {
    id: string;
    supplier: string;
    InvoiceNb: string;
    total: number;
    paid: number;
    balance: number;
    date: String;
  
    constructor(id: string, supplier: string,InvoiceNb:string, total: number, paid: number, balance: number, date: string) {
      this.id = id;
      this.supplier = supplier;
      this.InvoiceNb = InvoiceNb;

      this.total = total;
      this.paid = paid;
      this.balance = balance;
      this.date = date;
    }

    
  }
  
 export const purchaseInvoices: PurchaseInvoice[] = [
    new PurchaseInvoice('INV001', 'Supplier A', '783243947',1000, 800, 200, '2024-01-15'),
  ];
  