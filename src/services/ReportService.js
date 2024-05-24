import Service from "./Service";

class ReportService extends Service {
  constructor() {
    super('report');
  }

  async booksInventory() {
    let response = await fetch(`${this.api}/${this.table_name}/books_inventory/`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }
}

export default ReportService;