import { CharacterSetDecl } from './Characters';
import { KeywordDecl } from './Keywords'
import { TokenDeclaration } from './Tokens';

export class Compiler {
    // Compiler Name
    name: String = '';
    hasEnd: boolean = false;

    // Characters
    charactersLines: Array<String> = [];
    charactersSetDeclarations: Array<CharacterSetDecl> = [];

    // Keywords
    keywordsLines: Array<String> = [];
    keywordsDeclarations: Array<KeywordDecl> = []


    // Tokens
    tokensLines: Array<String> = [];
    tokensDeclarations: Array<TokenDeclaration> = [];
}

/**
 * 'COMPILER': Buscando compilador
 * 'STANDBY': Buscando compilador
 * 'CHARACTERS': Buscando caracteres
 * 'KEYWORDS': Buscando keywords
 * 'TOKENS': Buscando tokens
 */
 export const phases = {
    'COMPILER': 'COMPILER',
    'STANDBY': 'STANDBY',
    'CHARACTERS': 'CHARACTERS',
    'KEYWORDS': 'KEYWORDS',
    'TOKENS': 'TOKENS'
};