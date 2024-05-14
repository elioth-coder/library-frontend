import Service from "./Service";

class BookCopyService extends Service {
  constructor() {
    super('book_copy');
  }

  async copiesCount(book_id, type) {
    let response = await fetch(`${this.api}/${this.table_name}/copies_count/?book_id=${book_id}&status=${type}`, {
      credentials: 'include',
    });
    let { status, message, count } = await response.json();

    if (status == 'error') throw new Error(message);

    return count;
  }
}

export default BookCopyService;