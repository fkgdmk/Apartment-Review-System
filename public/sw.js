
const staticCache = 'v2';
const dynamicCache = 'dynamic';
const staticAssets = [
    '/',
    '/index.html',
    '/general-information',
    '/improvements',
    '/maintenance',
    '/static/js/*.js',
    '/*.js'
];

self.addEventListener('install', function (event) {
    console.log("Service worker installed");
    event.waitUntil(
        caches.open(staticCache)
            .then(function (cache) {
                cache.addAll(staticAssets);
            })
    )
});

self.addEventListener('activate', (event) => {
    console.log("Service worker activated");
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    //If the cache key is not equal to a element in the static cache or dynamic cache it's the old cache
                    if (key !== staticCache && key !== dynamicCache) {
                        console.log("Removing old cache");
                        return caches.delete(key);
                    }
                }))
            })
    )
    return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
    console.log("Service worker fetching");
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(dynamicCache)
                                .then(function (cache) {
                                    cache.put(event.request.url, res.clone())
                                    return res;
                                })
                        })
                        .catch(function () {
                        });
                }
            })
    )
});

self.addEventListener('sync', function (event) {
    console.log("SERVICE WORKER background syncing");
    if (event.tag === 'sync-new-reports') {
        console.log("SERVICE WORKER syncing reports")
        event.waitUntil(
            getIndexedDBReports().then(reports => {
                reports.forEach(report => {
                    console.log(report.report)
                    fetch('http://localhost:8000/report', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(report.report)
                    }).then(res => {
                        return res.json();
                    }).then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            window.alert('Raport tilføjet')
                            postMessage('Raport tilføjet')
                            alert('Sync Done - Reports added');
                            console.log("succes")
                        } else {
                            console.log("error");
                        }
                    })
                });
                clearIndexedDB().then(() => console.log('DB CLEARED'))
            })
        );
    }
})


function getIndexedDBReports() {
    return new Promise((res, rej) => {
        var request = self.indexedDB.open('report-store', 2);

        request.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('sync-reports', 'readonly');

            var reportStore = transaction.objectStore('sync-reports');

            transaction.onsuccess = function (event) {
                console.log("Transaction succes");
            }
            transaction.onerror = function (event) {
                console.log("Transaction ERROR");
            }

            var allRequests = reportStore.getAll();
            allRequests.onsuccess = function () {
                res(allRequests.result);
            }

            allRequests.onerror = function () {
                console.log("error");
                rej();
            }
        }
    })
}

function clearIndexedDB() {
    return new Promise((res, rej) => {
        var request = self.indexedDB.open('report-store', 2);

        request.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('sync-reports', 'readwrite');

            var reportStore = transaction.objectStore('sync-reports');

            transaction.onsuccess = function (event) {
                console.log("Transaction succes");
            }
            transaction.onerror = function (event) {
                console.log("Transaction ERROR");
            }

            var cleared = reportStore.clear();

            cleared.onsuccess = function () {
                res();
            }

            cleared.onerror = function () {
                console.log("error");
            }
        }
    })
}