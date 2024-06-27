export class CustomerClass {
    _id: string;
    first_name: string;
    last_name: string;
    company_name: string;
    email: string;
    number: string;
    country_code: string;
    owner_id: string;

    constructor(
        _id: string = '',
        first_name: string = '',
        last_name: string = '',
        company_name: string = '',
        email: string = '',
        number: string = '',
        country_code: string = '',
        owner_id: string = ''
    ) {
        this._id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.company_name = company_name;
        this.email = email;
        this.number = number;
        this.country_code = country_code;
        this.owner_id = owner_id;
    }
}
