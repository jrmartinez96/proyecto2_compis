export class Production {
    leftSide: LeftSide = new LeftSide();
    expression: Expression = new Expression();

    setProduction(productionString: String) {
        let leftSideString = '';
        let expressionString = '';

        let isLeftSideChacking = true;
        for (let i = 0; i < productionString.length; i++) {
            const character = productionString[i];
            if (character === '=' && isLeftSideChacking === true) {
                isLeftSideChacking = false;
            } else if (isLeftSideChacking) {
                leftSideString =leftSideString.concat(character.toString());
            } else {
                expressionString = expressionString.concat(character.toString());
            }
        }

        this.leftSide.setLeftSide(leftSideString);
        this.expression.setExpression(expressionString);
    }

}

class LeftSide {
    ident: Ident = new Ident();
    formalAtributes: Array<FormalAtribute> = [];

    setLeftSide(leftSideString: String) {
        let identName: String = '';
        let formalAtributesString = '';
        if (leftSideString[leftSideString.length - 1] === '>') {
            formalAtributesString = leftSideString.substring(leftSideString.indexOf('<') + 1, leftSideString.length - 1);
            identName = leftSideString.substring(0, leftSideString.indexOf('<'));
        } else {
            identName = leftSideString;
        }

        this.ident.name = identName;
        this.formalAtributes = this.setFormalAtributes(formalAtributesString);
    }

    setFormalAtributes(formalAtributesString: String): Array<FormalAtribute> {
        let formalAtributesStrings: Array<String> = [];
        
        if (formalAtributesString.indexOf(',') === -1 && formalAtributesString !== '') {
            formalAtributesStrings.push(formalAtributesString);
        } else {
            while (formalAtributesString.indexOf(',') !== -1) {
                let tempFormalAtribute = formalAtributesString.substring(0, formalAtributesString.indexOf(','));
                formalAtributesStrings.push(tempFormalAtribute);
                formalAtributesString = formalAtributesString.substring(formalAtributesString.indexOf(',') + 1);
            }
        }
        
        let formalAtributes: Array<FormalAtribute> = [];
        formalAtributesStrings.forEach(formalAtribute => {
            const tempFormalAtribute = new FormalAtribute();
            if (formalAtribute.includes('ref') || formalAtribute.includes('out')) {
                tempFormalAtribute.isOut = true;
                formalAtribute = formalAtribute.substr(3);
            }

            tempFormalAtribute.parameter = formalAtribute.trim();
            formalAtributes.push(tempFormalAtribute);
        });
        return formalAtributes;
    }
}

class Ident {
    name: String = '';
}

class FormalAtribute {
    parameter: String = '';
    isOut: boolean = false;
}

class Expression {
    terms: Array<Term> = [];

    setExpression(expressionString: String) {
        let currentTermString = '';
        let openParethesis = 0;
        let openBracket = 0;
        let openCurlyBracket = 0;

        for (let i = 0; i < expressionString.length; i++) {
            const character = expressionString[i];
            
            if (character === '|' && openParethesis === 0 && openBracket === 0 && openCurlyBracket === 0) {
                const tempTerm = new Term();
                tempTerm.setTerm(currentTermString);

                this.terms.push(tempTerm);
                currentTermString = '';
            } else {
                currentTermString = currentTermString.concat(character.toString());
            }
            
            if (character === '(') openParethesis = openParethesis + 1;
            else if (character === ')') openParethesis = openParethesis - 1;
            else if (character === '[') openBracket = openBracket + 1;
            else if (character === ']') openBracket = openBracket - 1;
            else if (character === '{') openCurlyBracket = openCurlyBracket + 1;
            else if (character === '}') openCurlyBracket = openCurlyBracket - 1;

            if (i === expressionString.length - 1) {
                const tempTerm = new Term();
                tempTerm.setTerm(currentTermString);

                this.terms.push(tempTerm);
            }
        }
    }

}

class Term {
    factors: Array<Factor> = [];

    setTerm(termString: String) {
        while (termString !== '') {
            if (termString[0] === "(") {
                if (termString[1] === ".") {
                    let semActionString = termString.substring(2, termString.indexOf(".)"));
                    let tempSemAction = new SemAction(semActionString);
                    let tempFactor = new Factor(tempSemAction, '');
                    this.factors.push(tempFactor);

                    termString = termString.substring(termString.indexOf(".)") + 2);
                } else {
                    let openParethesis = 0;
                    let expressionString = '';

                    for (let i = 0; i < termString.length; i++) {
                        const character = termString[i];
                        if (character === "(") openParethesis++;
                        else if (character === ")") openParethesis--;

                        expressionString = expressionString.concat(character.toString());

                        if (openParethesis === 0) {
                            termString = termString.substring(i + 1);
                            i = termString.length;

                            expressionString = expressionString.substring(1, expressionString.length - 1);
                            const tempExpression = new Expression();
                            tempExpression.setExpression(expressionString);

                            const tempFactor = new Factor(tempExpression, '(');
                            this.factors.push(tempFactor);
                        }
                    }
                }
            } else if (termString[0] === "[") {
                let openBracket = 0;
                let expressionString = '';

                for (let i = 0; i < termString.length; i++) {
                    const character = termString[i];
                    if (character === "[") openBracket++;
                    else if (character === "]") openBracket--;

                    expressionString = expressionString.concat(character.toString());

                    if (openBracket === 0) {
                        termString = termString.substring(i + 1);
                        i = termString.length;

                        expressionString = expressionString.substring(1, expressionString.length - 1);
                        const tempExpression = new Expression();
                        tempExpression.setExpression(expressionString);

                        const tempFactor = new Factor(tempExpression, '[');
                        this.factors.push(tempFactor);
                    }
                }
            } else if (termString[0] === "{") {
                let openCurlyBracket = 0;
                let expressionString = '';

                for (let i = 0; i < termString.length; i++) {
                    const character = termString[i];
                    if (character === "{") openCurlyBracket++;
                    else if (character === "}") openCurlyBracket--;

                    expressionString = expressionString.concat(character.toString());

                    if (openCurlyBracket === 0) {
                        termString = termString.substring(i + 1);
                        i = termString.length;

                        expressionString = expressionString.substring(1, expressionString.length - 1);
                        const tempExpression = new Expression();
                        tempExpression.setExpression(expressionString);

                        const tempFactor = new Factor(tempExpression, '{');
                        this.factors.push(tempFactor);
                    }
                }
            } else if (termString[0] === '"') {
                let openQuotes = 0;
                let stringString = '';

                for (let i = 0; i < termString.length; i++) {
                    const character = termString[i];
                    if (character === '"') {
                        if (openQuotes === 0) openQuotes++;
                        else openQuotes--;
                    }

                    stringString = stringString.concat(character.toString());

                    if (openQuotes === 0) {
                        termString = termString.substring(i + 1);
                        i = termString.length;

                        stringString = stringString.substring(1, stringString.length - 1);
                        const tempSymbol = new Symbol(stringString, []);

                        const tempFactor = new Factor(tempSymbol, '');
                        this.factors.push(tempFactor);
                    }
                }
            } else {
                if (termString[0] === termString[0].toUpperCase()) {
                    if (termString.indexOf(">") !== -1) {
                        let leftSideString = termString.substring(0, termString.indexOf(">") + 1)
                        const tempLeftSide = new LeftSide();
                        tempLeftSide.setLeftSide(leftSideString);
    
                        const tempSymbol = new Symbol(tempLeftSide.ident, tempLeftSide.formalAtributes);
                        const tempFactor = new Factor(tempSymbol, '');
                        this.factors.push(tempFactor);
    
                        termString = termString.substring(termString.indexOf(">") + 1);
                    } else {
                        let leftSideString = termString.substring(0, termString.indexOf(" ") + 1)
                        const tempLeftSide = new LeftSide();
                        tempLeftSide.setLeftSide(leftSideString);
    
                        const tempSymbol = new Symbol(tempLeftSide.ident, tempLeftSide.formalAtributes);
                        const tempFactor = new Factor(tempSymbol, '');
                        this.factors.push(tempFactor);
    
                        termString = termString.substring(termString.indexOf(" ") + 1);
                    }
                } else {
                    const tempSymbol = new Symbol(termString, []);
                    const tempFactor = new Factor(tempSymbol, '');
                    this.factors.push(tempFactor);
                    termString = '';
                }
            }
        }
    }
}

class Factor {
    factor: Symbol|Expression|SemAction;
    encloseType: String; // ( or [ or {

    constructor(factor: Symbol|Expression|SemAction, encloseType: String) {
        this.factor = factor;
        this.encloseType = encloseType;
    }
}

class Symbol {
    symbol: Ident|String;
    atributes: Array<FormalAtribute>;

    constructor(symbol: Ident|String, atributes: Array<FormalAtribute>) {
        this.symbol = symbol;
        this.atributes = atributes;
    }
}

class SemAction {

    semAction: String;

    constructor(semAction: String) {
        this.semAction = semAction;
    }

}