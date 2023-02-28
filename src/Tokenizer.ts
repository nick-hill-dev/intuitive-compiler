module Compiler {

    /**
     * Create a class that extends this one to create your own custom code tokenizer. The generic argument `T` is your token type
     * (I.E. a string, a number, an enum or whatever you want it to be) which uniquely identifies each type of token.
     */
    export abstract class Tokenizer<T> {

        private startState: State<T> = null;

        public constructor() {
            let builder = new StateBuilder<T>();
            this.register(builder);
            this.startState = builder.data;
        }

        /**
         * Implement this method to build your tokenizer using a fluent interface.
         * Example: `let inNumber = start.whenNumber().thenNewState();` allows transitions from the initial state to the `inNumber` state when a number is encountered.
         * Then, `inNumber.whenNumber().thenSameState();` causes the state to remain the same as numbers continue to be encountered.
         * Then, `inNumber.whenAnything().ignore(true).returns('number');` completes a number of type 'token', rewinding back one character so that a new token can be read (since that character is not part of the number).
         * See the documentation, examples and demos for inspiration.
         * @param start The start state, a clean slate for each token.
         */
        protected abstract register(start: StateBuilder<T>): void;

        /**
         * Converts text into tokens as per the state machine defined in `register()`.
         * @param text The code to tokenize.
         * @returns A `TokenQueue`, which is a list of tokens representing the input code `text`.
         */
        public tokenize(text: string): TokenQueue<T> {

            // Initialize a DFA parser
            let result = new TokenQueue<T>();
            let state = this.startState;
            let position = 0;
            let nextValue = '';
            let endOfInput = text.length === 0;
            while (position <= text.length) {
                let character = endOfInput ? '' : text[position];

                // Exit if we're in the start state and we've reached the end of the input
                if (state === this.startState && endOfInput) {
                    break;
                }

                // Find out which transition to use
                let transitionToUse = <Transition<T>>null;
                for (let transition of state.transitions) {
                    if (transition.handles(character)) {
                        transitionToUse = transition;
                        break;
                    }
                }

                // Did we find a suitable transition?
                if (transitionToUse === null) {
                    throw 'No suitable transition found for character: \'' + character + '\'.';
                }

                // Should we error?
                if (transitionToUse.errorMessage !== '') {
                    throw transitionToUse.errorMessage;
                }

                // Advance position
                if (!transitionToUse.reread) {
                    position++;
                }

                // Add to token value
                if (transitionToUse.include) {
                    nextValue += character;
                }

                // Does this result in a token?
                if (transitionToUse.tokenType !== undefined) {
                    let token = new Token<T>(transitionToUse.tokenType, nextValue);
                    result.tokens.push(token);
                    state = this.startState;
                    nextValue = '';
                } else {

                    // Move on to the next state
                    state = transitionToUse.nextState;
                    if (state === null) {
                        throw 'Transition does not lead to a next state.';
                    }
                }

                // Are we now at the end?
                endOfInput = position >= text.length;
            }
            return result;
        }

    }

}