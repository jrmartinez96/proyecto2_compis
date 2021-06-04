"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("./utils/reader");
const Characters_1 = require("./utils/classes/Characters");
const Keywords_1 = require("./utils/classes/Keywords");
const Tokens_1 = require("./utils/classes/Tokens");
const re_to_tree_1 = require("./utils/arbol_sintactico/re_to_tree");
const afn_to_afd_1 = require("./utils/afd/afn_to_afd");
const lines = reader_1.readFile(`pruebas/${process.env.npm_config_cocor}`);
const compiler = reader_1.readLines(lines);
// CHARACTERS
compiler.charactersLines.forEach(line => {
    let setDecl = new Characters_1.CharacterSetDecl();
    setDecl.setCharacterSetDecl(line);
    compiler.charactersSetDeclarations.push(setDecl);
});
// KEYWORDS
compiler.keywordsLines.forEach(line => {
    let keywordDecl = new Keywords_1.KeywordDecl();
    keywordDecl.setCharacterSetDecl(line);
    compiler.keywordsDeclarations.push(keywordDecl);
});
// TOKENS
compiler.tokensLines.forEach(line => {
    let tokenDecl = new Tokens_1.TokenDeclaration();
    tokenDecl.setTokenDeclaration(line);
    compiler.tokensDeclarations.push(tokenDecl);
});
// PRODUCTIONS
compiler.compressProductionsLines();
console.log(compiler.productionsLines);
console.log(compiler.name);
compiler.charactersSetDeclarations.forEach(setDecl => {
    setDecl.toRegularExpression(compiler.charactersSetDeclarations);
});
compiler.keywordsDeclarations.forEach(setDecl => {
    setDecl.toRegularExpression();
});
// KEYWORDS REGULAR EXPRESSION
let keywordsRegularExpression = '';
compiler.keywordsDeclarations.forEach(decl => {
    keywordsRegularExpression = keywordsRegularExpression + "(" + decl.regularExpression + ")|";
});
keywordsRegularExpression = keywordsRegularExpression.substring(0, keywordsRegularExpression.length - 1);
// TOKENS REGULAR EXPRESSION
let regularExpression = '';
compiler.tokensDeclarations.forEach(decl => {
    decl.toRegularExpression(compiler.charactersSetDeclarations);
    regularExpression = regularExpression + "(" + decl.regularExpression + ")|";
});
regularExpression = regularExpression.substring(0, regularExpression.length - 1);
console.log(regularExpression);
const treeNode = re_to_tree_1.re_to_tree(regularExpression);
const afd = afn_to_afd_1.convertAFDToD3Graph(treeNode);
console.log(keywordsRegularExpression);
const keywordsTreeNode = re_to_tree_1.re_to_tree(keywordsRegularExpression);
const keywordsAfd = afn_to_afd_1.convertAFDToD3Graph(keywordsTreeNode);
const pythonFile = reader_1.writePythonFile(compiler, afd, keywordsAfd);
//# sourceMappingURL=index.js.map