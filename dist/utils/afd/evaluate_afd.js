"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate_afd = void 0;
const afn_to_afd_1 = require("./afn_to_afd");
const evaluate_afd = (expression, treeNode) => {
    const afd = afn_to_afd_1.afn_to_afd(treeNode);
    let initialStates = [];
    let acceptStates = [];
    const statesNames = Object.keys(afd);
    statesNames.forEach(stateName => {
        const stateSet = afd[stateName]["set"];
        if (stateSet.indexOf(0) !== -1) {
            initialStates.push(stateName);
        }
        if (stateSet.indexOf(1) !== -1) {
            acceptStates.push(stateName);
        }
    });
    let itBelongs = false;
    initialStates.forEach(stateName => {
        let currentStateName = stateName;
        for (let iExpression = 0; iExpression < expression.length; iExpression++) {
            const expressionCharacter = expression[iExpression];
            currentStateName = evaluateCharacter(currentStateName, expressionCharacter, afd);
            if (currentStateName === null) {
                itBelongs = itBelongs || false;
                iExpression = expression.length;
            }
            else {
                if (iExpression === expression.length - 1) {
                    if (acceptStates.indexOf(currentStateName) !== -1) {
                        itBelongs = true;
                    }
                }
            }
        }
    });
    return itBelongs;
};
exports.evaluate_afd = evaluate_afd;
const evaluateCharacter = (initialStateName, character, afd) => {
    const initialState = afd[initialStateName];
    if (initialState[character] !== undefined && initialState[character] !== "") {
        return initialState[character];
    }
    return null;
};
//# sourceMappingURL=evaluate_afd.js.map