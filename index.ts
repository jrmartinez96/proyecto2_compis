import { readFile, readLines } from './utils/reader';
import { CharacterSetDecl } from './utils/classes/Characters';
import { KeywordDecl } from './utils/classes/Keywords';
import { TokenDeclaration } from './utils/classes/Tokens';
import { re_to_tree } from './utils/arbol_sintactico/re_to_tree';
import { afn_to_afd, convertAFDToD3Graph } from './utils/afd/afn_to_afd';

const lines = readFile('pruebas/prueba.ATG');

const compiler = readLines(lines);

// CHARACTERS
compiler.charactersLines.forEach(line => {
    let setDecl = new CharacterSetDecl();
    setDecl.setCharacterSetDecl(line);

    compiler.charactersSetDeclarations.push(setDecl);
});

// KEYWORDS
compiler.keywordsLines.forEach(line => {
    let keywordDecl = new KeywordDecl();
    keywordDecl.setCharacterSetDecl(line);

    compiler.keywordsDeclarations.push(keywordDecl);
});

// TOKENS
compiler.tokensLines.forEach(line => {
    let tokenDecl = new TokenDeclaration();
    tokenDecl.setTokenDeclaration(line);

    compiler.tokensDeclarations.push(tokenDecl);
});


console.log(compiler.name);
compiler.charactersSetDeclarations.forEach(setDecl => {
    setDecl.toRegularExpression(compiler.charactersSetDeclarations);
});

compiler.keywordsDeclarations.forEach(setDecl => {
    setDecl.toRegularExpression();
});

let regularExpression = '';
compiler.tokensDeclarations.forEach(decl => {
    decl.toRegularExpression(compiler.charactersSetDeclarations);
    console.log(decl.ident);
    console.log(decl.regularExpression);

    regularExpression = regularExpression + "(" + decl.regularExpression + ")|"
})

regularExpression = regularExpression.substring(0, regularExpression.length - 1);

console.log("Regular expression: ");
console.log(regularExpression);

const treeNode = re_to_tree(regularExpression);
const afd = convertAFDToD3Graph(treeNode);

console.log(afd);
