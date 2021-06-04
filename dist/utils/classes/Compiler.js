"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phases = exports.Compiler = void 0;
class Compiler {
    constructor() {
        // Compiler Name
        this.name = '';
        this.hasEnd = false;
        // Characters
        this.charactersLines = [];
        this.charactersSetDeclarations = [];
        // Keywords
        this.keywordsLines = [];
        this.keywordsDeclarations = [];
        // Tokens
        this.tokensLines = [];
        this.tokensDeclarations = [];
        // Productions
        this.productionsLines = [];
    }
    compressProductionsLines() {
        let newProductionsLines = [];
        let productionLine = '';
        this.productionsLines.forEach(line => {
            if (line[line.length - 1] == '.') {
                productionLine = productionLine.concat(line.toString());
                newProductionsLines.push(productionLine);
                productionLine = '';
            }
            else {
                productionLine = productionLine.concat(line.toString());
            }
        });
        this.productionsLines = newProductionsLines;
    }
}
exports.Compiler = Compiler;
/**
 * 'COMPILER': Buscando compilador
 * 'STANDBY': Buscando compilador
 * 'CHARACTERS': Buscando caracteres
 * 'KEYWORDS': Buscando keywords
 * 'TOKENS': Buscando tokens
 */
exports.phases = {
    'COMPILER': 'COMPILER',
    'STANDBY': 'STANDBY',
    'CHARACTERS': 'CHARACTERS',
    'KEYWORDS': 'KEYWORDS',
    'TOKENS': 'TOKENS',
    'PRODUCTIONS': 'PRODUCTIONS'
};
//# sourceMappingURL=Compiler.js.map