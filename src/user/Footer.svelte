<script>
  import { Footer, FooterCopyright, FooterLinkGroup, FooterBrand, FooterLink } from 'flowbite-svelte';
</script>

<Footer footerType="logo">
  <div class="flex flex-col items-center">
    <FooterBrand href="#/" src="/src/logo.png" alt="NEUST Library Logo" name="NEUST Library" />
    <FooterLinkGroup ulClass="flex flex-wrap justify-center items-center text-sm text-gray-500 dark:text-gray-400">
      <FooterLink href="#/user">Home</FooterLink>
      <FooterLink href="#/user/search">Search</FooterLink>
      <FooterLink href="#/user/borrowed">Borrowed</FooterLink>
      <FooterLink href="#/user/returned">Returned</FooterLink>
      <FooterLink href="#/user/wishlist">Wishlist</FooterLink>
      <FooterLink href="#/user/profile">Profile</FooterLink>
    </FooterLinkGroup>
  </div>
  <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
  <FooterCopyright href="#/user" by="NEUST Library" />
</Footer>