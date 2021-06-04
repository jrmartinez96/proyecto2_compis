/**
 * type:
 *      0: id
 *      1: or (|)
 *      2: and (.)
 *      3: Kleene (*)
 *      4: Kleene+ (+)
 *      5: Zero or instance (?)
 */
declare class TreeNode {
    type: number;
    value: string;
    leftChild: TreeNode | null;
    rightChild: TreeNode | null;
    id: string;
    leafId: number | null;
    nullable: boolean | null;
    primerapos: Array<number> | null;
    ultimapos: Array<number> | null;
    constructor(type: number, value: string, leftChild: TreeNode | null, rightChild: TreeNode | null);
    isLeaf: () => boolean;
    printTree: () => void;
    getTreeNodeGraph: () => any;
    toString: () => string;
    setNullable: () => boolean;
    setLeafId: (leafIds: any) => any;
    setPrimerapos: () => Array<number>;
    setUltimapos: () => Array<number>;
    setSiguientepos: (siguientepos: any) => any;
}
export default TreeNode;
