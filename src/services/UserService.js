import Service from "./Service";

class UserService extends Service {
    constructor() {
        super('user');
    }

    async login(data) {
        let response = await fetch(`${this.api}/${this.table_name}/login`, {
            method: 'POST',
            credentials: 'include',
            body: data,
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async logout() {
        let response = await fetch(`${this.api}/${this.table_name}/logout`, {
            method: 'GET',
            credentials: 'include',
        });
        let { status, message } = await response.json();

        if(status == 'error') throw new Error(message);
    }

    async me() {
        let response = await fetch(`${this.api}/${this.table_name}/me`, {
            method: 'GET',
            credentials: 'include',
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

}

export default UserService;