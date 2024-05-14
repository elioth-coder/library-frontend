import { writable } from 'svelte/store';

const cart_items = writable([]);

export default cart_items;