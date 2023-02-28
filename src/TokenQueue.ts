module Compiler {

    export class TokenQueue<T> {

        public tokens: Token<T>[] = [];

        public position: number = 0;

        public reset() {
            this.position = 0;
        }

        public peek(expectedType: T = undefined): Token<T> {
            if (this.position >= this.tokens.length) {
                return null;
            }
            let token = this.tokens[this.position];
            if (expectedType !== undefined && token.type !== expectedType) {
                throw 'Unexpected token: \'' + token.value + '\'.';
            }
            return token;
        }

        public peekType(expectedType: T = undefined): T {
            let token = this.peek(expectedType);
            return token === null ? undefined : token.type;
        }

        public peekValue(expectedType: T = undefined): string {
            let token = this.peek(expectedType);
            return token === null ? null : token.value;
        }

        public peekIs(checkType: T, checkValue: string, caseSensitive: boolean = true): boolean {
            let token = this.peek();
            if (token === null) {
                return false;
            }
            return token.type === checkType && (caseSensitive ? token.value === checkValue : token.value.toLowerCase() === checkValue.toLowerCase());
        }

        public next(expectedType: T = undefined): Token<T> {
            let token = this.peek(expectedType);
            this.position++;
            return token;
        }

        public nextType(expectedType: T = undefined): T {
            let token = this.next(expectedType);
            return token === null ? undefined : token.type;
        }

        public nextValue(expectedType: T = undefined): string {
            let token = this.next(expectedType);
            return token === null ? null : token.value;
        }

        public nextIs(checkType: T, checkValue: string, caseSensitive: boolean = true): boolean {
            if (this.peekIs(checkType, checkValue, caseSensitive)) {
                this.next();
                return true;
            }
            return false;
        }

        public expect(expectedType: T, expectedValue: string = null, caseSensitive: boolean = true) {
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

        public expectTypes(...expectedTypes: T[]) {
            let token = this.next();
            let tokenType = token?.type ?? undefined;
            for (let expectedType of expectedTypes) {
                if (tokenType === expectedType) {
                    return;
                }
            }
            throw 'Unexpected token value: ' + token?.value ?? 'EOF';
        }

        public filter(f: (t: Token<T>) => boolean): TokenQueue<T> {
            let newQueue = new TokenQueue<T>();
            for (let token of this.tokens) {
                if (!f(token)) {
                    newQueue.tokens.push(token);
                }
            }
            return newQueue;
        }

    }

}