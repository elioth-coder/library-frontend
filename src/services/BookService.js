import Service from "./Service";

class BookService extends Service {
  constructor() {
    super('book');
  }

  async authors(book_id, author_type) {
    let response = await fetch(`${this.api}/${this.table_name}/authors/?book_id=${book_id}&author_type=${author_type}`, {
      credentials: 'include',
    });
    let { status, message, authors } = await response.json();

    if (status == 'error') throw new Error(message);

    return authors;    
  }
}

export default BookService;