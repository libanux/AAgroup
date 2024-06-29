export class SupplierClass {
    _id: string = '';
    contact_name: string = '';
    email: string = '';
    number:string='';
    company_name: string = '';
    balance: string = '';
  
    constructor(
        _id: string,
        email: string,
        phone: string,
        companyname: string,
        balance: string
    ) {
        this._id = _id;
        this.email = email;
        this.number = phone;
        this.company_name = companyname;
        this.balance = balance;
    }
}