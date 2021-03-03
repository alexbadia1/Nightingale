/**
 * lexer.ts
 * Author: Alex Badia
 * 
 * This is the Lexing stage of compilation.
 */

//  TODO: TEST each regular expression

module NightingaleCompiler {
    export class Lexer {
        constructor(

            // /* */ for block comment.
            private _tStartBlockComment: RegExp = new RegExp('/\\*$'),
            private _tEndBlockComment: RegExp = new RegExp('\\*/$'),

            /**
             * Output Arrays
             * 
             * Arrays store errors and warnings in string format.
             * The entire contents of the array a printed at the end of compilation.
             */
            private tokenStream: Array<string> = [],
            private tempToken: NightingaleCompiler.LexicalToken = null,
            /**
             * Program characters' location
             * 
             * Implemented as zero based, but reported to user as 1 based.
             */
            private lineNumber: number = 0,
            private linePosition: number = 0,

            // Detects if current position is in a string
            private isInString: boolean = false,
            private startStringExpressionLine: number = 0,
            private startStringExpressionPosition: number = 0,

            // Detects if current position is in a string
            private isInComment: boolean = false,
        ) { }

        /**
         * Scans source code and generates tokens.
         * 
        * @param {string} sourceCode formatted source code from CodeMirror input field.
         */
        public main(sourceCode: string) {
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
                new NightingaleCompiler.LexicalToken("KEYWORD_PRINT", /^(print)$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_WHILE", /^(while)$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_IF", /^(if)$/, null, -1, -1),

                // Types
                new NightingaleCompiler.LexicalToken("KEYWORD_INT", /^(int)$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_STRING", /^(string)$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_BOOLEAN", /^(boolean)$/, null, -1, -1),

                // Boolean keywords
                new NightingaleCompiler.LexicalToken("KEYWORD_TRUE", /^(true)$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("KEYWORD_FALSE", /^(false)$/, null, -1, -1),

                /**
                 * 2. Identifiers
                 * 
                 * Can be character of id depending if inside a string or not.
                 */
                new NightingaleCompiler.LexicalToken("IDENTIFIER", /^[a-z]$/, null, -1, -1),

                /**
                 * 3. Symbols
                 */

                // Quotation
                new NightingaleCompiler.LexicalToken("STRING_EXPRESSION_BOUNDARY", /^(")$/, null, -1, -1),

                // Open/Close blocks
                new NightingaleCompiler.LexicalToken("SYMBOL_OPEN_BLOCK", /^[\{]$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_CLOSE_BLOCK", /^[\}]$/, null, -1, -1),

                // Open/Close arguments
                new NightingaleCompiler.LexicalToken("SYMBOL_OPEN_ARGUMENT", /^[\(]$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_CLOSE_ARGUMENT", /^[\)]$/, null, -1, -1),

                // Operands
                new NightingaleCompiler.LexicalToken("SYMBOL_INT_OP", /^[\+]$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_BOOL_OP_EQUALS", /^(==)$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("SYMBOL_BOOL_OP_NOT_EQUALS", /^(!=)$/, null, -1, -1),

                // Assignments
                new NightingaleCompiler.LexicalToken("SYMBOL_ASSIGNMENT_OP", /^[=]$/, null, -1, -1),

                // Digits
                new NightingaleCompiler.LexicalToken("DIGIT", /^[0-9]]$/, null, -1, -1),

                // Whitespace
                new NightingaleCompiler.LexicalToken("SPACE_SINGLE", new RegExp("^ $"), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SPACE_TAB", new RegExp("^\t$"), null, -1, -1),
                new NightingaleCompiler.LexicalToken("SPACE_END_OF_LINE", new RegExp("^\n$"), null, -1, -1),

                // End of Program
                new NightingaleCompiler.LexicalToken("END_OF_PROGRAM", /^[\$]$/, null, -1, -1),
                new NightingaleCompiler.LexicalToken("CHARACTER", /^[a-z]$/, null, -1, -1),
            ];


            let lastPosition: number = 0;
            let currentPosition: number = 0;
            LoopThroughSourceCodeWhileLoop: while (lastPosition < sourceCode.length) {

                // In comment
                if (this.isInComment) { }// if

                // In string
                else if (this.isInString) { }// else-if

                // Not in comment nor in a string
                else {
                    // Keeps track if the current substring matches a token definition from the token pool.
                    let matchFound: boolean = false;

                    // Don't forget that the end part in substring is not inclusive!
                    let currentChunk: string = sourceCode.substring(lastPosition, currentPosition);

                    // Symbols, whitespace (if present and outside of quotes) and the EOP 
                    // meta-symbol mean that we can stop moving ahead and see what we’ve got so far.
                    if (/=$|\{$|\}$|\($|\)$|\!$|\"$|\+$|\/\*$|\\*\/$|\s$|\$$/.test(currentChunk) && currentChunk.length > 1) {

                        // Emit the longest token.
                        console.log(`Stream-Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${this.tempToken.linePosition}`);

                        // Move the starting position after the string value that created the token.
                        lastPosition += this.tempToken.ancestor.length;

                        // Reset the current position back to the new starting position
                        currentPosition = lastPosition;

                        // Skip the Check Tokens From Token Pool Loop
                        continue LoopThroughSourceCodeWhileLoop;
                    }// if

                    // Test current substring of source code against tokens in the token pool
                    CheckTokensFromTokenPoolLoop: for (let indexOfToken: number = 0; indexOfToken < tokenPool.length; ++indexOfToken) {

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
                                }// if
                            }// if

                            // Symbol found
                            else if (currentToken.name.includes("SYMBOL")) {

                                /**
                                 * Keeps track if a longer symbol is found or not.
                                 * 
                                 * If a longer symbol is found, the starting position must be
                                 * moved after the longer symbol, instead of the shorted symbol.
                                 */
                                let longerSymbolFound: boolean = false;

                                /**
                                 * Save the current symbols token.
                                 * 
                                 * If a longer symbol is found by peeking ahead, this symbols token
                                 * will be replaced with a new token for the longer symbol that was found.
                                 */
                                this.tempToken = currentToken.copyWith(currentChunk, this.lineNumber, currentPosition);

                                /**
                                 * Peek ahead one line-position.
                                 * 
                                 * Some symbols have overlapping sets, such as:
                                 *  - Assignment Operation (=) and Boolean Operation Equals (==).
                                 *  - Boolean Operation Not Equals (!=) and Boolean Operation Equals (==).
                                 * 
                                 * Therfore, we must peek ahead to check for the LONGEST symbol.
                                 * Since our current language's longest symbols are length 2, we only need to peek ahead one line-position.
                                 */
                                let peekPosition: number = currentPosition + 1;

                                // Only peek ahead if we do not fall off the string (or in some languages, wrap-around).
                                if (peekPosition <= sourceCode.length) {

                                    /**
                                     * Generate a new substring from peeking ahead a line-position.
                                     * 
                                     * The longer substring will be tested to see if it matches a longer token.
                                     * If so, replace the original symbol token, with the current longer symbol token.
                                     */
                                    let peekingChunk: string = sourceCode.substring(lastPosition, peekPosition);

                                    // Loop through pool of tokens to see if the longer substring matches any of definitions.
                                    CheckForLongerSymbolLoop: for (let index: number = 0; index < tokenPool.length; ++index) {

                                        // Longer symbol has a token match!
                                        if (tokenPool[index].definition.test(peekingChunk)) {

                                            // Notify through boolean that the starting 
                                            // position must be changed to after the new LONGER symbol.
                                            longerSymbolFound = true;

                                            // Replace the current symbol token with the new longer token.
                                            this.tempToken = tokenPool[index].copyWith(peekingChunk, this.lineNumber, peekPosition);

                                            /**
                                             * Break out of loop on first token match.
                                             * 
                                             * This enforces priority of tokens by the order they are listed in the pool.
                                             */
                                            break CheckForLongerSymbolLoop;
                                        }// if
                                    }// for
                                }// if

                                // Longer symbol found
                                if (longerSymbolFound) {

                                    // Mover last position after the longer symbol.
                                    lastPosition = peekPosition + 1;

                                    // Reset the current position to new starting point.
                                    currentPosition = lastPosition;
                                }// if

                                // No longer token found.
                                else {
                                    // Move the starting position after the string value that created the token.
                                    lastPosition += this.tempToken.ancestor.length;

                                    // Reset the current position back to the new starting position.
                                    currentPosition = lastPosition;
                                }// else

                                // Emit token to stream.
                                console.log(`Strean-Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${this.tempToken.linePosition}`);

                                continue LoopThroughSourceCodeWhileLoop;
                            }// else-if

                            else if (currentToken.name.includes("END_OF_PROGRAM")) {
                                // Generate end of program token.
                                this.tempToken = currentToken.copyWith(currentChunk, this.lineNumber, currentPosition);

                                // Emit token to stream.
                                console.log(`EOP-Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${currentPosition}`);
                                break LoopThroughSourceCodeWhileLoop;
                            }// else-if

                            else {
                                // Replace temporary token with the new longest token.
                                this.tempToken = currentToken.copyWith(currentChunk, this.lineNumber, currentPosition - (currentChunk.length - 1));

                                // Token Stacktrace
                                //console.log(`StackTrace-Token: ${this.tempToken.name}, Ancestor: ${this.tempToken.ancestor}, Line-Position: ${this.tempToken.linePosition}`);

                                // Increase the current position, whether a match was found or not.
                                currentPosition++;
                                break CheckTokensFromTokenPoolLoop;
                            }// else
                        }// if 
                    }// for

                    // If loop completes without finding a match move to the next character.
                    if (!matchFound) {
                        currentPosition++;
                    }// 
                }// else
            }// while

        }// main
    }// class
}// module

//  /=$|\{$|\}$|\($|\)$|\!$|\"$|\+$|\/\*$|\\*\/$|\s$/