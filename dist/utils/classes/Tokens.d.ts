import { Char, CharacterSetDecl } from './Characters';
declare class Symbol {
    value: String | Char;
    type: number;
    constructor(value: String | Char, type: number);
    getValue(): String;
}
declare class Factor {
    value: Symbol | Expression;
    type: number;
    setFactor(decl: String): void;
    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String;
}
declare class Term {
    factors: Array<Factor>;
    setTerm(decl: String): void;
    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String;
}
declare class Expression {
    terms: Array<Term>;
    setExpression(decl: String): void;
    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String;
}
export declare class TokenDeclaration {
    ident: String;
    tokenExp: Expression;
    hasExceptKeywords: boolean;
    regularExpression: String;
    setTokenDeclaration(decl: String): void;
    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String;
}
export {};
