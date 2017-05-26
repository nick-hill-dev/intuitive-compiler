module Compiler {

    export class Transition {

        public type: CharacterClass = CharacterClass.any;

        public characters: string = '';

        public include: boolean = true;

        public reread: boolean = false;

        public nextState: State = null;

        public tokenType: number = -1;

        public errorMessage: string = '';

        public handles(character: string) {
            if (this.type == CharacterClass.any) {
                return true;
            }
            if (character == '') {
                return this.type == CharacterClass.endOfInput;
            }
            if (character >= 'a' && character <= 'z' && (this.type == CharacterClass.letterOrNumber || this.type == CharacterClass.letter || this.type == CharacterClass.lowerCaseLetter)) {
                return true;
            }
            if (character >= 'A' && character <= 'Z' && (this.type == CharacterClass.letterOrNumber || this.type == CharacterClass.letter || this.type == CharacterClass.upperCaseLetter)) {
                return true;
            }
            if (character >= '0' && character <= '9' && (this.type == CharacterClass.letterOrNumber || this.type == CharacterClass.number)) {
                return true;
            }
            if (this.type == CharacterClass.custom && this.characters.indexOf(character) != -1) {
                return true;
            }
            return false;
        }

    }

}