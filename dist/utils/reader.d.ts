import { PathLike } from 'node:fs';
import { Compiler } from './classes/Compiler';
import { Afd } from './afd/afn_to_afd';
export declare const readFile: (filePath: PathLike) => Array<String>;
export declare const readLines: (lines: Array<String>) => Compiler;
export declare const writePythonFile: (compiler: Compiler, afd: Afd, keywordsAfd: Afd) => void;
