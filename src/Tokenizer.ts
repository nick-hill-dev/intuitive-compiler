module Compiler {

    export abstract class Tokenizer {

        private startState: State = null;

        constructor() {
            let builder = new StateBuilder();
            this.register(builder);
            this.startState = builder.data;
        }

        protected abstract register(start: StateBuilder);

        public tokenize(text: string): TokenQueue {

            // Initialize a DFA parser
            let result = new TokenQueue();
            let state = this.startState;
            let position = 0;
            let nextValue = '';
            let endOfInput = text.length == 0;
            while (position <= text.length) {
                let character = endOfInput ? '' : text[position];

                // Exit if we're in the start state and we've reached the end of the input
                if (state == this.startState && endOfInput) {
                    break;
                }

                // Find out which transition to use
                let transitionToUse = <Transition>null;
                for (let transition of state.transitions) {
                    if (transition.handles(character)) {
                        transitionToUse = transition;
                        break;
                    }
                }

                // Did we find a suitable transition?
                if (transitionToUse == null) {
                    throw 'No suitable transition found for character: \'' + character + '\'.';
                }

                // Should we error?
                if (transitionToUse.errorMessage != '') {
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
                if (transitionToUse.tokenType != -1) {
                    let token = new Token(transitionToUse.tokenType, nextValue);
                    result.tokens.push(token);
                    state = this.startState;
                    nextValue = '';
                } else {

                    // Move on to the next state
                    state = transitionToUse.nextState;
                    if (state == null) {
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