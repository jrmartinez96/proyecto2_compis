"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Afd = exports.convertAFDToD3Graph = exports.getLanguageCharactersFromTreeNode = exports.afn_to_afd = void 0;
const tree_to_afn_1 = require("../afn/tree_to_afn");
const array_functions_1 = require("./array_functions");
const nextChar_1 = require("./nextChar");
// Se obtendra una tabla de transiciones de tipo objeto, cada llave representa un estado, y dentro de la llave se encuentra otro objeto que contiene informacion del estado (el conjunto que representa, los estados a los que se mueve con las letras ej: e(Mueve(A, a)))
const afn_to_afd = (treeNode) => {
    const afn = tree_to_afn_1.tree_to_afn(treeNode, [[], []], 0, 1);
    const languageCharacters = exports.getLanguageCharactersFromTreeNode(treeNode);
    var transitionTable = {
        "1": {
            name: '1',
            set: eClosure(afn, [0], []),
            isDoneChecking: false
        }
    };
    while (!isAllDoneChecking(transitionTable)) {
        let copyTransitionTable = Object.assign({}, transitionTable);
        let newTransitionTable = Object.assign({}, transitionTable);
        const keys = Object.keys(copyTransitionTable);
        keys.forEach((key) => {
            if (copyTransitionTable[key]["isDoneChecking"] === false) {
                const stateSet = copyTransitionTable[key]["set"];
                languageCharacters.forEach(character => {
                    const cMove = move(afn, stateSet, character);
                    const cClosure = eClosure(afn, cMove, []);
                    newTransitionTable[key][character] = cClosure;
                    if (cClosure.length > 0 && !doesSetExists(newTransitionTable, cClosure)) {
                        const stateNames = Object.keys(newTransitionTable);
                        const lastCharacter = stateNames[stateNames.length - 1];
                        const nextCharacter = nextChar_1.nextChar(lastCharacter);
                        newTransitionTable = Object.assign(Object.assign({}, newTransitionTable), { [nextCharacter]: {
                                name: nextCharacter,
                                set: cClosure,
                                isDoneChecking: false
                            } });
                    }
                });
                newTransitionTable[key]["isDoneChecking"] = true;
            }
        });
        transitionTable = Object.assign({}, newTransitionTable);
    }
    transitionTable = convertCharacterSetToState(transitionTable, languageCharacters);
    return transitionTable;
};
exports.afn_to_afd = afn_to_afd;
const eClosure = (afn, states, alreadyChecked) => {
    let set = [];
    let alreadyCheckedCopy = [...alreadyChecked];
    states.forEach((state) => {
        set = [...set, state]; // Siempre se agrega el estado que se evalua
        alreadyCheckedCopy = array_functions_1.deleteArrayDuplicates([...alreadyCheckedCopy, ...set]);
        let stateSet = [];
        afn[state].forEach((transition, index) => {
            if (transition === '&') {
                stateSet = [...stateSet, index];
            }
        });
        stateSet = eClosure(afn, array_functions_1.removeAllOccurencesFromArray(stateSet, alreadyChecked), alreadyCheckedCopy);
        set = [...set, ...stateSet];
    });
    const setWithoutDuplicates = array_functions_1.deleteArrayDuplicates(set);
    return setWithoutDuplicates;
};
const move = (afn, states, character) => {
    let moveSet = [];
    states.forEach(state => {
        afn[state].forEach((transition, index) => {
            if (transition === character) {
                moveSet = [...moveSet, index];
            }
        });
        moveSet = array_functions_1.deleteArrayDuplicates(moveSet);
        moveSet = [...moveSet, ...move(afn, moveSet, character)];
    });
    moveSet = array_functions_1.deleteArrayDuplicates(moveSet);
    return moveSet;
};
const getLanguageCharactersFromTreeNode = (treeNode) => {
    let characters = [];
    // Obtener caracteres del lenguaje
    if (treeNode.isLeaf()) {
        characters.push(treeNode.value);
    }
    else {
        if (treeNode.leftChild !== null) {
            const leftLeafCharacters = exports.getLanguageCharactersFromTreeNode(treeNode.leftChild);
            characters = [...characters, ...leftLeafCharacters];
        }
        if (treeNode.rightChild !== null) {
            const rightLeafCharacters = exports.getLanguageCharactersFromTreeNode(treeNode.rightChild);
            characters = [...characters, ...rightLeafCharacters];
        }
    }
    characters = array_functions_1.removeAllOccurencesFromItem(characters, '&');
    // Eliminar duplicados del array
    let charactersWithoutDuplicates = array_functions_1.deleteArrayDuplicates(characters);
    return charactersWithoutDuplicates;
};
exports.getLanguageCharactersFromTreeNode = getLanguageCharactersFromTreeNode;
const isAllDoneChecking = (transitionTable) => {
    const keys = Object.keys(transitionTable);
    let isDoneChecking = true;
    keys.forEach(key => {
        const isKeyDoneChecking = transitionTable[key]["isDoneChecking"];
        isDoneChecking = isDoneChecking && isKeyDoneChecking;
    });
    return isDoneChecking;
};
const doesSetExists = (transitionTable, set) => {
    const keys = Object.keys(transitionTable);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const stateSet = transitionTable[key]["set"];
        if (array_functions_1.areArraysEqual(stateSet, set)) {
            return true;
        }
    }
    return false;
};
const convertCharacterSetToState = (transitionTable, languageCharacters) => {
    let newTransitionTable = Object.assign({}, transitionTable);
    const keys = Object.keys(newTransitionTable);
    keys.forEach(key => {
        const state = transitionTable[key];
        languageCharacters.forEach(character => {
            const characterSet = state[character];
            if (characterSet.length > 0) {
                keys.forEach(otherStateKey => {
                    const otherStateSet = transitionTable[otherStateKey]["set"];
                    if (array_functions_1.areArraysEqual(otherStateSet, characterSet)) {
                        const otherStateName = transitionTable[otherStateKey]["name"];
                        newTransitionTable[key][character] = otherStateName;
                    }
                });
            }
            else {
                newTransitionTable[key][character] = '';
            }
        });
    });
    return newTransitionTable;
};
const convertAFDToD3Graph = (treeNode) => {
    let nodes = [];
    let links = [];
    const afd = exports.afn_to_afd(treeNode);
    const languageCharacters = exports.getLanguageCharactersFromTreeNode(treeNode);
    const keys = Object.keys(afd);
    keys.forEach(key => {
        const state = afd[key];
        const set = state["set"];
        nodes.push({ id: key, label: key, isInitial: set.indexOf(0) !== -1, isFinal: set.indexOf(1) !== -1 });
        languageCharacters.forEach((character) => {
            const characterTarget = state[character];
            if (characterTarget !== '') {
                links.push({ source: key, target: characterTarget, label: character });
            }
        });
    });
    return new Afd(nodes, links);
};
exports.convertAFDToD3Graph = convertAFDToD3Graph;
class Afd {
    constructor(nodes, links) {
        this.nodes = nodes;
        this.links = links;
    }
}
exports.Afd = Afd;
//# sourceMappingURL=afn_to_afd.js.map