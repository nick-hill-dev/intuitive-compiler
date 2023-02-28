module Compiler {

    export class Token {

        public constructor(
            public readonly type: number,
            public readonly value: string
        ) {
        }

        public is(type: number, value: string) {
            return this.type === type && this.value === value;
        }

    }

}