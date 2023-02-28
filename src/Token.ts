module Compiler {

    export class Token<T> {

        /**
         * @param type The token type. Each possible value uniquely identifies a specific type of token such as a "string" or "number" or "boolean"...etc, depending on how you set up the tokenizer.
         * @param value A string value containing the characters that make up this token. For example, identifiers can be any string but you might typically expect number tokens to only contain numbers.
         */
        public constructor(
            public readonly type: T,
            public readonly value: string
        ) {
        }

        public is(type: T, value: string) {
            return this.type === type && this.value === value;
        }

    }

}