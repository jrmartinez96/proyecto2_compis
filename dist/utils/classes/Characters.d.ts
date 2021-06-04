export declare class Char {
    value: String | number;
    type: number;
    constructor(value: String | number, type: number);
    getValue(): String;
}
declare class CharToChar {
    initial: Char;
    final: Char;
    constructor(initial: Char, final: Char);
}
declare class BasicSet {
    value: String | Char | CharToChar;
    type: number;
    addition: boolean | null;
    regularExpression: String;
    constructor();
    setBasicSet(basicSet: String): void;
    toRegularExpression(currentCharactersDecl: Array<CharacterSetDecl>): String;
}
declare class CharacterSet {
    basicSets: Array<BasicSet>;
    constructor();
    setCharacterSet(set: String): void;
    newSetCharacterSet(set: String): void;
    differenceBetweenBasicSets(basicSet1: BasicSet, basicSet2: BasicSet, currentCharactersDecl: Array<CharacterSetDecl>): String;
    deleteAllOccurences(character: String, base: String): String;
    toRegularExpression(currentCharactersDecl: Array<CharacterSetDecl>): String;
}
export declare class CharacterSetDecl {
    ident: String;
    set: CharacterSet;
    regularExpression: String;
    constructor();
    setCharacterSetDecl(decl: String): void;
    toRegularExpression(currentCharactersDecl: Array<CharacterSetDecl>): String;
}
export {};
