"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areArraysEqual = exports.removeAllOccurencesFromItem = exports.removeAllOccurencesFromArray = exports.deleteArrayDuplicates = void 0;
const deleteArrayDuplicates = (array) => {
    let arrayWithoutDuplicates = [];
    array.forEach(item => {
        if (arrayWithoutDuplicates.indexOf(item) === -1) {
            arrayWithoutDuplicates.push(item);
        }
    });
    return arrayWithoutDuplicates;
};
exports.deleteArrayDuplicates = deleteArrayDuplicates;
const removeAllOccurencesFromArray = (array, items) => {
    let arrayCopy = [...array];
    items.forEach(item => {
        while (arrayCopy.indexOf(item) !== -1) {
            arrayCopy.splice(arrayCopy.indexOf(item), 1);
        }
    });
    return arrayCopy;
};
exports.removeAllOccurencesFromArray = removeAllOccurencesFromArray;
const removeAllOccurencesFromItem = (array, item) => {
    let arrayCopy = [...array];
    while (arrayCopy.indexOf(item) !== -1) {
        arrayCopy.splice(arrayCopy.indexOf(item), 1);
    }
    return arrayCopy;
};
exports.removeAllOccurencesFromItem = removeAllOccurencesFromItem;
const areArraysEqual = (array1, array2) => {
    let a = [...array1];
    let b = [...array2];
    a.sort((primer, segundo) => primer - segundo);
    b.sort((primer, segundo) => primer - segundo);
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
};
exports.areArraysEqual = areArraysEqual;
//# sourceMappingURL=array_functions.js.map