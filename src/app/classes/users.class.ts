//  DONE FROM API
export class User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;

    constructor(
        _id: string,
        first_name: string,
        last_name: string,
        email: string,
        password: string,
        role: string
    ) {
        this._id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
