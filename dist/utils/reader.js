"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writePythonFile = exports.readLines = exports.readFile = void 0;
const n_readlines_1 = __importDefault(require("n-readlines"));
const Compiler_1 = require("./classes/Compiler");
const fs_1 = __importDefault(require("fs"));
const readFile = function (filePath) {
    let lines = [];
    const liner = new n_readlines_1.default(filePath);
    let line;
    while (line = liner.next()) {
        let lineString = line.toString('utf8');
        lineString = lineString.replace('\r', '');
        if (lineString != '') {
            lines.push(lineString);
        }
    }
    return lines;
};
exports.readFile = readFile;
const readLines = function (lines) {
    const compiler = new Compiler_1.Compiler();
    let phase = Compiler_1.phases.COMPILER;
    lines.every(lineNoTrime => {
        let line = lineNoTrime.trim();
        if (phase == Compiler_1.phases.COMPILER) {
            if (line.includes('COMPILER')) {
                let compilerLine = line;
                compilerLine = compilerLine.replace('COMPILER', '');
                compiler.name = compilerLine.trim();
                phase = Compiler_1.phases.STANDBY;
            }
        }
        else {
            if (line == `END ${compiler.name}`) {
                compiler.hasEnd = true;
                return false;
            }
            // DETERMINE PHASE
            phase = determinePhase(line, phase);
            // Si la fase es CHARACTERS registrar la linea
            if (phase == Compiler_1.phases.CHARACTERS && line != Compiler_1.phases.CHARACTERS) {
                compiler.charactersLines.push(line);
            }
            // Si la fase es KEYWORDS registrar la linea
            if (phase == Compiler_1.phases.KEYWORDS && line != Compiler_1.phases.KEYWORDS) {
                compiler.keywordsLines.push(line);
            }
            // Si la fase es TOKENS registrar la linea
            if (phase == Compiler_1.phases.TOKENS && line != Compiler_1.phases.TOKENS) {
                compiler.tokensLines.push(line);
            }
            // Si la fase es PRODUCTIONS registrar la linea
            if (phase == Compiler_1.phases.PRODUCTIONS && line != Compiler_1.phases.PRODUCTIONS) {
                compiler.productionsLines.push(line.replace(/\t+/g, ''));
            }
        }
        return true;
    });
    return compiler;
};
exports.readLines = readLines;
const determinePhase = function (line, currentPhase) {
    let phase = currentPhase;
    if (line == Compiler_1.phases.CHARACTERS) {
        phase = Compiler_1.phases.CHARACTERS;
    }
    else if (line == Compiler_1.phases.KEYWORDS) {
        phase = Compiler_1.phases.KEYWORDS;
    }
    else if (line == Compiler_1.phases.TOKENS) {
        phase = Compiler_1.phases.TOKENS;
    }
    else if (line == Compiler_1.phases.PRODUCTIONS) {
        phase = Compiler_1.phases.PRODUCTIONS;
    }
    return phase;
};
const writePythonFile = function (compiler, afd, keywordsAfd) {
    const base1 = fs_1.default.readFileSync(__dirname + '/bases/base1.py');
    const base2 = fs_1.default.readFileSync(__dirname + '/bases/base2.py');
    fs_1.default.writeFileSync(__dirname.substring(0, __dirname.length - 6) + `/generated/${compiler.name}.py`, '');
    // agregar primera parte del archivo
    let content = base1.toString('utf8');
    // Agregar nodos
    content = content + '# NODOS\r';
    // Token nodes
    afd.nodes.forEach(node => {
        content = content + `nodes.append(Node('${node['id']}', ${node['isInitial'] ? 'True' : 'False'}, ${node['isFinal'] ? 'True' : 'False'}))\r`;
    });
    content = content + '\r';
    // Token Links
    afd.links.forEach(link => {
        let linkValue = link['label'];
        if (link['label'] === '\n') {
            linkValue = '\\n';
        }
        else if (link['label'] === '\r') {
            linkValue = '\\r';
        }
        content = content + `links.append(Link('${link['source']}', '${link['target']}', '${linkValue}'))\r`;
    });
    content = content + '\r';
    // Keywords nodes
    keywordsAfd.nodes.forEach(node => {
        content = content + `keywordsNodes.append(Node('${node['id']}', ${node['isInitial'] ? 'True' : 'False'}, ${node['isFinal'] ? 'True' : 'False'}))\r`;
    });
    content = content + '\r';
    // Keywords Links
    keywordsAfd.links.forEach(link => {
        content = content + `keywordsLinks.append(Link('${link['source']}', '${link['target']}', '${link['label']}'))\r`;
    });
    content = content + '\r';
    // agregar segunda parte del programa
    content = content + base2.toString('utf8');
    fs_1.default.appendFile(__dirname.substring(0, __dirname.length - 6) + `/generated/${compiler.name}.py`, content, (err) => { });
};
exports.writePythonFile = writePythonFile;
//# sourceMappingURL=reader.js.map