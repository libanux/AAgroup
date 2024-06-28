export class Supplier {
    _id: string = '';
    firstname: string = '';
    lastname: string = '';
    email: string = '';
    phone:string='';
    companyname: string = '';
    contactname: string = '';
    balance: string = '';

    constructor(
        _id: string,
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        companyname: string,
        balance: string
    ) {
        this._id = _id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.companyname = companyname;
        this.balance = balance;
    }
}

export const suppliersArray: Supplier[] = [
  new Supplier('1', 'Elias', 'Khoury', 'elias.khoury@example.com', '+9611234567', 'Lebanese Sweets', '10000$'),
  new Supplier('2', 'Rana', 'Said', 'rana.said@example.com', '+9612345678', 'Beirut Confectionery', '15000$'),
  new Supplier('3', 'Khalil', 'Nassar', 'khalil.nassar@example.com', '+9613456789', 'Mount Lebanon Delights', '8000$'),
  new Supplier('4', 'Layla', 'Fakhoury', 'layla.fakhoury@example.com', '+9614567890', 'Byblos Candies', '12000$'),
  new Supplier('5', 'Karim', 'Abboud', 'karim.abboud@example.com', '+9615678901', 'Tripoli Treats', '9000$'),
  new Supplier('6', 'Yara', 'Maalouf', 'yara.maalouf@example.com', '+9616789012', 'Sidon Sweets', '11000$'),
  new Supplier('7', 'Nasser', 'Haddad', 'nasser.haddad@example.com', '+9617890123', 'Tyre Confections', '13000$'),
  new Supplier('8', 'Amal', 'Harb', 'amal.harb@example.com', '+9618901234', 'Baalbek Bakery', '9500$'),
  new Supplier('9', 'Adel', 'Saliba', 'adel.saliba@example.com', '+9619012345', 'Zahle Chocolates', '8500$'),
  new Supplier('10', 'Lina', 'Sleiman', 'lina.sleiman@example.com', '+9610123456', 'Jounieh Sweets', '14000$')
];
