import TreeNode from "../arbol_sintactico/TreeNode";
export declare const tree_to_afn: (treeNode: TreeNode, links: Array<Array<string | undefined>>, initialState: number, finalState: number) => Array<Array<string | undefined>>;
export declare const convert_matrix_to_d3_graph: (matrix: Array<Array<string | undefined>>) => object;
