// Minimal service worker: makes the app installable. Billing pages are always
// fetched from the network so invoices and totals are never served stale.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
