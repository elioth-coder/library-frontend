<script>
  import Router from 'svelte-spa-router';
  import Dashboard from './pages/Dashboard.svelte';
  import Publisher from './pages/Publisher.svelte';
  import Book from './pages/Book.svelte';
  import Author from './pages/Author.svelte';
  import Visitor from './pages/Visitor.svelte';
  import NotFound from './pages/NotFound.svelte';
  import LibraryCard from './pages/LibraryCard.svelte';
  import BookCopy from './pages/BookCopy.svelte';
  import Borrow from './pages/Borrow.svelte';
  import Return from './pages/Return.svelte';
  import BookAuthor from './pages/BookAuthor.svelte';
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import EntryLog from './pages/EntryLog.svelte';
  import WebOpac from './pages/WebOpac.svelte';
  import WebOpacSearch from './pages/WebOpacSearch.svelte';
  import Records from './pages/Records.svelte';
  import Member from './pages/Member.svelte';
  
  const routes = {
    '/': Dashboard,
    '/web_opac': WebOpac,
    '/web_opac/search': WebOpacSearch,
    '/entry_log': EntryLog,
    '/members': Member,
    '/records': Records,
    '/records/books': Book,
    '/records/authors': Author,
    '/records/publishers': Publisher,
    '/book/:id/author': BookAuthor,
    '/book/copy': BookCopy,
    '/book/borrow': Borrow,
    '/book/return': Return,
    '/library/card': LibraryCard,
    '/library/visitor': Visitor,
    '/sign-in': SignIn,
    '/sign-up': SignUp,
    '*': NotFound,
  };
</script>

<Router {routes} />