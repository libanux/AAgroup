export class SupplierClass {
    _id: string = '';
    first_name: string = '';
    last_name: string = '';
    email: string = '';
    number:string='';
    company_name: string = '';
    country_code: string = '';
    balance: string = '';
  
    constructor(
        _id: string,
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        companyname: string,
        country_code: string,
        balance: string
    ) {
        this._id = _id;
        this.first_name = firstname;
        this.last_name = lastname;
        this.email = email;
        this.number = phone;
        this.company_name = companyname;
        this.country_code = country_code;
        this.balance = balance;
    }
}