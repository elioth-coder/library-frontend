<script>
  import Router from 'svelte-spa-router';
  import Home from './pages/Home.svelte';
  import Publisher from './pages/Publisher.svelte';
  import Book from './pages/Book.svelte';
  import Author from './pages/Author.svelte';
  import Visitor from './pages/Visitor.svelte';
  import NotFound from './pages/NotFound.svelte';
  import LibraryCard from './pages/LibraryCard.svelte';
  import BookCopy from './pages/BookCopy.svelte';
  import Borrow from './pages/Borrow.svelte';
  import BookAuthor from './pages/BookAuthor.svelte';
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import EntryLog from './pages/EntryLog.svelte';
  
  const routes = {
    '/': Home,
    '/entry_log': EntryLog,
    '/publisher': Publisher,
    '/author': Author,
    '/book/record': Book,
    '/book/:id/author': BookAuthor,
    '/book/copy': BookCopy,
    '/book/borrow': Borrow,
    '/library/card': LibraryCard,
    '/library/visitor': Visitor,
    '/authentication/sign-in': SignIn,
    '/authentication/sign-up': SignUp,
    '*': NotFound,
  };
</script>

<Router {routes} />