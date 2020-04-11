module Compiler {

    export class Token {

        public type: number = -1;

        public value: string = '';

        constructor(type: number, value: string) {
            this.type = type;
            this.value = value;
        }

        public is(type: number, value: string) {
            return this.type == type && this.value == value;
        }
        
    }

}