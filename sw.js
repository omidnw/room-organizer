if(!self.define){let s,e={};const n=(n,i)=>(n=new URL(n+".js",i).href,e[n]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=n,s.onload=e,document.head.appendChild(s)}else s=n,importScripts(n),e()})).then((()=>{let s=e[n];if(!s)throw new Error(`Module ${n} didn’t register its module`);return s})));self.define=(i,o)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let l={};const a=s=>n(s,r),t={module:{uri:r},exports:l,require:a};e[r]=Promise.all(i.map((s=>t[s]||a(s)))).then((s=>(o(...s),l)))}}define(["./workbox-7075b8c2"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/000_initial_setup.migration-gpM20POu.js",revision:null},{url:"assets/charts-BieyqvjL.js",revision:null},{url:"assets/db-Dob3nYDb.js",revision:null},{url:"assets/index-B5y85QnL.css",revision:null},{url:"assets/index-vXwZp10B.js",revision:null},{url:"assets/room-organizer/images/icons/icon-128x128.png",revision:null},{url:"assets/room-organizer/images/icons/icon-144x144.png",revision:null},{url:"assets/room-organizer/images/icons/icon-152x152.png",revision:null},{url:"assets/room-organizer/images/icons/icon-167x167.png",revision:null},{url:"assets/room-organizer/images/icons/icon-16x16.png",revision:null},{url:"assets/room-organizer/images/icons/icon-180x180.png",revision:null},{url:"assets/room-organizer/images/icons/icon-192x192.png",revision:null},{url:"assets/room-organizer/images/icons/icon-256x256.png",revision:null},{url:"assets/room-organizer/images/icons/icon-32x32.png",revision:null},{url:"assets/room-organizer/images/icons/icon-384x384.png",revision:null},{url:"assets/room-organizer/images/icons/icon-48x48.png",revision:null},{url:"assets/room-organizer/images/icons/icon-512x512.png",revision:null},{url:"assets/room-organizer/images/icons/icon-64x64.png",revision:null},{url:"assets/room-organizer/images/icons/icon-72x72.png",revision:null},{url:"assets/room-organizer/images/icons/icon-96x96.png",revision:null},{url:"assets/room-organizer/images/logo.png",revision:null},{url:"assets/room-organizer/images/screenshots/help-center.png",revision:null},{url:"assets/room-organizer/images/screenshots/home.png",revision:null},{url:"assets/room-organizer/images/screenshots/item-view.png",revision:null},{url:"assets/room-organizer/images/screenshots/reports-with-details.png",revision:null},{url:"assets/room-organizer/images/screenshots/reports.png",revision:null},{url:"assets/room-organizer/images/screenshots/settings.png",revision:null},{url:"assets/ui-CC2BWoR2.js",revision:null},{url:"assets/utils-Cn0a9Daa.js",revision:null},{url:"assets/vendor-C3Nx27Uu.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"7dd8a43193904d66dc6728f789d24ca7"},{url:"manifest.json",revision:"207b2396270144bc14b1afa11353ff52"},{url:"offline.html",revision:"888a59c32539a0ada0efe925484d2197"},{url:"assets/000_initial_setup.migration-gpM20POu.js.map",revision:null},{url:"assets/charts-BieyqvjL.js.map",revision:null},{url:"assets/db-Dob3nYDb.js.map",revision:null},{url:"assets/index-vXwZp10B.js.map",revision:null},{url:"assets/ui-CC2BWoR2.js.map",revision:null},{url:"assets/utils-Cn0a9Daa.js.map",revision:null},{url:"assets/vendor-C3Nx27Uu.js.map",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js.map",revision:null},{url:"assets/room-organizer/images/icons/icon-192x192.png",revision:"323507914c7afc89b038864ed3461cf9"},{url:"assets/room-organizer/images/icons/icon-512x512.png",revision:"5c820e54912cd1d956c05e0434a65a08"},{url:"manifest.webmanifest",revision:"cfb28ddf358a00964e2bdca4fedd80a9"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("/index.html"),{denylist:[/^\/api\//]})),s.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:30,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
//# sourceMappingURL=sw.js.map
