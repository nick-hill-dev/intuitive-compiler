module Compiler {

    export class TransitionBuilder<T> {

        public data: Transition<T> = new Transition<T>();

        public constructor(private readonly state: StateBuilder<T>, type: CharacterClass, characters: string) {
            this.state.data.transitions.push(this.data);
            this.data.type = type;
            this.data.characters = characters;
        }

        public ignore(goBackwards: boolean = false): TransitionBuilder<T> {
            this.data.include = false;
            this.data.reread = goBackwards;
            return this;
        }

        public then(state: StateBuilder<T>): TransitionBuilder<T> {
            this.data.nextState = state.data;
            return this;
        }

        public thenSameState(): TransitionBuilder<T> {
            this.data.nextState = this.state.data;
            return this;
        }

        public thenNewState(): StateBuilder<T> {
            let builder = new StateBuilder<T>();
            this.data.nextState = builder.data;
            return builder;
        }

        public returns(type: T) {
            this.data.tokenType = type;
        }

        public error(errorMessage: string) {
            this.data.errorMessage = errorMessage;
        }

    }

}