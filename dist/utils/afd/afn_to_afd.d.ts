import TreeNode from "../arbol_sintactico/TreeNode";
export declare const afn_to_afd: (treeNode: TreeNode) => any;
export declare const getLanguageCharactersFromTreeNode: (treeNode: TreeNode) => Array<string>;
export declare const convertAFDToD3Graph: (treeNode: TreeNode) => Afd;
export declare class Afd {
    nodes: Array<any>;
    links: Array<any>;
    constructor(nodes: Array<any>, links: Array<any>);
}
