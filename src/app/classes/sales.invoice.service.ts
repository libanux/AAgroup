export class SalesInvoiceClass {
    orderNumber: string;
    orderDate: string;
    inventoryStatus: string;
    paymentStatus: string;
    customer: string;
    dueDate: string;
    total: string;
    paid: string;
    balance: string;
  
    constructor(
        orderNumber: string,
        orderDate: string,
        inventoryStatus: string,
        paymentStatus: string,
        customer: string,
        dueDate: string,
        total: string,
        paid: string,
        balance: string
    ) {
        this.orderNumber = orderNumber;
        this.orderDate = orderDate;
        this.inventoryStatus = inventoryStatus;
        this.paymentStatus = paymentStatus;
        this.customer = customer;
        this.dueDate = dueDate;
        this.total = total;
        this.paid = paid;
        this.balance = balance;
    }
  }
  
  // Example array of orders
  export const Sales_Invoice_array: SalesInvoiceClass[] = [
    new SalesInvoiceClass('12345', '2024-06-29', 'In Stock', 'Paid', 'John Doe', '2024-07-05', '100.0', '100.0', '0.0'),
    new SalesInvoiceClass('67890', '2024-06-28', 'Backordered', 'Pending', 'Jane Smith', '2024-07-10', '150.0', '0.0', '150.0'),
    new SalesInvoiceClass('24680', '2024-06-30', 'Shipped', 'Paid', 'Michael Johnson', '2024-07-03', '75.0', '75.0', '0.0'),
    new SalesInvoiceClass('13579', '2024-06-27', 'Pending', 'Unpaid', 'Emily Brown', '2024-07-15', '200.0', '0.0', '200.0'),
    new SalesInvoiceClass('54321', '2024-06-25', 'Delivered', 'Paid', 'David Lee', '2024-07-01', '120.0', '120.0', '0.0')
  ];