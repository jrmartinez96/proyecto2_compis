import { Char, CharacterSetDecl } from './Characters';

class Symbol {
    value: String | Char;
    type: number; // 0: string, 1: ident, 2: char,

    constructor(value: String | Char, type: number) {
        this.value = value;
        this.type = type;
    }

    getValue(): String{
        let regularExpression = '';
        if (typeof this.value === 'string') {
            regularExpression = this.value;
        } else if (this.value instanceof Char) {
            regularExpression = this.value.getValue().toString();
        }

        return regularExpression;
    }
}

class Factor {
    value: Symbol | Expression = new Symbol('', -1);
    type: number = -1; // 0: symbol, 1: expression parenthesis, 2: expression option, 3: expression iteration

    setFactor(decl: String){
        const firstChar = decl[0];
        const symbol = new Symbol('', -1);
        const expression = new Expression();

        if (firstChar === '"') {
            symbol.type = 0;
            symbol.value = decl.substring(1, decl.length - 1);

            this.type = 0;
            this.value = symbol;
        } else if (firstChar === "'") {
            symbol.type = 2;
            symbol.value = new Char(decl.substring(1, decl.length - 1), 0);

            this.type = 0;
            this.value = symbol;
        } else if (firstChar === '(') {
            this.type = 1;
            expression.setExpression(decl.substring(1, decl.length - 1));

            this.value = expression;
        } else if (firstChar === '[') {
            this.type = 2;
            expression.setExpression(decl.substring(1, decl.length - 1));

            this.value = expression;
        } else if (firstChar === '{') {
            this.type = 3;
            expression.setExpression(decl.substring(1, decl.length - 1));

            this.value = expression;
        } else {
            symbol.type = 1;
            symbol.value = decl;

            this.type = 0;
            this.value = symbol;
        }
    }

    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String {
        let regularExpression = '';
        if (this.value instanceof Symbol) {
            if (this.value.type === 0) { // Si es un string
                regularExpression = this.value.value.toString();
            } else if (this.value.type === 1) { // Si es un ident
                let characterDecl = new CharacterSetDecl();
                charactersDecl.forEach((decl) => {
                    if (this.value instanceof Symbol) {
                        if (decl.ident === this.value.value) {
                            characterDecl = decl;
                        }
                    }
                });

                regularExpression = characterDecl.regularExpression.toString();
            } else if (this.value.type === 2) {
                regularExpression = this.value.getValue().toString();
            }
        } else if (this.value instanceof Expression) {
            if (this.type === 1) { // Si es paretesis
                regularExpression = "(" + this.value.toRegularExpression(charactersDecl) + ")";
            } else if (this.type === 2) { // si son corchetes [] (opcional)
                regularExpression = "(" + this.value.toRegularExpression(charactersDecl) + ")?";
            } else if (this.type === 3) { // si son corechetes {} (iteracion)
                regularExpression = "(" + this.value.toRegularExpression(charactersDecl) + ")*";
            }
        }

        return regularExpression;
    }
}

class Term {
    factors: Array<Factor> = [];

    setTerm(decl: String) {
        let initialFactorIndex = 0;
        let openParenthesis = 0;
        let openOption = 0;
        let openIteration = 0;
        let openQuote = 0;
        let openSingleQuote = 0;

        for (let i = 0; i < decl.length; i++) {
            const character = decl[i];

            if (character === '(' || character === '[' || character === '{' || character === '"' || character === "'") {
                if (openParenthesis === 0 && openOption === 0 && openIteration === 0 && openQuote === 0 && openSingleQuote === 0) {
                    const factorString = decl.substring(initialFactorIndex, i).trim();
                    if (factorString !== '' && factorString !== '"' && factorString !== "'") {
                        const factor = new Factor();
                        factor.setFactor(factorString);
    
                        this.factors.push(factor);
                    }
                    initialFactorIndex = i + 1;
                }
            }

            if (character === '(') openParenthesis++;
            if (character === ')') openParenthesis = openParenthesis - 1;
            if (character === '[') openOption++;
            if (character === ']') openOption = openOption - 1;
            if (character === '{') openIteration++;
            if (character === '}') openIteration = openIteration - 1;
            if (character === '"') {
                if (openQuote === 0) {
                    openQuote++;
                } else {
                    openQuote = openQuote - 1;
                }
            };
            if (character === "'") {
                if (openSingleQuote === 0) {
                    openSingleQuote++;
                } else {
                    openSingleQuote = openSingleQuote - 1;
                }
            };

            if (character === ')' || character === ']' || character === '}' || character === '"' || character === "'") {
                if (openParenthesis === 0 && openOption === 0 && openIteration === 0 && openQuote === 0 && openSingleQuote === 0) {
                    const factorString = decl.substring(initialFactorIndex - 1, i + 1).trim();
                    if (factorString !== '' && factorString !== '"' && factorString !== "'") {
                        const factor = new Factor();
                        factor.setFactor(factorString);
    
                        this.factors.push(factor);
                    }
                    initialFactorIndex = i + 1;
                }
            }

            if (i + 1 === decl.length && i + 1 !== initialFactorIndex) {
                const factorString = decl.substring(initialFactorIndex, i + 1).trim();
                const factor = new Factor();
                factor.setFactor(factorString);

                this.factors.push(factor);
            }
        }
    }

    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String{
        let regularExpression = '';

        this.factors.forEach(factor => {
            regularExpression = regularExpression + factor.toRegularExpression(charactersDecl);
        });

        return regularExpression;
    }
}

class Expression {
    terms: Array<Term> = [];

    setExpression(decl: String) {
        let orIndex = decl.indexOf('|');
        
        if (orIndex !== -1) {
            let openParenthesis = 0;
            let openOption = 0;
            let openIteration = 0;
            let initialTermIndex = 0;

            for (var i = 0; i < decl.length; i++) {
                const character = decl[i];
                
                if (character === '(') openParenthesis++;
                if (character === ')') openParenthesis = openParenthesis - 1;
                if (character === '[') openOption++;
                if (character === ']') openOption = openOption - 1;
                if (character === '{') openIteration++;
                if (character === '}') openIteration = openIteration - 1;

                if (character === '|' && openParenthesis === 0 && openOption === 0 && openIteration === 0) {
                    const termString = decl.substring(initialTermIndex, i);
                    const term = new Term();
                    term.setTerm(termString);
                    this.terms.push(term);

                    initialTermIndex = i + 1;
                }

                if (i + 1 == decl.length) {
                    const termString = decl.substring(initialTermIndex, i+1);
                    const term = new Term();
                    term.setTerm(termString);
                    this.terms.push(term);
                }
            }
        } else {
            const term = new Term();
            term.setTerm(decl);
            this.terms.push(term);
        }
    }

    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String{
        let regularExpression = '';

        this.terms.forEach(term => {
            regularExpression = regularExpression + "" + term.toRegularExpression(charactersDecl) + "|";
        });

        regularExpression = regularExpression.substring(0, regularExpression.length - 1);

        return regularExpression;
    }

}

export class TokenDeclaration {
    ident: String = '';
    tokenExp: Expression = new Expression();
    hasExceptKeywords: boolean = false;
    regularExpression: String = '';

    setTokenDeclaration(decl: String) {
        // Except
        if (decl.indexOf('EXCEPT KEYWORDS') !== -1) {
            this.hasExceptKeywords = true;
            decl = decl.replace('EXCEPT KEYWORDS', '');
        }

        // Ident
        const equalIndex = decl.indexOf('=');
        this.ident = decl.substring(0, equalIndex).trim();

        // Expression
        const expression = decl.substring(equalIndex + 1, decl.length - 1).trim();
        this.tokenExp.setExpression(expression);
    }

    toRegularExpression(charactersDecl: Array<CharacterSetDecl>): String {
        let regularExpression = '';
        regularExpression = this.tokenExp.toRegularExpression(charactersDecl).toString();
        this.regularExpression = regularExpression;

        return regularExpression;
    }
}