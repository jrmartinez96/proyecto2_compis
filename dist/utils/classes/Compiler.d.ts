import { CharacterSetDecl } from './Characters';
import { KeywordDecl } from './Keywords';
import { TokenDeclaration } from './Tokens';
export declare class Compiler {
    name: String;
    hasEnd: boolean;
    charactersLines: Array<String>;
    charactersSetDeclarations: Array<CharacterSetDecl>;
    keywordsLines: Array<String>;
    keywordsDeclarations: Array<KeywordDecl>;
    tokensLines: Array<String>;
    tokensDeclarations: Array<TokenDeclaration>;
    productionsLines: Array<String>;
    compressProductionsLines(): void;
}
/**
 * 'COMPILER': Buscando compilador
 * 'STANDBY': Buscando compilador
 * 'CHARACTERS': Buscando caracteres
 * 'KEYWORDS': Buscando keywords
 * 'TOKENS': Buscando tokens
 */
export declare const phases: {
    COMPILER: string;
    STANDBY: string;
    CHARACTERS: string;
    KEYWORDS: string;
    TOKENS: string;
    PRODUCTIONS: string;
};
