module Compiler {

    export class StateBuilder {

        public data: State = new State();

        public whenInputEnds(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.endOfInput, '');
        }

        public when(characters: string): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.custom, characters);
        }

        public whenLowerCaseLetter(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.lowerCaseLetter, '');
        }

        public whenUpperCaseLetter(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.upperCaseLetter, '');
        }

        public whenLetter(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.letter, '');
        }

        public whenNumber(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.number, '');
        }

        public whenLetterOrNumber(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.letterOrNumber, '');
        }

        public whenAnything(): TransitionBuilder {
            return new TransitionBuilder(this, CharacterClass.any, '');
        }

    }

}