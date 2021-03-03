/**
 * lexer.ts
 * Author: Alex Badia
 *
 * This is the Lexing stage of compilation.
 */
//  TODO: TEST each regular expression
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class Lexer {
        constructor(
        // /* */ for block comment.
        _tStartBlockComment = new RegExp('/\\*$'), _tEndBlockComment = new RegExp('\\*/$'), 
        /**
         * Output Arrays
         *
         * Arrays store errors and warnings in string format.
         * The entire contents of the array a printed at the end of compilation.
         */
        tokenStream = [], tempToken = null, 
        /**
         * Program characters' location
         *
         * Implemented as zero based, but reported to user as 1 based.
         */
        lineNumber = 0, linePosition = 0, 
        // Detects if current position is in a string
        isInString = false, startStringExpressionLine = 0, startStringExpressionPosition = 0, 
        // Detects if current position is in a string
        isInComment = false) {
            this._tStartBlockComment = _tStartBlockComment;
            this._tEndBlockComment = _tEndBlockComment;
            this.tokenStream = tokenStream;
            this.tempToken = tempToken;
            this.lineNumber = lineNumber;
            this.linePosition = linePosition;
            this.isInString = isInString;
            this.startStringExpressionLine = startStringExpressionLine;
            this.startStringExpressionPosition = startStringExpressionPosition;
            this.isInComment = isInComment;
        }
        /**
         * Scans source code and generates tokens.
         *
        * @param {string} sourceCode formatted source code from CodeMirror input field.
         */
        main(sourceCode) {
            /**
             * Pool of predefined tokens and their definitions
             *
             * Rule Order:
             *  1. Keyword
             *  2. ID
             *  3. Symbol, Digit, Character
             */
            // Generate the token pool
            var tokenPool = [
                /**
                 * 1. Keywords
                 *
                 * Consist of commands and types.
                 */
                // Commands
                new NightingaleCompiler.LexicalToken("KEYWORD_PRINT", new RegExp('print'), null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_WHILE", new RegExp('while'), null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_IF", new RegExp('if'), null, -1, -1),
                // Types
                new NightingaleCompiler.LexicalToken("KEYWORD_INT", new RegExp('int'), null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_STRING", new RegExp('string'), null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_BOOLEAN", new RegExp('boolean'), null, -1, -1),
                // Boolean keywords
                new NightingaleCompiler.LexicalToken("KEYWORD_TRUE", new RegExp('true'), null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_FALSE", RegExp('false'), null, -1, -1),
                /**
                 * 2. Identifiers
                 *
                 * Can be character of id depending if inside a string or not.
                 */
                new NightingaleCompiler.LexicalToken("IDENTIFIER", new RegExp('[a-z]'), null, -1, -1),
                /**
                 * 3. Symbols
                 */
                // Quotation
                new NightingaleCompiler.LexicalToken("STRING_EXPRESSION_BOUNDARY", new RegExp('"'), null, -1, -1),
                // Open/Close blocks
                new NightingaleCompiler.LexicalToken("SYMBOL_OPEN_BLOCK", /^[\{]$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_CLOSE_BLOCK", /^[\}]$/, null, -1, -1),
                // Open/Close arguments
                new NightingaleCompiler.LexicalToken("SYMBOL_OPEN_ARGUMENT", new RegExp('\\('), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_CLOSE_ARGUMENT", new RegExp('\\)'), null, -1, -1),
                // Operands
                new NightingaleCompiler.LexicalToken("SYMBOL_INT_OP", new RegExp('\\+'), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_BOOL_OP_EQUALS", new RegExp('=='), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_BOOL_OP_NOT_EQUALS", new RegExp('!='), null, -1, -1),
                // Assignments
                new NightingaleCompiler.LexicalToken("SYMBOL_ASSIGNMENT_OP", new RegExp('\='), null, -1, -1),
                // Digits
                new NightingaleCompiler.LexicalToken("DIGIT", new RegExp('[0-9]'), null, -1, -1),
                // Whitespace
                new NightingaleCompiler.LexicalToken("SPACE_SINGLE", new RegExp(" "), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SPACE_TAB", new RegExp("\t"), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SPACE_END_OF_LINE", new RegExp("\n"), null, -1, -1),
                // End of Program
                new NightingaleCompiler.LexicalToken("END_OF_PROGRAM", /^[\$]$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("CHARACTER", new RegExp('[a-z]'), null, -1, -1),
            ];
            let lastPosition = 0;
            let currentPosition = 0;
            LoopThroughSourceCodeWhileLoop: while (lastPosition < sourceCode.length) {
                // In comment
                if (this.isInComment) { } // if
                // In string
                else if (this.isInString) { } // else-if
                // Not in comment nor in a string
                else {
                    // Don't forget that the end part in substring is not inclusive!
                    let currentChunk = sourceCode.substring(lastPosition, currentPosition);
                    let matchFound = false;
                    // Symbols, like whitespace (if present and outside of quotes)
                    // mean that we can stop moving ahead and see what we’ve got so far.
                    if (/=$|\{$|\}$|\($|\)$|\!$|\"$|\+$|\/\*$|\\*\/$|\s$/.test(currentChunk) && currentChunk.length > 1) {
                        // Move starting position up by one
                        lastPosition++;
                        currentPosition = lastPosition;
                        continue;
                    } // if
                    // Test current sub string of source code against tokens in the token pool
                    CheckingTokensLoop: for (let indexOfToken = 0; indexOfToken < tokenPool.length; ++indexOfToken) {
                        let currentToken = tokenPool[indexOfToken];
                        // Test against specific token
                        if (currentToken.definition.test(currentChunk)) {
                            matchFound = true;
                            /**
                             * Special cases:
                             *  - Quote is found
                             *  - Keywords: true | false | while | if | print | int | boolean | string
                             *  - Symbols: boolOpEquals |
                             *  - Whitespace
                             *  - EOP
                             */
                            // String expression boundary symbol found, could be start or end.
                            if (currentToken.name == "STRING_EXPRESSION_BOUNDARY") {
                                // This is the start of a string
                                if (!this.isInString) {
                                    this.isInString = true;
                                    // Keep track where the string started
                                    this.startStringExpressionLine = this.lineNumber;
                                    this.startStringExpressionPosition = this.linePosition;
                                } // if
                            } // if
                            // Symbol found
                            else if (currentToken.name.includes("SYMBOL")) {
                                // Take note of token
                                this.tempToken = currentToken.copyWith(currentChunk, this.lineNumber, currentPosition);
                                console.log(`Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${this.tempToken.linePosition}`);
                                // Calculate the next position, without changing the position
                                let peekPosition = currentPosition + 1;
                                // Peek ahead, since symbols are length 2
                                if (peekPosition <= sourceCode.length) {
                                    let peekingChunk = sourceCode.substring(lastPosition, peekPosition);
                                    console.log("chunk: " + sourceCode.substring(lastPosition, peekPosition));
                                    // Check pool to see if a bigger symmbol has a correlating token.
                                    CheckingForSymbolLoop: for (let index = 0; index < tokenPool.length; ++index) {
                                        // Longer symbol was found to match with a token
                                        if (tokenPool[index].definition.test(peekingChunk)) {
                                            // Replace temporary token with the new longest token.
                                            this.tempToken = currentToken.copyWith(peekingChunk, this.lineNumber, peekPosition);
                                            console.log(`Overriden-Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${this.tempToken.linePosition}`);
                                            // Move current position ahead by two and start reading from there again.
                                            currentPosition += peekPosition + 1;
                                            lastPosition = currentPosition;
                                            continue LoopThroughSourceCodeWhileLoop;
                                        } // if
                                    } // for
                                } // if
                                // No longer token found, move up a starting position.
                                lastPosition++;
                                currentPosition = lastPosition;
                                continue LoopThroughSourceCodeWhileLoop;
                            } // else-if
                            else if (currentToken.name.includes("END_OF_PROGRAM")) {
                                this.tempToken = currentToken.copyWith(currentChunk, this.lineNumber, currentPosition);
                                console.log(`EOP-Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${currentPosition}`);
                                break LoopThroughSourceCodeWhileLoop;
                            } // if
                            else {
                                // Replace temporary token with the new longest token.
                                this.tempToken = currentToken.copyWith(currentChunk, this.lineNumber, this.linePosition);
                                console.log(`normal case- Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${this.tempToken.linePosition}`);
                                // Increase the current position, whether a match was found or not.
                                currentPosition++;
                                break CheckingTokensLoop;
                            } // else
                        } // if 
                    } // for
                    // If loop completes without finding a match move to the next character.
                    if (!matchFound) {
                        currentPosition++;
                    } // 
                } // else
            } // while
        } // main
    } // class
    NightingaleCompiler.Lexer = Lexer;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//  /=$|\{$|\}$|\($|\)$|\!$|\"$|\+$|\/\*$|\\*\/$|\s$/
//# sourceMappingURL=lexer.js.map