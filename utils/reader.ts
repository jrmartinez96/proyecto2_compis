import lineByLine from 'n-readlines';
import { PathLike } from 'node:fs';
import { Compiler, phases } from './classes/Compiler';

export const readFile = function(filePath: PathLike): Array<String> {
    let lines: Array<String> = [];

    const liner = new lineByLine(filePath);
    let line: Buffer | false;

    while (line = liner.next()) {
        let lineString = line.toString('utf8');
        lineString = lineString.replace('\r', '');
        if (lineString != '') {
            lines.push(lineString);
        }
    }

    return lines;
};

export const readLines = function(lines: Array<String>): Compiler {
    const compiler: Compiler = new Compiler();
    
    let phase: String = phases.COMPILER;

    lines.every(lineNoTrime => {
        let line = lineNoTrime.trim();
        if (phase == phases.COMPILER) {
            if (line.includes('COMPILER')) {
                let compilerLine = line;
                compilerLine = compilerLine.replace('COMPILER', '');
                compiler.name = compilerLine.trim();
                phase = phases.STANDBY;
            }
        } else {
            if (line == `END ${compiler.name}`) {
                compiler.hasEnd = true;
                return false;
            }

            // DETERMINE PHASE
            phase = determinePhase(line, phase);

            // Si la fase es CHARACTERS registrar la linea
            if (phase == phases.CHARACTERS && line != phases.CHARACTERS) {
                compiler.charactersLines.push(line);
            }

            // Si la fase es KEYWORDS registrar la linea
            if (phase == phases.KEYWORDS && line != phases.KEYWORDS) {
                compiler.keywordsLines.push(line);
            }

            // Si la fase es TOKENS registrar la linea
            if (phase == phases.TOKENS && line != phases.TOKENS) {
                compiler.tokensLines.push(line);
            }
        }
        return true;
    });

    return compiler;
};

const determinePhase = function(line: String, currentPhase: String) {
    let phase = currentPhase;
    if (line == phases.CHARACTERS) {
        phase = phases.CHARACTERS;
    } else if (line == phases.KEYWORDS) {
        phase = phases.KEYWORDS;
    } else if (line == phases.TOKENS) {
        phase = phases.TOKENS;
    }

    return phase;
}