module Compiler {

    export class StateBuilder<T> {

        public data: State<T> = new State<T>();

        public whenInputEnds(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.endOfInput, '');
        }

        public when(characters: string): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.custom, characters);
        }

        public whenLowerCaseLetter(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.lowerCaseLetter, '');
        }

        public whenUpperCaseLetter(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.upperCaseLetter, '');
        }

        public whenLetter(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.letter, '');
        }

        public whenNumber(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.number, '');
        }

        public whenLetterOrNumber(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.letterOrNumber, '');
        }

        public whenAnything(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.any, '');
        }

    }

}