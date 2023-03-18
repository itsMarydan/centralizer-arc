export function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}


export function arrayToLowerCase(array) {
    return array.map(item => item.toLowerCase());
}

export function arrayToUpperCase(array) {
    return array.map(item => item.toUpperCase());
}
export function compareAndRemoveDuplicatesInArray1(array1, array2) {
    return array1.filter(item => !array2.includes(item));
}

export function randomInt(length) {
       return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length)));
}

export function generateId() {
    return randomInt(6);
}
