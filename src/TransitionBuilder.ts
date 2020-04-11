module Compiler {

    export class TransitionBuilder {

        public data: Transition = new Transition();

        private state: StateBuilder = null;

        constructor(state: StateBuilder, type: CharacterClass, characters: string) {
            this.state = state;
            this.state.data.transitions.push(this.data);
            this.data.type = type;
            this.data.characters = characters;
        }

        public ignore(goBackwards: boolean = false): TransitionBuilder {
            this.data.include = false;
            this.data.reread = goBackwards;
            return this;
        }

        public then(state: StateBuilder): TransitionBuilder {
            this.data.nextState = state.data;
            return this;
        }

        public thenSameState(): TransitionBuilder {
            this.data.nextState = this.state.data;
            return this;
        }

        public thenNewState(): StateBuilder {
            var builder = new StateBuilder();
            this.data.nextState = builder.data;
            return builder;
        }

        public returns(type: number) {
            this.data.tokenType = type;
        }

        public error(errorMessage: string) {
            this.data.errorMessage = errorMessage;
        }

    }

}