module Compiler {

    export class StateBuilder<T> {

        public data: State<T> = new State<T>();

        /**
         * Describes a rule that will be applied to a situation where the end of the character stream has been reached.
         */
        public whenInputEnds(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.endOfInput, '');
        }

        /**
         * Describes a rule that will be applied to a situation where the current character is any character from this list.
         * @param characters The list of characters this rule applies to.
         */
        public when(characters: string): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.custom, characters);
        }

        /**
         * Describes a rule that will be applied to a situation where the current character is a lower case letter.
         */
        public whenLowerCaseLetter(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.lowerCaseLetter, '');
        }

        /**
         * Describes a rule that will be applied to a situation where the current character is an upper case letter.
         */
        public whenUpperCaseLetter(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.upperCaseLetter, '');
        }

        /**
         * Describes a rule that will be applied to a situation where the current character is a letter (lower case or upper case).
         */
        public whenLetter(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.letter, '');
        }

        /**
         * Describes a rule that will be applied to a situation where the current character is a number (0 - 9).
         */
        public whenNumber(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.number, '');
        }

        /**
         * Describes a rule that will be applied to a situation where the current character is a number or a letter (lower case or upper case).
         */
        public whenLetterOrNumber(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.letterOrNumber, '');
        }

        /**
         * Describes a rule that will be applied to a situation where anything is encountered.
         * This is often the case for a 'catch-all' situation after all other cases have been defined.
         */
        public whenAnything(): TransitionBuilder<T> {
            return new TransitionBuilder(this, CharacterClass.any, '');
        }

    }

}