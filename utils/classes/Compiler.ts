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

    // Productions
    productionsLines: Array<String> = [];

    compressProductionsLines() {
        let newProductionsLines: Array<String> = [];
        let productionLine: String = '';

        this.productionsLines.forEach(line => {
            if (line[line.length - 1] == '.') {
                productionLine = productionLine.concat(line.toString());
                newProductionsLines.push(productionLine);

                productionLine = '';
            } else {
                productionLine = productionLine.concat(line.toString());
            }
        });

        this.productionsLines = newProductionsLines;
    }
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
    'TOKENS': 'TOKENS',
    'PRODUCTIONS': 'PRODUCTIONS'
};