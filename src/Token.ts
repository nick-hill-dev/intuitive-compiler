module Compiler {

    export class Token<T> {

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