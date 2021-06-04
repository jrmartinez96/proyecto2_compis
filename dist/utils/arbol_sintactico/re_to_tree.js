"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.re_to_tree = void 0;
const TreeNode_1 = __importDefault(require("./TreeNode"));
// Lee la expresion de fin a principio
const re_to_tree = (regularExpression) => {
    const lastCharacter = regularExpression[regularExpression.length - 1];
    if (lastCharacter === '*') {
        let childKleene;
        const secondLastCharacter = regularExpression[regularExpression.length - 2];
        let nextExpression = regularExpression.substring(0, regularExpression.length - 1);
        if (secondLastCharacter !== ')') {
            nextExpression = regularExpression.substring(0, regularExpression.length - 2);
            childKleene = exports.re_to_tree(secondLastCharacter);
        }
        else {
            const parethesesExpression = get_expr_from_parentheses(nextExpression);
            childKleene = exports.re_to_tree(parethesesExpression);
            nextExpression = regularExpression.substring(0, regularExpression.length - (parethesesExpression.length + 3));
        }
        const kleeneNode = new TreeNode_1.default(3, '', null, childKleene);
        if (nextExpression === '') {
            return kleeneNode;
        }
        let unionNodeType = 0;
        if (nextExpression[nextExpression.length - 1] === '|') {
            unionNodeType = 1; // OR
            nextExpression = nextExpression.substring(0, nextExpression.length - 1);
        }
        else {
            unionNodeType = 2; // CONCAT
        }
        const unionNode = new TreeNode_1.default(unionNodeType, '', exports.re_to_tree(nextExpression), kleeneNode);
        return unionNode;
    }
    // else if (lastCharacter === '+') {
    //     let childKleenePos: TreeNode;
    //     const secondLastCharacter = regularExpression[regularExpression.length - 2];
    //     let nextExpression = regularExpression.substring(0, regularExpression.length - 1);
    //     if (secondLastCharacter !== ')') {
    //         nextExpression = regularExpression.substring(0, regularExpression.length - 2);
    //         childKleenePos = re_to_tree(secondLastCharacter);
    //     } else {
    //         const parethesesExpression = get_expr_from_parentheses(nextExpression);
    //         childKleenePos = re_to_tree(parethesesExpression);
    //         nextExpression = regularExpression.substring(0, regularExpression.length - (parethesesExpression.length + 3));
    //     }
    //     const kleenePosNode = new TreeNode(4, '', null, childKleenePos);
    //     if (nextExpression === '') {
    //         return kleenePosNode;
    //     }
    //     let unionNodeType = 0;
    //     if (nextExpression[nextExpression.length - 1] === '|') {
    //         unionNodeType = 1; // OR
    //         nextExpression = nextExpression.substring(0, nextExpression.length - 1);
    //     } else {
    //         unionNodeType = 2; // CONCAT
    //     }
    //     const unionNode = new TreeNode(unionNodeType, '', re_to_tree(nextExpression), kleenePosNode);
    //     return unionNode;
    // } 
    else if (lastCharacter === '?') {
        let childZeroOrInstance;
        const secondLastCharacter = regularExpression[regularExpression.length - 2];
        let nextExpression = regularExpression.substring(0, regularExpression.length - 1);
        if (secondLastCharacter !== ')') {
            nextExpression = regularExpression.substring(0, regularExpression.length - 2);
            childZeroOrInstance = exports.re_to_tree(secondLastCharacter);
        }
        else {
            const parethesesExpression = get_expr_from_parentheses(nextExpression);
            childZeroOrInstance = exports.re_to_tree(parethesesExpression);
            nextExpression = regularExpression.substring(0, regularExpression.length - (parethesesExpression.length + 3));
        }
        const zeroOrInstanceNode = new TreeNode_1.default(5, '', null, childZeroOrInstance);
        if (nextExpression === '') {
            return zeroOrInstanceNode;
        }
        let unionNodeType = 0;
        if (nextExpression[nextExpression.length - 1] === '|') {
            unionNodeType = 1; // OR
            nextExpression = nextExpression.substring(0, nextExpression.length - 1);
        }
        else {
            unionNodeType = 2; // CONCAT
        }
        const unionNode = new TreeNode_1.default(unionNodeType, '', exports.re_to_tree(nextExpression), zeroOrInstanceNode);
        return unionNode;
    }
    else if (lastCharacter === ")") {
        const parethesesExpression = get_expr_from_parentheses(regularExpression);
        const parenthesisNode = exports.re_to_tree(parethesesExpression);
        const nextExpression = regularExpression.substring(0, regularExpression.length - (parethesesExpression.length + 2));
        if (nextExpression === '') {
            return parenthesisNode;
        }
        else {
            if (nextExpression[nextExpression.length - 1] === "|") {
                const orNode = new TreeNode_1.default(1, '', exports.re_to_tree(nextExpression.substring(0, nextExpression.length - 1)), parenthesisNode);
                return orNode;
            }
            else {
                const concatNode = new TreeNode_1.default(2, '', exports.re_to_tree(nextExpression), parenthesisNode);
                return concatNode;
            }
        }
    }
    else { // Si es un caracter del lenguaje que no sean operaciones
        const secondLastCharacter = regularExpression[regularExpression.length - 2];
        const characterNode = new TreeNode_1.default(0, lastCharacter, null, null);
        if (secondLastCharacter === undefined) { // Si es el ultimo caracter
            return characterNode;
        }
        else {
            if (secondLastCharacter === '|') { // Le sigue un OR
                const nextExpression = regularExpression.substring(0, regularExpression.length - 2);
                const orNode = new TreeNode_1.default(1, '', exports.re_to_tree(nextExpression), characterNode);
                return orNode;
            }
            else { // Le sigue un CONCAT
                const nextExpression = regularExpression.substring(0, regularExpression.length - 1);
                const concatNode = new TreeNode_1.default(2, '', exports.re_to_tree(nextExpression), characterNode);
                return concatNode;
            }
        }
    }
};
exports.re_to_tree = re_to_tree;
// Lee la expresion de fin a principio para encontrar la expresion dentro del parentesis
const get_expr_from_parentheses = (expression) => {
    let closeParenCount = 0;
    let openParenCount = 0;
    let returnExpression = '';
    for (let i = expression.length - 1; i >= 0; i--) {
        const character = expression[i];
        if (character === ')') {
            closeParenCount++;
        }
        else if (character === '(') {
            openParenCount++;
        }
        // Si ya se cerraron todos los parenetsis dentro de la expresion
        if (closeParenCount === openParenCount) {
            returnExpression = expression.substring(i + 1, expression.length - 1);
            i = -1;
        }
    }
    return returnExpression;
};
//# sourceMappingURL=re_to_tree.js.map