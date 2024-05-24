class Service {
    constructor(table_name, api=CONFIG.API) {
        this.api        = api;
        this.table_name = table_name;
    }

    async update(data) {
        let response = await fetch(`${this.api}/${this.table_name}/update`, {
            method: 'PUT',
            credentials: 'include',
            body: data,
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async getByForm(data) {
        let response = await fetch(`${this.api}/${this.table_name}/get_by_form`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        let { status, message, items } = await response.json();

        if(status == 'error') throw new Error(message);

        return items;
    }

    async updateBy(data) {
        let response = await fetch(`${this.api}/${this.table_name}/update_by`, {
            method: 'PUT',
            credentials: 'include',
            body: data,
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async add(data) {
        let response = await fetch(`${this.api}/${this.table_name}/add`, {
            method: 'POST',
            credentials: 'include',
            body: data,
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async getAll() {
        let response = await fetch(`${this.api}/${this.table_name}/`, {
            credentials: 'include',
        });
        let { status, message, items } = await response.json();

        if(status == 'error') throw new Error(message);

        return items;
    }

    async get(id) {
        let response = await fetch(`${this.api}/${this.table_name}/${id}`, {
            credentials: 'include',
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async count(id) {
        let response = await fetch(`${this.api}/${this.table_name}/count`, {
            credentials: 'include',
        });
        let { status, message, count } = await response.json();

        if(status == 'error') throw new Error(message);

        return count;
    }

    async getBy(column, value) {
        let response = await fetch(`${this.api}/${this.table_name}/get_by/?column=${column}&value=${value}`, {
            credentials: 'include',
        });
        let { status, message, items } = await response.json();

        if(status == 'error') throw new Error(message);

        return items;
    }

    async getOne(column, value) {
        let response = await fetch(`${this.api}/${this.table_name}/get_one/?column=${column}&value=${value}`, {
            credentials: 'include',
        });
        let { status, message, item } = await response.json();

        if(status == 'error') throw new Error(message);

        return item;
    }

    async delete(id) {
        let response = await fetch(`${this.api}/${this.table_name}/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        let { status, message } = await response.json();

        if(status == 'error') throw new Error(message);
    }

    async deleteBy(column, value) {
        let response = await fetch(`${this.api}/${this.table_name}/delete_by/?column=${column}&value=${value}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        let { status, message } = await response.json();

        if(status == 'error') throw new Error(message);
    }

    async searchBy(column, query) {
        let response = await fetch(`${this.api}/${this.table_name}/search_by/?column=${column}&query=${query}`, {
            credentials: 'include',
        });
        let { status, message, items } = await response.json();

        if(status == 'error') throw new Error(message);

        return items;
    }
    
    async search(query) {
        let response = await fetch(`${this.api}/${this.table_name}/search/?query=${query}`, {
            credentials: 'include',
        });
        let { status, message, items } = await response.json();

        if(status == 'error') throw new Error(message);

        return items;
    }
}

export default Service;