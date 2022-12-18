module Compiler {

    export class TokenQueue {

        public tokens: Array<Token> = [];

        public position: number = 0;

        public reset() {
            this.position = 0;
        }

        public peek(expectedType: number = -1): Token {
            if (this.position >= this.tokens.length) {
                return null;
            }
            let token = this.tokens[this.position];
            if (expectedType !== -1 && token.type !== expectedType) {
                throw 'Unexpected token: \'' + token.value + '\'.';
            }
            return token;
        }

        public peekType(expectedType: number = -1): number {
            let token = this.peek(expectedType);
            return token === null ? -1 : token.type;
        }

        public peekValue(expectedType: number = -1): string {
            let token = this.peek(expectedType);
            return token === null ? null : token.value;
        }

        public next(expectedType: number = -1): Token {
            let token = this.peek(expectedType);
            this.position++;
            return token;
        }

        public nextType(expectedType: number = -1): number {
            let token = this.next(expectedType);
            return token === null ? -1 : token.type;
        }

        public nextValue(expectedType: number = -1): string {
            let token = this.next(expectedType);
            return token === null ? null : token.value;
        }

        public expect(expectedType: number, expectedValue: string = null, caseSensitive: boolean = true) {
            let token = this.next(expectedType);
            if (expectedValue !== null) {
                let valueMatches = caseSensitive
                    ? token.value === expectedValue
                    : token.value.toLowerCase() === expectedValue.toLowerCase()
                if (!valueMatches) {
                    throw 'Unexpected token value: ' + expectedValue;
                }
            }
        }

        public expectTypes(...expectedTypes: number[]) {
            let token = this.next();
            let tokenType = token?.type ?? -1;
            for (let expectedType of expectedTypes) {
                if (tokenType === expectedType) {
                    return;
                }
            }
            throw 'Unexpected token value: ' + token?.value ?? 'EOF';
        }

        public filter(f: (t: Token) => boolean): TokenQueue {
            var newQueue = new TokenQueue();
            for (var token of this.tokens) {
                if (!f(token)) {
                    newQueue.tokens.push(token);
                }
            }
            return newQueue;
        }

    }

}