export class Product {
    barcode: string;
    itemName: string;
    description: string;
    category: string;
    cost: string;
    sale: string;
    onHandQuantity: number; // New field for current quantity
    previousQuantity: number; // New field for previous quantity
    
  
    constructor(barcode: string, itemName: string, description: string, category: string, cost: string, sale: string, onHandQuantity: number, previousQuantity: number) {
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
  new Product('9789953000489', 'Baklava', 'Sweet pastry made of layers of filo filled with chopped nuts and sweetened with honey', 'Sweets & Desserts', '15.99', '19.99', 80, 70),
  new Product('9789953000496', 'Karak Tea', 'Strong black tea infused with warming spices like cardamom and cinnamon', 'Beverages', '3.99', '5.99', 100, 90),
  new Product('9789953000502', 'Kibbeh', 'Lebanese version of a meat pie, made with bulgur, minced onions, and ground beef, lamb, or goat', 'Prepared Foods', '8.49', '10.99', 120, 100),
  new Product('9789953000519', 'Laban Ayran', 'Refreshing yogurt drink mixed with salt', 'Beverages', '2.49', '3.49', 150, 130),
  new Product('9789953000526', 'Foul Mudammas', 'Mashed fava beans seasoned with olive oil, lemon juice, garlic, and cumin', 'Canned Goods', '3.29', '4.49', 200, 180),
  // new Product('9789953000533', 'Shanklish', 'A type of aged cheese made from cow or sheeps milk and seasoned with zaatar and red pepper', 'Dairy', 6.99, 8.99, 100, 90),
  // new Product('9789953000540', 'Falafel Mix', 'Prepared mix for making crispy chickpea fritters', 'Grains & Legumes', 4.79, 6.49, 130, 110),
  // new Product('9789953000557', 'Mouneh', 'Assorted homemade preserves including jams, pickles, and dried fruits', 'Canned Goods', 9.99, 12.99, 180, 160),
  // new Product('9789953000564', 'Sumac', 'Tart, lemony spice made from ground berries of the sumac bush', 'Spices & Herbs', 2.99, 4.49, 80, 70),
  // new Product('9789953000571', 'Lebanese Rice', 'Long-grain rice variety perfect for pilafs and other Middle Eastern dishes', 'Grains & Legumes', 5.49, 7.49, 200, 180),
  // new Product('9789953000588', 'Tahini', 'Rich paste made from ground sesame seeds, used in hummus and dressings', 'Condiments', 7.99, 9.99, 150, 130),
  // new Product('9789953000595', 'Mahmoul', 'Date-filled semolina cookies dusted with powdered sugar', 'Sweets & Desserts', 12.49, 15.99, 120, 100),
  // new Product('9789953000601', 'Kataifi', 'Shredded phyllo dough used for making pastries like baklava', 'Baking Ingredients', 6.99, 8.99, 100, 90),
  // new Product('9789953000618', 'Mouneh Basket', 'A selection of traditional Lebanese pantry staples, including olive oil, olives, and spices', 'Gift Baskets', 29.99, 39.99, 80, 70),
  // new Product('9789953000625', 'Date Molasses', 'Syrupy sweetener made from dates, used in desserts and dressings', 'Condiments', 5.99, 7.99, 120, 100),
  // new Product('9789953000632', 'Lebanese Labneh Balls', 'Labneh formed into small balls and preserved in olive oil with herbs', 'Dairy', 8.99, 11.99, 100, 90),
  // new Product('9789953000649', 'Arak', 'Anise-flavored alcoholic beverage traditionally consumed in Lebanon', 'Beverages', 19.99, 24.99, 60, 50),
  // new Product('9789953000656', 'Kataifi Dough', 'Pre-made shredded phyllo dough for convenience in pastry making', 'Baking Ingredients', 3.99, 5.49, 150, 130),
  // new Product('9789953000663', 'Lebanese Pickles', 'Assorted pickled vegetables including cucumbers, turnips, and carrots', 'Canned Goods', 6.49, 8.49, 180, 160),
  // new Product('9789953000670', 'Maamoul Mold', 'Wooden mold used for shaping and imprinting dough for maamoul cookies', 'Baking Tools', 7.99, 9.99, 100, 90),
];

