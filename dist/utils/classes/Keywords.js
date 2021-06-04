"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordDecl = void 0;
class KeywordDecl {
    constructor() {
        this.ident = '';
        this.set = '';
        this.regularExpression = '';
    }
    ;
    setCharacterSetDecl(decl) {
        const equalIndex = decl.indexOf('=');
        this.ident = decl.substr(0, equalIndex).trim();
        const setString = decl.substr(equalIndex + 1, decl.length).trim().replace('.', '').replace('"', '').replace('"', '');
        this.set = setString;
    }
    toRegularExpression() {
        this.regularExpression = "(" + this.set + ")";
        return this.regularExpression;
    }
}
exports.KeywordDecl = KeywordDecl;
//# sourceMappingURL=Keywords.js.map