module Compiler {

    export class TransitionBuilder<T> {

        public data: Transition<T> = new Transition<T>();

        public constructor(private readonly state: StateBuilder<T>, type: CharacterClass, characters: string) {
            this.state.data.transitions.push(this.data);
            this.data.type = type;
            this.data.characters = characters;
        }

        /**
         * Indicates that this particular character should not be added to the value of the current token. I.E. that it should be ignored.
         * It is also possible to rewind the input one character at this stage.
         * @param goBackwards
         * Indicates whether to reverse the parsing of the input by a single character so that it can be re-read.
         * For example, because a letter is not part of a number token you will want to have the letter re-read so that it can become part of some other token.
         */
        public ignore(goBackwards: boolean = false): TransitionBuilder<T> {
            this.data.include = false;
            this.data.reread = goBackwards;
            return this;
        }

        /**
         * Indicates that whenever this situation is encountered, there should be a transition into some other state.
         * This assumes you have got one handy. You can use methods like `thenNewState()` to create state objects that you can use.
         * @param state The state to transition to whenever this situation is encountered.
         */
        public then(state: StateBuilder<T>): TransitionBuilder<T> {
            this.data.nextState = state.data;
            return this;
        }

        /**
         * Indicates that whenever this situation is encountered, there should not be any transition to another state and we should stay in the same state.
         */
        public thenSameState(): TransitionBuilder<T> {
            this.data.nextState = this.state.data;
            return this;
        }

        /**
         * Indicates that whenever this situation is encountered, there should be a transition into a new state.
         * The result from this call should be captured in a variable because it represents a new state that you can base more rules on.
         * For example: `let inNumberState = start.whenNumber().thenNewState();`.
         */
        public thenNewState(): StateBuilder<T> {
            let builder = new StateBuilder<T>();
            this.data.nextState = builder.data;
            return builder;
        }

        /**
         * Specifies that this situation results in a completed token of a particular type, and that the token should be added to the list of parsed tokens.
         * @param type The type of token represented by this situation.
         */
        public returns(type: T): void {
            this.data.tokenType = type;
        }

        /**
         * Indicates that whenever this situation is encountered, an error should be thrown.
         * Sometimes some characters can and should break the tokenisation.
         * For example, you might want to support integers but not floating point numbers.
         * @param errorMessage The error message which will be reported if this situation occurs.
         */
        public error(errorMessage: string) {
            this.data.errorMessage = errorMessage;
        }

    }

}