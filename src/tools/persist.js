function persistSet(key, value) {
    if (localStorage) {
        var storage;
        if (localStorage.raptor) {
            storage = JSON.parse(localStorage.raptor);
        } else {
            storage = {};
        }
        storage[key] = value;
        localStorage.raptor = JSON.stringify(storage);
    }
}

function persistGet(key) {
    if (localStorage) {
        var storage;
        if (localStorage.raptor) {
            storage = JSON.parse(localStorage.raptor);
        } else {
            storage = {};
        }
        return storage[key];
    }
}

