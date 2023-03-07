# Intuitive Compiler Library

The Intuitive Compiler TypeScript library is a compact string tokenizer that makes it easy to define your own custom LR(1) programming language!

State machines can be built using simple code that is easy to read and write, yet powerful enough to convert a string of that language into tokens for further processing.

Running `tsc -b` at the root will generate a `intuitiveCompiler.js` file in the `bin` subdirectory. Examples are in the `demos` directory.

## State Machine Definition for Tokenization

Implement the `Tokenizer<T>` class with a list of state transition rules so that strings can be parsed and converted into tokens.

```typescript
class MyTokenizer extends Compiler.Tokenizer<string> {
    
    public register(start: StateBuilder<string>) {
        // TODO: Implement states and transitions
    }

}
```

For example:

```typescript
class RegistrationNumberTokenizer extends Compiler.Tokenizer<string> {
    
    /**
     * Parses strings in the format Cn-n where "C" and "-" is mandatory and "n" is one or more numbers.
     */
    public register(start: StateBuilder<string>) {

        let inCodeFirstPart = start.when('C').thenNewState();
        start.whenAnything().error('Registration number must start with "C".');
            
        inCodeFirstPart.whenNumber().thenSameState();
        let inCodeLastPart = inCodeFirstPart.when('-').thenNewState();
        start.whenAnything().error('Registration number must start with "C" character and have some numbers after it, before a dash.');
       
        inCodeLastPart.whenNumber().thenSameState();
        inCodeLastPart.whenAnything().returns('reg');

    }

}
```

In this trivial example we can parse a string and convert it into a single token via the tokenizer:

```typescript
let tokenizer = new RegistrationNumberTokenizer();
let result = tokenizer.tokenize('C123-99');
alert(JSON.stringify(result.tokens)); // [ { "type": "reg", "value": "C123-99" } ]
```

## Features

- Define your own programming languages and convert strings into lists of tokens.
- Generic token type allowing your tokens to be of any type such as string, number, enum...etc.
- Fluent interface for building states and transitions, manifesting as a DFA state machine tokenizer.
- Handle errors with unexpected input or unexpected end of input.
- Tiny library with minimal footprint.
- Fully documented with JSDoc, integrated with IntelliSense in Visual Studio Code.

## Character Based Transitions

The `whenX` condition can be used to transition into some other state via `thenX` (I.E. `thenNewState` for this example). It is possible to transition based on different classes of characters such as letters, numbers or custom sets of characters:

```js
let inNumberOrFloat = start.whenNumber().thenNewState();
let inLetters = start.whenLetter().thenNewState();
let inLettersNumbers = start.whenLetterOrNumber().thenNewState();
let inLowerCaseWord = start.whenLowerCaseLetter().thenNewState();
let inUpperCaseWord = start.whenUpperCaseLetter().thenNewState();
let inVowels = start.when('aeiou').thenNewState();
```

Order matters, and therefore earlier transitions are always considered before later transitions.

## Transitioning Into New states

The state machine always starts from the `start` state provided in the `register` method that you are implementing.

In any transition description, use `thenNewState` to transition into a new state, `thenSameState` to remain in the same state or `then(state)` to transition into a specific state (that was previously created elsewhere via `thenNewState`).

```js
// Example 1: While we continue to encounter numbers, remain in the same state
inNumber.whenNumber().thenSameState();

// Example 2: We've encountered an escape character (\) in a string, so permit a quote without ending the string
// let inString = <...>.thenNewState();
// let inStringEscaped = <...>.thenNewState();
inStringEscaped.when('"').then(inString);
```

## Returning Tokens

When we know what a token is, add the token to the list via `returns`. Note the use of `ignore(true)` to rewind so that the same character is reprocessed from the start state whenever a character does not form part of a token:

```js
let inLessThan = start.when('<').thenNewState();
inLessThan.when('=').returns('lessThanOrEquals');
inLessThan.whenAnything().ignore(true).returns('lessThan');
```

## Excluding Unrelated Characters

Following on from the above example, the `ignore()` fragment prevents the character being included in the token value, and the character is skipped past. However, `ignore(true)` not only prevents the character from being included in the token value, but also ensures it is re-read from the start state. This is a common scenario when a character does not form part of the current token but does form part of some subsequent token (I.E. a number appearing after a `<` or `<=` is not part of the term itself but forms part of a subsequent number token).

## Handling Unexpected Input

Throw errors when there is unexpected input:

```js
inStringEscaped.when('\\').then(inString);
inStringEscaped.when('"').then(inString);
inStringEscaped.whenAnything().error('Invalid escape sequence in a string.');
```

Handle situations when the input unexpectedly ends, such as will be the case when a string has been started but not completed before the input ends:

```js
let inString = start.when('"').ignore().thenNewState();
// ...
inString.whenInputEnds().error('Expected string to end with a quote character.');
```

## Example: String Parser

If you want to parse strings like `"this string"` and `"A string \" with escaped quotes"`:

```js
let inString = start.when('"').ignore().thenNewState(); // Prevents " character from being a part of the token value

inString.whenInputEnds().error('Expected string to end with a quote character.');
inString.when('"').ignore().returns('string'); // Prevents " character from being a part of the token value
let inStringEscaped = inString.when('\\').ignore().thenNewState();
inString.whenAnything().thenSameState();

inStringEscaped.when('"').then(inString); // Include " in the token value and return to the inString state
inStringEscaped.when('\\').then(inString); // Include \ in the token value and return to the inString state
inStringEscaped.whenAnything().error('Invalid escape sequence in a string.');
```

## Example: Range Parser

If you want to parse a token like 12:34 as a "range" type while still allowing standalone numbers like 12 or 34:

```js
let inNumber = start.whenNumber().thenNewState();
let inRange = start.when(':').thenNewState();

inNumber.whenNumber().thenSameState();
inNumber.when(':').then(inRange);
inNumber.whenAnything().ignore(true).returns('number');

inRange.whenNumber().thenSameState();
inRange.whenAnything().ignore(true).returns('range');
```

The above permits ranges like `12:34` as well as unbounded ranges like `12:`, `:34` and `:`.

### Custom Token Types

You can use a numeric type, an enum or any other type as the type which classifies a token:

```typescript
class MyTokenizer extends Compiler.Tokenizer<string> { }

class MyTokenizer extends Compiler.Tokenizer<number> { }

enum TokenType {
    int,
    text,
    leftBracket,
    rightBracket
}

class MyTokenizer extends Compiler.Tokenizer<TokenType> { }
```

## Parsing Syntax Trees

There are plans to implement syntax parsing. See [SyntaxTreeParsing.md](SyntaxTreeParsing.md) for more details about the proposal.

## Example 3: A BASIC-like Language

This language is a work in progress for a multiplayer game called TileX where writing BASIC-like code is a part of the game. It supports numbers, floats, strings, identifiers, ranges, expressions and comments:

```typescript
enum ScriptTokenType {
    number,
    identifier,
    rangeInt,
    rangeFloat,
    equals,
    lessThan,
    lessThanOrEquals,
    moreThan,
    moreThanOrEquals,
    plus,
    minus,
    multiply,
    divide,
    openBracket,
    closeBracket,
    comma,
    string,
    newLine,
    comment
}

class ScriptTokenizer extends Compiler.Tokenizer<ScriptTokenType> {

    protected register(start: Compiler.StateBuilder<ScriptTokenType>) {

        // Transitions from start state
        let inNumber = start.whenNumber().thenNewState();
        let inString = start.when('"').ignore().thenNewState();
        let inIdentifier = start.whenLetter().thenNewState();
        start.when('(').returns(ScriptTokenType.openBracket);
        start.when(')').returns(ScriptTokenType.closeBracket);
        start.when(',').returns(ScriptTokenType.comma);
        start.when('=').returns(ScriptTokenType.equals);
        let inLessThan = start.when('<').thenNewState();
        let inMoreThan = start.when('>').thenNewState();
        let inPossibleNegativeNumber = start.when('-').thenNewState();
        start.when('*').returns(ScriptTokenType.multiply);
        let inPossibleComment = start.when('/').thenNewState();
        start.when('+').returns(ScriptTokenType.plus);
        start.when('\n').returns(ScriptTokenType.newLine);
        start.when(' \r\t').ignore().thenSameState();

        // Transitions from inPossibleNegativeNumber state
        inPossibleNegativeNumber.whenNumber().then(inNumber);
        inPossibleNegativeNumber.whenAnything().ignore(true).returns(ScriptTokenType.minus);

        // Transitions from inNumber state
        inNumber.whenNumber().thenSameState();
        let inRangeInt = inNumber.when(':').thenNewState();
        let inFloat = inNumber.when('.').thenNewState();
        inNumber.whenAnything().ignore(true).returns(ScriptTokenType.number);

        // Transitions from inFloat state
        inFloat.whenNumber().thenSameState();
        inFloat.when('-').thenSameState();
        let inRangeFloat = inFloat.when(':').thenNewState();
        inFloat.whenAnything().ignore(true).returns(ScriptTokenType.number);

        // Transitions from inRangeInt state
        inRangeInt.whenNumber().thenSameState();
        inRangeInt.when('-').thenSameState();
        inRangeInt.when('.').then(inRangeFloat);
        inRangeInt.whenAnything().ignore(true).returns(ScriptTokenType.rangeInt);

        // Transitions from inRangeFloat state
        inRangeFloat.whenNumber().thenSameState();
        inRangeFloat.when('-').thenSameState();
        inRangeFloat.when('.').thenSameState();
        inRangeFloat.whenAnything().ignore(true).returns(ScriptTokenType.rangeFloat);

        // Transitions from inString state
        inString.whenInputEnds().error('Expected string to end with a quote character.');
        inString.when('"').ignore().returns(ScriptTokenType.string);
        let inStringEscaped = inString.when('\\').ignore().thenNewState();
        inString.whenAnything().thenSameState();

        // Transitions from inStringEscaped
        inStringEscaped.when('"').then(inString);
        inStringEscaped.when('\\').then(inString);
        inStringEscaped.whenAnything().error('Invalid escape sequence in a string.');

        // Transitions from inIdentifier state
        inIdentifier.whenLetterOrNumber().thenSameState();
        inIdentifier.when('.-').thenSameState();
        inIdentifier.whenAnything().ignore(true).returns(ScriptTokenType.identifier);

        // Transitions from inLessThan state
        inLessThan.when('=').returns(ScriptTokenType.lessThanOrEquals);
        inLessThan.whenAnything().ignore(true).returns(ScriptTokenType.lessThan);

        // Transitions from inMoreThan state
        inMoreThan.when('=').returns(ScriptTokenType.moreThanOrEquals);
        inMoreThan.whenAnything().ignore(true).returns(ScriptTokenType.moreThan);

        // Transitions from inPossibleComment state
        let inComment = inPossibleComment.when('/').thenNewState();
        inPossibleComment.whenAnything().ignore(true).returns(ScriptTokenType.divide);

        // Transitions from inComment state
        inComment.when('\r').ignore();
        inComment.when('\n').ignore().returns(ScriptTokenType.comment);
        inComment.whenAnything().thenSameState();
    }

}
```

The above class can parse code like the following:

```vb
spawn "destroyedBlock", 1, 0:1, 0, 0, 500:1250, 0, 0.25:0.5, -5:5, -10:-3
spawn "destroyedBlock", 1, 0:1, 24, 0, 500:1250, 0, 0.25:0.5, -5:5, -10:-3
spawn "destroyedBlock", 1, 0:1, 0, 24, 500:1250, 0, 0.25:0.5, -5:5, -10:-3
spawn "destroyedBlock", 1, 0:1, 24, 24, 500:1250, 0, 0.25:0.5, -5:5, -10:-3
if speedY > 0 then begin
    speed "vertical", -500
    speed "horizontal", 0
end
if speedX < 0 then speed "horizontal", 0
sound "tileSmash"
```

## License

The Intuitive Compiler library was written by Nick Hill and is released under the MIT license. See LICENSE for more information.