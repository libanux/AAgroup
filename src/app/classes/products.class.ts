import { Category, categories } from "./category.class";

export class Product {
    barcode: string;
    itemName: string;
    description: string;
    category: string;
    cost: number;
    sale: number;
    onHandQuantity: number; // New field for current quantity
    previousQuantity: number; // New field for previous quantity
    
  
    constructor(barcode: string, itemName: string, description: string, category: string, cost: number, sale: number, onHandQuantity: number, previousQuantity: number) {
      this.barcode = barcode;
      this.itemName = itemName;
      this.description = description;
      this.category = category;
      this.cost = cost;
      this.sale = sale;
      this.onHandQuantity = onHandQuantity;
      this.previousQuantity = previousQuantity;
    }
}

export const products: Product[] = [
  new Product('9780201379624', 'The Pragmatic Programmer', 'Your journey to mastery', categories[0].CategoryName, 39.99, 49.99, 150, 135),
  new Product('9780132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'A guide to producing readable, reusable, and refactorable software', categories[3].CategoryName, 29.99, 39.99, 100, 90),
  new Product('9780596007126', 'Head First Design Patterns', 'A brain-friendly guide', categories[1].CategoryName, 44.99, 54.99, 75, 80),
  new Product('9780735619678', 'Code Complete: A Practical Handbook of Software Construction', 'Proven techniques for software development success', categories[2].CategoryName, 49.99, 59.99, 120, 110),
  new Product('9780132350884', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'A catalog of 23 software design patterns', categories[3].CategoryName, 34.99, 44.99, 85, 95),
  new Product('9780321637734', 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design', 'A clear, concise, and effective path to a successful software architecture', categories[3].CategoryName, 42.99, 52.99, 110, 100),
  new Product('9780135974445', 'Domain-Driven Design: Tackling Complexity in the Heart of Software', 'An approach to software development', categories[4].CategoryName, 37.99, 47.99, 95, 105),
  new Product('9780132856201', 'Refactoring: Improving the Design of Existing Code', 'A proven technique for improving codebases', categories[0].CategoryName, 33.99, 43.99, 80, 85),
  new Product('9780201633610', 'Designing Data-Intensive Applications', 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', categories[3].CategoryName, 49.99, 59.99, 65, 70),
  new Product('9780201379624', 'The Pragmatic Programmer', 'Your journey to mastery', categories[0].CategoryName, 39.99, 49.99, 150, 135),
  new Product('9780132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'A guide to producing readable, reusable, and refactorable software', categories[3].CategoryName, 29.99, 39.99, 100, 90),
  new Product('9780596007126', 'Head First Design Patterns', 'A brain-friendly guide', categories[1].CategoryName, 44.99, 54.99, 75, 80),
  new Product('9780735619678', 'Code Complete: A Practical Handbook of Software Construction', 'Proven techniques for software development success', categories[2].CategoryName, 49.99, 59.99, 120, 110),
  new Product('9780132350884', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'A catalog of 23 software design patterns', categories[3].CategoryName, 34.99, 44.99, 85, 95),
  new Product('9780321637734', 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design', 'A clear, concise, and effective path to a successful software architecture', categories[3].CategoryName, 42.99, 52.99, 110, 100),
  new Product('9780135974445', 'Domain-Driven Design: Tackling Complexity in the Heart of Software', 'An approach to software development', categories[4].CategoryName, 37.99, 47.99, 95, 105),
  new Product('9780132856201', 'Refactoring: Improving the Design of Existing Code', 'A proven technique for improving codebases', categories[0].CategoryName, 33.99, 43.99, 80, 85),
  new Product('9780201633610', 'Designing Data-Intensive Applications', 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', categories[3].CategoryName, 49.99, 59.99, 65, 70),
  new Product('9780201379624', 'The Pragmatic Programmer', 'Your journey to mastery', categories[0].CategoryName, 39.99, 49.99, 150, 135),
  new Product('9780132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'A guide to producing readable, reusable, and refactorable software', categories[3].CategoryName, 29.99, 39.99, 100, 90),
  new Product('9780596007126', 'Head First Design Patterns', 'A brain-friendly guide', categories[1].CategoryName, 44.99, 54.99, 75, 80),
  new Product('9780735619678', 'Code Complete: A Practical Handbook of Software Construction', 'Proven techniques for software development success', categories[2].CategoryName, 49.99, 59.99, 120, 110),
  new Product('9780132350884', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'A catalog of 23 software design patterns', categories[3].CategoryName, 34.99, 44.99, 85, 95),
  new Product('9780321637734', 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design', 'A clear, concise, and effective path to a successful software architecture', categories[3].CategoryName, 42.99, 52.99, 110, 100),
  new Product('9780135974445', 'Domain-Driven Design: Tackling Complexity in the Heart of Software', 'An approach to software development', categories[4].CategoryName, 37.99, 47.99, 95, 105),
  new Product('9780132856201', 'Refactoring: Improving the Design of Existing Code', 'A proven technique for improving codebases', categories[0].CategoryName, 33.99, 43.99, 80, 85),
  new Product('9780201633610', 'Designing Data-Intensive Applications', 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', categories[3].CategoryName, 49.99, 59.99, 65, 70),
];