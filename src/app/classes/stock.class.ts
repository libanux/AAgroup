export class StockClass {
    _id: string;
    barcode: string;
    product_id: string;
    category: string;
    on_hand_quantity: string;
  
    constructor(
        _id: string,
        barcode: string,
        product_id: string,
        category: string,
        on_hand_quantity: string,
    )
        {
        this._id = _id;
        this.barcode = barcode;
        this.product_id = product_id;
        this.category = category;
        this.on_hand_quantity = on_hand_quantity;
    }
}


