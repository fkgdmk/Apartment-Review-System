const cacheName = 'v1';
const staticAssets = [

];
var request;
self.addEventListener('install', (e) => {
    console.log("Service worker installed");
});

self.addEventListener('activate', (e) => {
    console.log("Service worker activated");
    request = openDB(self);

    request.onerror = function (event) {
        console.log('[onerror]', request.error);
    };
    request.onupgradeneeded = function (event) {
        console.log("upgrade")
        var db = event.target.result;
        var store = db.createObjectStore('report', { keyPath: 'id', autoIncrement: true });
        store.createIndex('report_id_unique', 'id', { unique: true })
    }

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheNames) {
                        console.log('Service Worker: Clearling old cache');
                        // return caches.delete(cache);
                    }
                })
            );
        })
    )
})

self.addEventListener('sync', function (event) {
    console.log('now online')
    if (event.tag === 'browserOnline') { // event.tag name checked

        event.waitUntil(

            getAllFromDB().then(results => {
                console.log(results[0].body)
                console.log(results[0].id)
                fetch(results[0].url, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    },
                    body: results[0].body
                }).then(res => {
                    return res.json();
                }).then(res => {
                    console.log(res);
                    if (res.status == 200) {
                        console.log("creaetd");
                        deleteFromDb(results[0].id)
                    } else {
                        console.log("error");
                    }
                })
            })
        )
    }
})


self.addEventListener('fetch', (e) => {
    console.log("Service Worker: Fetching");

    if (e.request.method === 'POST') {
        e.respondWith(
            fetch(e.request.clone())
                .then(async function (response) {
                    // cachePut(e.request.clone(), response.clone());
                    console.log("POST FETCH THEN")
                    var serialized = await serializeRequest(e.request.clone());
                    // var request = JSON.stringify(serialized);

                    console.log("request", serialized)
                    console.log("body", serialized.body)
                    addToDb(serialized);

                }).catch(async function () {
                    console.log("POST FETCH CATCH")
                    var serialized = await serializeRequest(e.request.clone());
                    // var request = JSON.stringify(serialized);

                    console.log("request", serialized)
                    console.log("body", serialized.body)
                    addToDb(serialized);
                })
        )

    } else {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const resClone = res.clone();
                    caches
                        .open(cacheName)
                        .then(cache => {
                            cache.put(e.request, resClone);
                        });
                    return res;
                }).catch(err => caches.match(e.request).then(res => res))
        )
    }
});

function openDB(self) {
    return self.indexedDB.open('cache_db', 3);
}

function addToDb (object) {
    var request = openDB(self);

    request.onsuccess = function (event) {
        console.log("db open")
        var db = event.target.result;
        var transaction = db.transaction('report', 'readwrite');

        var reportStore = transaction.objectStore('report');

        transaction.onsuccess = function (event) {
            console.log("Transaction succes");
        }
        transaction.onerror = function (event) {
            console.log("Transaction ERROR");
        }

        var save_request = reportStore.add(object);

        save_request.onsuccess = function(e) {
            console.log("request saved")
        }

        save_request.onerror = function(e) {
            console.log("request error")
        }
    }
}

function getAllFromDB () {
    return new Promise((res, rej) => {

        var request = openDB(self);
        request.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('report', 'readwrite');
            
            var reportStore = transaction.objectStore('report');
            
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
        }
    });
}

function deleteFromDb (id) {
    var request = openDB(self);
    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction('report', 'readwrite');
        
        var reportStore = transaction.objectStore('report');
        
        transaction.onsuccess = function (event) {
            console.log("Transaction succes");
        }
        transaction.onerror = function (event) {
            console.log("Transaction ERROR");
        }
        
        reportStore.delete(id).onsuccess = function () {
            console.log("deleted");
        }
    }
}

function serializeRequest(request) {
    return new Promise((res, rej) => {
        console.log("serializeRequest")
        var serialized = {
            url: request.url,
            headers: serializeHeaders(request.headers),
            method: request.method,
            mode: request.mode,
            credentials: request.credentials,
            cache: request.cache,
            redirect: request.redirect,
            referrer: request.referrer
        };
        console.log(serialized)
        // Only if method is not `GET` or `HEAD` is the request allowed to have body.
        request.clone().text().then(function (body) {
            serialized.body = body;
            res(serialized)
        });
    });
}

function serializeResponse(response) {
    var serialized = {
        headers: serializeHeaders(response.headers),
        status: response.status,
        statusText: response.statusText
    };

    return response.clone().text().then(function (body) {
        serialized.body = body;
        return Promise.resolve(serialized);
    });
}

function serializeHeaders(headers) {
    var serialized = {};
    // `for(... of ...)` is ES6 notation but current browsers supporting SW, support this
    // notation as well and this is the only way of retrieving all the headers.
    for (var entry of headers.entries()) {
        serialized[entry[0]] = entry[1];
    }
    return serialized;
}

function deserializeResponse(data) {
    return Promise.resolve(new Response(data.body, data));
}

function cachePut(request, response) {
    console.log("cahcePut")
    var key, data;
    getPostId(request.clone())
        .then(function (id) {
            console.log("postId")
            key = id;
            return serializeResponse(response.clone());
        }).then(function (serializedResponse) {
            data = serializedResponse;
            var entry = {
                key: key,
                response: data,
                timestamp: Date.now()
            };

            console.log("entry", entry);

        });
}

function cacheMatch(request) {
    return getPostId(request.clone())
        .then(function (id) {
            return store.get(id);
        }).then(function (data) {
            if (data) {
                return deserializeResponse(data.response);
            } else {
                return new Response('', { status: 503, statusText: 'Service Unavailable' });
            }
        });
}

function getPostId(request) {
    return JSON.stringify(serializeRequest(request.clone()));
}