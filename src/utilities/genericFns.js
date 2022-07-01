export function isEmptyArray(x) {
    return (Array.isArray(x) && x.length === 0);
}

export function isEmptyObject(obj) {
    if (isObject(obj)) {
        return Object.keys(obj).length === 0;
    } else {
        return true;
    }
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isObject(x){
    return (typeof x === 'object' && !Array.isArray(x) && x !== null)
}

