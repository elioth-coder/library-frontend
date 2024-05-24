<script>
  import Router from 'svelte-spa-router';
  import Dashboard from './pages/Dashboard.svelte';
  import Publisher from './pages/Publisher.svelte';
  import Book from './pages/Book.svelte';
  import Author from './pages/Author.svelte';
  import NotFound from './pages/NotFound.svelte';
  import BookCopy from './pages/BookCopy.svelte';
  import Return from './pages/Return.svelte';
  import BookAuthor from './pages/BookAuthor.svelte';
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import EntryLogger from './pages/EntryLogger.svelte';
  import WebOpac from './pages/WebOpac.svelte';
  import WebOpacSearch from './pages/WebOpacSearch.svelte';
  import Records from './pages/Records.svelte';
  import Books from './pages/Books.svelte';
  import Borrowed from './pages/Borrowed.svelte';
  import Reserved from './pages/Reserved.svelte';
  import Wishlist from './pages/Wishlist.svelte';
  import Borrow from './pages/Borrow.svelte';
  import Settings from './settings/Settings.svelte';
  import BooksInventory from './reports/BooksInventory.svelte';
  import AvailableBooks from './reports/AvailableBooks.svelte';
  import BorrowedBooks from './reports/BorrowedBooks.svelte';
  import Pending from './members/Pending.svelte';
  import Approved from './members/Approved.svelte';
  import Rejected from './members/Rejected.svelte';
  import StudentBorrowed from './student/StudentBorrowed.svelte';
  import StudentReturned from './student/StudentReturned.svelte';
  import StudentWishlist from './student/StudentWishlist.svelte';
  import Campus from './components/campus/Campus.svelte';
  
  const routes = {
    '/': Dashboard,
    '/entry_logger': EntryLogger,
    '/transact/borrow': Borrow, 
    '/transact/return': Return, 
    '/books': Books,
    '/books/copies': BookCopy,
    '/books/borrowed': Borrowed,
    '/books/reserved': Reserved,
    '/books/wishlist': Wishlist,
    '/records': Records,
    '/records/books': Book,
    '/records/books/:id/author': BookAuthor,
    '/records/authors': Author,
    '/records/publishers': Publisher,
    '/records/campuses': Campus,

    '/student/borrowed': StudentBorrowed,
    '/student/returned': StudentReturned,
    '/student/wishlist': StudentWishlist,

    '/members/pending': Pending,
    '/members/approved': Approved,
    '/members/rejected': Rejected,

    '/reports/books_inventory': BooksInventory,
    '/reports/books_available': AvailableBooks,
    '/reports/books_borrowed': BorrowedBooks,

    '/web_opac': WebOpac,
    '/web_opac/search': WebOpacSearch,

    '/settings': Settings,

    '/sign-in': SignIn,
    '/sign-up': SignUp,
    '*': NotFound,
  };
</script>

<Router {routes} />