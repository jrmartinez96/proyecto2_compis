export class KeywordDecl {
    ident: String = '';
    set: String = '';
    regularExpression: String = ''

    constructor() {};

    setCharacterSetDecl(decl: String) {
        const equalIndex = decl.indexOf('=');
        this.ident = decl.substr(0, equalIndex).trim();

        const setString = decl.substr(equalIndex + 1, decl.length).trim().replace('.', '').replace('"', '').replace('"', '');
        this.set = setString;
    }

    toRegularExpression(): String {
        this.regularExpression = "(" + this.set + ")";
        return this.regularExpression;
    }
}