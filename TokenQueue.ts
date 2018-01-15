module Compiler {

    export class TokenQueue {

        public tokens: Array<Token> = [];

        public position: number = 0;

        public reset() {
            this.position = 0;
        }

        public peek(): Token {
            if (this.position >= this.tokens.length) {
                return null;
            }
            return this.tokens[this.position];
        }

        public peekType(): number {
            var token = this.peek();
            return token == null ? -1 : token.type;
        }

        public peekValue(): string {
            var token = this.peek();
            return token == null ? null : token.value;
        }

        public next(expectedType: number = -1): Token {
            if (this.position >= this.tokens.length) {
                return null;
            }
            var token = this.tokens[this.position];
            if (expectedType != -1 && token.type != expectedType) {
                throw 'Unexpected token: \'' + token.value + '\'.';
            }
            this.position++;
            return token;
        }

        public nextType(expectedType: number = -1): number {
            var token = this.next(expectedType);
            return token == null ? -1 : token.type;
        }

        public nextValue(expectedType: number = -1): string {
            var token = this.next(expectedType);
            return token == null ? null : token.value;
        }

        public expect(expectedType: number, expectedValue: string = null) {
            var token = this.next(expectedType);
            if (expectedValue != null && token.value != expectedValue) {
                throw 'Unexpected token value: ' + expectedValue;
            }
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