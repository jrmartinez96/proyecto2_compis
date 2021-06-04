export declare class KeywordDecl {
    ident: String;
    set: String;
    regularExpression: String;
    constructor();
    setCharacterSetDecl(decl: String): void;
    toRegularExpression(): String;
}
