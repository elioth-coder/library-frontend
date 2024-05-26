import Service from "./Service";

class BorrowedService extends Service {
  constructor() {
    super('borrowed');
  }

  async getBorrowed() {
    let response = await fetch(`${this.api}/${this.table_name}/get_borrowed`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }

  async getReturned() {
    let response = await fetch(`${this.api}/${this.table_name}/get_returned`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }

  async getBorrowedBy(id) {
    let response = await fetch(`${this.api}/${this.table_name}/get_borrowed_by/?id=${id}`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }

  async getReturnedBy(id) {
    let response = await fetch(`${this.api}/${this.table_name}/get_returned_by/?id=${id}`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }
}

export default BorrowedService;