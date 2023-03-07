# Syntax Tree Parsing

Most syntax trees are created via [recursive descent parsing](https://en.wikipedia.org/wiki/Recursive_descent_parser), and it is possible to do this with custom code. See following example for how to parse a list of statements (I.E. `repeat`, `if`, `set` or commands of any other type) using native TypeScript:

```typescript
class SyntaxParser {

    private tokens: Compiler.TokenQueue<ScriptTokenType> = null;

    public parse(code: string): ScriptStatement[] {
        let tokenizer = new ScriptTokenizer(); // class ScriptTokenizer extends Compiler.Tokenizer<ScriptTokenType> { ... }
        this.tokens = tokenizer.tokenize(code);
        return this.parseCommands();
    }

    private parseCommands(): ScriptStatement[] {
        let result = [];
        while (this.tokens.position < this.tokens.tokens.length) {
            result.push(this.parseStatement());
        }
        return result;
    }

    private parseStatement(): ScriptStatement {
        let name = this.tokens.peekValue(ScriptTokenType.identifier).toLowerCase();
        if (name === 'repeat') {
            return this.parseRepeatStatement(); // Examine token queue according to how a repeat statement should look like
        } else if (name === 'if') {
            return this.parseIfStatement(); // Examine token queue according to how an if statement should look like
        } else if (name === 'set') {
            return this.parseSetStatement(); // Examine token queue according to how a set statement should look like
        } else {
            return this.parseCommandStatement(); // Examine token queue according to how a command statement should look like
        }
    }

    // ...etc
}
```

It is thought that this can also be done via another sort of fluent-interface state machine, specialised for syntax parsing.

At this stage it is only a thought but here is an outline of how it could look, should it be implemented.

Given this code, a function definition:

```vb
function testFunction(name: string, value: int) {
    command1();
    command2();
    command3();
}
```

The above can be parsed via this proposed syntax parsing definition:

```typescript
let parameter = definitions
    .register('parameter')
    .token(t => t.expect().type('idenfifier').storeValueIn('name'))
    .token(t => t.expect().type('colon'))
    .token(t => t.expect().type('identifier').storeValueIn('dataType'));
    
let parameters = definitions
    .register('parameterList')
    .token(t => t.while().type('identifier').rewind().parse(parameter).asList('parameters'));

let command = definitions
    .register('command')
    .token(t => t.expect().type('identifier').storeValueIn('name'))
    .token(t => t.expect().type('leftBracket'))
    .token(t => t.expect().type('rightBracket'))
    .token(t => t.expect().type('semiColon'));
    
let commands = definitions
    .register('commandList')
    .token(t => t.while().type('identifier').rewind().parse(command).asList('commands'));
    
let func = definitions
    .register('function')
    .token(t => t.expect().type('identifier').expectValue('function'))
    .token(t => t.expect().type('identifier').storeValueIn('name'))
    .token(t => t.expect().type('leftBracket'))
    .token(t => t.if().type('idenfier').parse(parameters).storeValueIn('parameters'))
    .token(t => t.expect().type('rightBracket'))
    .token(t => t.expect().type('leftCurly'))
    .token(t => t.if().type('identifier').parse(commands).storeValueIn('commands'))
    .token(t => t.expect().type('rightCurly'));
```

And the above definition would create a JSON object like this:

```json
[{
    "type": "function",
    "name": "testFunction",
    "parameters": {
        "type": "parameterList",
        "parameters": [
            {
                "type": "parameter",
                "name": "name",
                "dataType": "string"
            },
            {
                "type": "parameter",
                "name": "value",
                "dataType": "int"
            }
        ]
    },
    "commands": {
        "type": "commandList",
        "commands": [
            {
                "type": "command",
                "name": "command1"
            },
            {
                "type": "command",
                "name": "command2"
            },
            {
                "type": "command",
                "name": "command3"
            }
        ]
    }
}]
```

In order to enable this, some thought needs to go into whether this is the right approach and how it would work for all sort of edge cases.

Then it can be implemented into this library.