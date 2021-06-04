"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert_matrix_to_d3_graph = exports.tree_to_afn = void 0;
// Devuelve una matriz de transiciones entre nodos, si existe una transicion del estado 0 al 1 se obtendra de la siguiente manera: matriz[0][1]
const tree_to_afn = (treeNode, links, initialState, finalState) => {
    let newLinks = [...links];
    if (treeNode.isLeaf()) {
        newLinks[initialState][finalState] = treeNode.value;
    }
    else if (treeNode.type === 2) { // Si es concatenacion
        newLinks = addStateToLinks(newLinks);
        const concatNodeState = newLinks.length - 1;
        if (treeNode.leftChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.leftChild, newLinks, initialState, concatNodeState);
        }
        if (treeNode.rightChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.rightChild, newLinks, concatNodeState, finalState);
        }
    }
    else if (treeNode.type === 1) {
        // State R1Left (top left)
        newLinks = addStateToLinks(newLinks);
        const r1LeftState = newLinks.length - 1;
        // State R1Right (top right)
        newLinks = addStateToLinks(newLinks);
        const r1RightState = newLinks.length - 1;
        // State R2Left (bottom left)
        newLinks = addStateToLinks(newLinks);
        const r2LeftState = newLinks.length - 1;
        // State R2Right (bottom right)
        newLinks = addStateToLinks(newLinks);
        const r2RightState = newLinks.length - 1;
        // Agregar transiciones & (zero, ε)
        newLinks[initialState][r1LeftState] = '&';
        newLinks[initialState][r2LeftState] = '&';
        newLinks[r1RightState][finalState] = '&';
        newLinks[r2RightState][finalState] = '&';
        // Agregar expresiones
        if (treeNode.leftChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.leftChild, newLinks, r1LeftState, r1RightState);
        }
        if (treeNode.rightChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.rightChild, newLinks, r2LeftState, r2RightState);
        }
    }
    else if (treeNode.type === 3) {
        // State RLeft (left)
        newLinks = addStateToLinks(newLinks);
        const rLeftState = newLinks.length - 1;
        // State RRight (right)
        newLinks = addStateToLinks(newLinks);
        const rRightState = newLinks.length - 1;
        // Agregar transiciones & (zero, ε)
        newLinks[initialState][rLeftState] = '&';
        newLinks[initialState][finalState] = '&';
        newLinks[rRightState][finalState] = '&';
        newLinks[rRightState][rLeftState] = '&';
        // Agregar expresiones
        if (treeNode.rightChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.rightChild, newLinks, rLeftState, rRightState);
        }
    }
    else if (treeNode.type === 4) {
        // State R (expresion)
        newLinks = addStateToLinks(newLinks);
        const rState = newLinks.length - 1;
        // State self loop (expresion)
        newLinks = addStateToLinks(newLinks);
        const rSelfLoopState = newLinks.length - 1;
        // Agregar transiciones & (zero, ε)
        newLinks[initialState][rState] = '&';
        newLinks[rState][finalState] = '&';
        newLinks[rSelfLoopState][rState] = '&';
        // Agregar expresion R
        if (treeNode.rightChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.rightChild, newLinks, rState, rSelfLoopState);
        }
    }
    else if (treeNode.type === 5) {
        // State R1Left (top left)
        newLinks = addStateToLinks(newLinks);
        const r1LeftState = newLinks.length - 1;
        // State R1Right (top right)
        newLinks = addStateToLinks(newLinks);
        const r1RightState = newLinks.length - 1;
        // Agregar transiciones & (zero, ε)
        newLinks[initialState][finalState] = '&';
        newLinks[initialState][r1LeftState] = '&';
        newLinks[r1RightState][finalState] = '&';
        // Agregar expresion R
        if (treeNode.rightChild !== null) {
            newLinks = exports.tree_to_afn(treeNode.rightChild, newLinks, r1LeftState, r1RightState);
        }
    }
    return newLinks;
};
exports.tree_to_afn = tree_to_afn;
const addStateToLinks = (links) => {
    let newLinks = [...links];
    // Agregar estado
    newLinks = [...newLinks, []];
    // Agregar nuevas transiciones vacias a nodos
    newLinks.forEach((node, i) => {
        newLinks[i][newLinks.length - 1] = undefined;
    });
    return newLinks;
};
const convert_matrix_to_d3_graph = (matrix) => {
    let nodes = [];
    let links = [];
    matrix.forEach((nodeLinks, i) => {
        nodes.push({ id: i, label: i, isInitial: i === 0, isFinal: i === 1 });
        nodeLinks.forEach((link, j) => {
            if (link !== undefined) {
                links.push({ source: i, target: j, label: link });
            }
        });
    });
    return { nodes: nodes, links: links };
};
exports.convert_matrix_to_d3_graph = convert_matrix_to_d3_graph;
//# sourceMappingURL=tree_to_afn.js.map