<script>
  import Router from 'svelte-spa-router';
  import ReportsDashboard from './reports/ReportsDashboard.svelte';
  import Book from './pages/Book.svelte';
  import NotFound from './pages/NotFound.svelte';
  import BookCopy from './pages/BookCopy.svelte';
  import Return from './pages/Return.svelte';
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import EntryLogger from './pages/EntryLogger.svelte';
  import Queuing from './pages/Queuing.svelte';
  import QueuingSearch from './pages/QueuingSearch.svelte';
  import Records from './pages/Records.svelte';
  import Books from './pages/Books.svelte';
  import Overdue from './pages/Overdue.svelte';
  import Wishlist from './pages/Wishlist.svelte';
  import Borrow from './pages/Borrow.svelte';
  import Settings from './settings/Settings.svelte';
  import PrintBooksInventory from './print/BooksInventory.svelte';
  import BooksInventory from './reports/BooksInventory.svelte';
  import AvailableBooks from './reports/AvailableBooks.svelte';
  import BooksBorrowed from './reports/BooksBorrowed.svelte';
  import ReturnedBooks from './reports/CollectedPenalties.svelte';
  import Pending from './members/Pending.svelte';
  import Approved from './members/Approved.svelte';
  import Rejected from './members/Rejected.svelte';
  import Campus from './components/campus/Campus.svelte';
  import QueuingNumber from './pages/QueuingNumber.svelte';
  import UserDashboard from './user/Dashboard.svelte';
  import UserProfile from './user/Profile.svelte';
  import UserBorrowed from './user/Borrowed.svelte';
  import UserReturned from './user/Returned.svelte';
  import UserSearch from './user/Search.svelte';
  import UserWishlist from './user/Wishlist.svelte';
  import ListMembers from './reports/ListMembers.svelte';
  import LogsEntry from './reports/LogsEntry.svelte';
  import PrintEntryLogs from './print/EntryLogs.svelte';
  
  const routes = {
    '/manage_queuing': QueuingNumber,
    '/entry_logger': EntryLogger,
    '/transact/borrow': Borrow, 
    '/transact/return': Return, 
    '/books': Books,
    '/books/copies': BookCopy,
    '/books/overdue': Overdue,
    '/books/wishlist': Wishlist,
    '/records': Records,
    '/records/books': Book,
    '/records/campuses': Campus,

    '/user': UserDashboard,
    '/user/search': UserSearch,
    '/user/borrowed': UserBorrowed,
    '/user/returned': UserReturned,
    '/user/wishlist': UserWishlist,
    '/user/profile': UserProfile,

    '/members/pending': Pending,
    '/members/approved': Approved,
    '/members/rejected': Rejected,

    '/report': ReportsDashboard,
    '/report/member': ListMembers,
    '/report/book_inventory': BooksInventory,
    '/report/book_borrowed': BooksBorrowed,
    '/report/log_entry': LogsEntry,

    '/reports/books_available': AvailableBooks,
    '/reports/books_returned': ReturnedBooks,

    '/print_report/books_inventory': PrintBooksInventory,
    '/print_report/entry_logs': PrintEntryLogs,

    '/queuing': Queuing,
    '/queuing/search': QueuingSearch,

    '/settings': Settings,

    '/sign-in': SignIn,
    '/sign-up': SignUp,
    '*': NotFound,
  };
</script>

<Router {routes} />