
// import idb from './idb';
const idb = require('./idb')

export function writeData(st, data) {
    var dbPromise = createDB();

    return dbPromise
    .then(function (db) {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
    });
}

export function readAllData(st) {
    var dbPromise = createDB();

    return dbPromise
    .then(function (db) {
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();
    });
}

export function clearAllData (st) {
    var dbPromise = createDB();

    return dbPromise
    .then(function(db) {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.clear();
        return tx.complete;
    });
}

function createDB () {
    return idb.open('report-store', 2, function(db) {
        if (!db.objectStoreNames.contains('reports')) {
            db.createObjectStore('reports', {keyPath: 'id'})
        }
        if (!db.objectStoreNames.contains('sync-reports')) {
            db.createObjectStore('sync-reports', {keyPath: 'id'})
        }
    });
}

