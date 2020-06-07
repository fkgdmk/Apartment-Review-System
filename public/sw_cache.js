const cacheName = 'v1';
const staticAssets = [

];

self.addEventListener('install', (e) => {
    console.log(e);
    console.log("Service worker installed");
    e.wait_u
});

self.addEventListener('activate', (e) => {
    console.log(e);
    console.log("Service worker activated");
})