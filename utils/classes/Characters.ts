export class Char {
    value: String | number;
    type: number; // 0: string, 1: numero ascii

    constructor(value: String | number, type: number) {
        this.value = value;
        this.type = type;
    }

    getValue(): String {
        let char = '';
        if (typeof this.value === 'string') {
            char = this.value.toString();
        } else if (typeof this.value === 'number') {
            char = String.fromCharCode(this.value);
        }

        return char;
    }
}

class CharToChar {
    initial: Char;
    final: Char;

    constructor(initial: Char, final: Char) {
        this.initial = initial;
        this.final = final;
    }
}

class BasicSet {
    value: String | Char | CharToChar = '';
    type: number = -1; // 0: string, 1: ident, 2: char, 3: char to char
    addition: boolean | null = null; // si es null entonces no hay signo

    regularExpression: String = '';

    constructor() {};

    setBasicSet(basicSet: String) {
        // Set addition
        if (basicSet[0] === "+") {
            this.addition = true;
        } else if (basicSet[0] === "-") {
            this.addition = false;
        }
        
        // Quitar signo para valor del set
        if (this.addition !== null) {
            basicSet = basicSet.substr(1, basicSet.length).trim();
        }

        // Set type
        if (basicSet[0] === '"') {
            this.type = 0;
        } else if (basicSet.includes('CHR(') || basicSet[0] === '\'') {
            if (basicSet.includes('..')) {
                this.type = 3;
            } else {
                this.type = 2;
            }
        } else {
            this.type = 1;
        }

        // Set value
        if (this.type === 0) {
            const valueString = basicSet.substr(1, basicSet.length - 2);
            this.value = valueString;
        } else if (this.type === 1) {
            this.value = basicSet;
        } else if (this.type === 2) {
            if (basicSet.includes('CHR(')) {
                const parenthesisOpenIndex = basicSet.indexOf('(');
                const parenthesisCloseIndex = basicSet.indexOf(')');
                const charValue = parseInt(basicSet.substring(parenthesisOpenIndex + 1, parenthesisCloseIndex));
                const char = new Char(charValue, 1);
                this.value = char;
            } else if (basicSet[0] === '\'') {
                const charValue = basicSet[1];
                const char = new Char(charValue, 0);
                this.value = char;
            }
        } else if (this.type === 3) {
            const doubleDotIndex = basicSet.indexOf('..');
            const firstCharString = basicSet.substring(0, doubleDotIndex).trim();
            const lastCharString = basicSet.substring(doubleDotIndex + 2, basicSet.length).trim();

            let firstChar = new Char("", -1);
            let lastChar = new Char("", -1);

            // First char string
            if (firstCharString.includes('CHR(')) {
                const parenthesisOpenIndex = firstCharString.indexOf('(');
                const parenthesisCloseIndex = firstCharString.indexOf(')');
                const charValue = parseInt(firstCharString.substring(parenthesisOpenIndex + 1, parenthesisCloseIndex));
                const char = new Char(charValue, 1);
                firstChar = char;
            } else if (firstCharString[0] === '\'') {
                const charValue = firstCharString[1];
                const char = new Char(charValue, 0);
                firstChar = char;
            }

            // Last char string
            if (lastCharString.includes('CHR(')) {
                const parenthesisOpenIndex = lastCharString.indexOf('(');
                const parenthesisCloseIndex = lastCharString.indexOf(')');
                const charValue = parseInt(lastCharString.substring(parenthesisOpenIndex + 1, parenthesisCloseIndex));
                const char = new Char(charValue, 1);
                lastChar = char;
            } else if (lastCharString[0] === '\'') {
                const charValue = lastCharString[1];
                const char = new Char(charValue, 0);
                lastChar = char;
            }

            this.value = new CharToChar(firstChar, lastChar);
        }
    }

    toRegularExpression(currentCharactersDecl: Array<CharacterSetDecl>): String {
        let regularExpression = '';
        if (this.type === 0 && typeof this.value === 'string') { // Si es un string
            for (let i = 0; i < this.value.length; i++) {
                const character = this.value[i];
                regularExpression = regularExpression + `${character}|`;
            }
            regularExpression = regularExpression.substring(0, regularExpression.length - 1);
        } else if (this.type === 1 && typeof this.value === 'string') { // si es un ident
            let identCharacterDecl = new CharacterSetDecl();

            currentCharactersDecl.forEach(characterDecl => {
                if (this.value === characterDecl.ident) {
                    identCharacterDecl = characterDecl; 
                }
            });
            let identRegularExpression = identCharacterDecl.regularExpression.toString();
            regularExpression = identRegularExpression.substring(1, identRegularExpression.length - 1);
        } else if (this.type === 2 && this.value instanceof Char) { // si es char
            regularExpression = this.value.getValue().toString();
        } else if (this.type === 3 && this.value instanceof CharToChar) {
            let initialCharCode = this.value.initial.getValue().charCodeAt(0);
            let finalCharCode = this.value.final.getValue().charCodeAt(0);

            for (let i = initialCharCode; i <= finalCharCode; i++) {
                const currentCharCode = i;
                regularExpression = regularExpression + `${String.fromCharCode(currentCharCode)}|`;
            }
            regularExpression = regularExpression.substring(0, regularExpression.length - 1);
        }

        return regularExpression;
    }
}

class CharacterSet {
    basicSets: Array<BasicSet> = [];

    constructor() {};

    setCharacterSet(set: String){
        let plusSignIndex = set.indexOf('+');
        let minusSignIndex = set.indexOf('-');
        const dotSignIndex = set.lastIndexOf('.');

        if (set[0] === "+" || set[0] === "-") {
            plusSignIndex = set.substr(1, set.length).indexOf('+');
            minusSignIndex = set.substr(1, set.length).indexOf('-');

            if (plusSignIndex !== -1 ) plusSignIndex = plusSignIndex + 1;
            if (minusSignIndex !== -1 ) minusSignIndex = minusSignIndex + 1;
        }

        if (plusSignIndex === -1) plusSignIndex = 1000;
        if (minusSignIndex === -1) minusSignIndex = 1000;

        if (plusSignIndex === 1000 && minusSignIndex === 1000) {
            const basicSetString = set.substr(0, dotSignIndex).trim();
            const basicSet = new BasicSet();
            basicSet.setBasicSet(basicSetString);
            this.basicSets.push(basicSet);
        } else if (plusSignIndex < minusSignIndex) {
            const basicSetString = set.substr(0, plusSignIndex).trim();
            const basicSet = new BasicSet();
            basicSet.setBasicSet(basicSetString);
            this.basicSets.push(basicSet);

            const restBasicSetString = set.substr(plusSignIndex, set.length);
            this.setCharacterSet(restBasicSetString);
        } else if (minusSignIndex < plusSignIndex) {
            const basicSetString = set.substr(0, minusSignIndex).trim();
            const basicSet = new BasicSet();
            basicSet.setBasicSet(basicSetString);
            this.basicSets.push(basicSet);

            const restBasicSetString = set.substr(minusSignIndex, set.length);
            this.setCharacterSet(restBasicSetString);
        }
    }

    differenceBetweenBasicSets(basicSet1: BasicSet, basicSet2: BasicSet, currentCharactersDecl: Array<CharacterSetDecl>): String {
        let regularExpression = '';
        let regularExpression1 = basicSet1.toRegularExpression(currentCharactersDecl).replace(/\|/g, '');
        let regularExpression2 = basicSet2.toRegularExpression(currentCharactersDecl).replace(/\|/g, '');

        for (let i = 0; i < regularExpression2.length; i++) {
            const char = regularExpression2[i];

            let re = new RegExp(char,"g");
            regularExpression1 = regularExpression1.replace(re, '');
        }

        for (let i = 0; i < regularExpression1.length; i++) {
            const char = regularExpression1[i];
            regularExpression = regularExpression + `${char}|`;
        }

        regularExpression = regularExpression.substring(0, regularExpression.length - 1);

        return regularExpression;
    }

    toRegularExpression(currentCharactersDecl: Array<CharacterSetDecl>): String {
        let regularExpression = '';

        for (let i = 0; i < this.basicSets.length; i++) {
            const basicSet = this.basicSets[i];
            
            basicSet.regularExpression = basicSet.toRegularExpression(currentCharactersDecl);
            const nextBasicSet = this.basicSets[i + 1];
            if (nextBasicSet !== undefined) {
                if (nextBasicSet.addition) {
                    regularExpression = regularExpression + '(' + basicSet.toRegularExpression(currentCharactersDecl) + ')';
                } else {
                    regularExpression = regularExpression + '(' + this.differenceBetweenBasicSets(basicSet, nextBasicSet, currentCharactersDecl) + ')';
                    i = i + 1;
                }
            } else {
                regularExpression = regularExpression + '(' + basicSet.toRegularExpression(currentCharactersDecl) + ')';
            }
        }

        return regularExpression;
    }
}

export class CharacterSetDecl {
    ident: String = '';
    set: CharacterSet = new CharacterSet();
    regularExpression: String = '';

    constructor() {};

    setCharacterSetDecl(decl: String) {
        const equalIndex = decl.indexOf('=');
        this.ident = decl.substr(0, equalIndex).trim();

        const setString = decl.substr(equalIndex + 1, decl.length).trim();
        this.set.setCharacterSet(setString);
    }

    toRegularExpression(currentCharactersDecl: Array<CharacterSetDecl>): String {
        this.regularExpression = this.set.toRegularExpression(currentCharactersDecl);
        return this.regularExpression;
    }
}