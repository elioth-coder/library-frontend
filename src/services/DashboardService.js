

import Service from "./Service";

class DashboardService extends Service {
  constructor() {
    super('dashboard');
  }

  async countBooks(statuses) {
    let response = await fetch(`${this.api}/${this.table_name}/count_books/?status=${statuses}`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }

  async dailyVisitors() {
    let response = await fetch(`${this.api}/${this.table_name}/daily_visitors/`, {
      credentials: 'include',
    });
    let { status, message, results } = await response.json();

    if (status == 'error') throw new Error(message);

    return results;
  }
}

export default DashboardService;