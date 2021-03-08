/**
 * lexer.ts
 * Author: Alex Badia
 *
 * This is the Lexing stage of compilation.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class Lexer {
        constructor(
        /**
         * An array of Lexical Tokens.
         *
         * An array that must be filled with Lexical
         * Tokens and passed to the Parser in synchronous manner.
         *
         * TODO: Implement as a Stream where tokens are emitted into the Stream
         *       and have the Parser subscribe to it and listen for changes in state.
         */
        token_stream = [], 
        /**
         * An array of errors, warnings, tokens, lexemes and other debug info.
         *
         * Shows trace of the greedy algorithm used to generate tokens.
         */
        stacktrace_stack = [], 
        /*
        * An array of only Lexical Token types: invalid, valid, warning.
        */
        debug_token_stream = [], 
        /**
         * An array of errors, warnings, compilation info.
         */
        output = [], 
        /**
         * Stores tokens generated by each recurrence of the lexeme/substring loop.
         *
         * If null, no tokens were found in the current substring.
         * If non-null, stores the longest matched token found in the substring.
         *
         * This should be nullified after use by the emit_token_to_stream method.
         */
        tempToken = null, 
        /**
         * Current line number in the source code, shown to the user.
         *
         * Line number is synonymous with row position and 1 based.
         * This will be useful in identifying where tokens, errors, and warnings are generated.
         */
        lineNumber = 1, 
        /**
         * Current line position in the source code, shown to the user.
         *
         * Line position is synonymous with column position and 0 based.
         * This will be useful in identifying where tokens, errors, and warnings are generated.
         */
        linePosition = 0, 
        /**
         * The relative starting position in the string of source code.
         *
         * This position only is updated when the current position reaches
         * some boundary position in the source code such as a symbol or whitespace
         * and can safely generate a lexical token for the substring/lexeme.
         */
        lastPosition = 0, 
        /**
         * The iterator that sets the end boundary for the substring after each reccurance.
         *
         * Must be 1-based since Typescripts "substring" is not inclusive as for example:
         *      substring(0, 2) will return string[0-1] only, not string[2].
         */
        currentPosition = 0, errors_stream = [], warnings_stream = [], isInString = false, isInComment = false, missingEndOfProgram = true, 
        /**
         * Keeps track of the number of programs
         *
         * Assumes that any text in the code mirror text box
         * is part of the first program until a EOP TOKEN is found.
         */
        programNumber = 1, 
        /**
         * Pool of predefined tokens and their definitions
         *
         * Rule Order:
         *  1. Keyword
         *  2. ID
         *  3. Symbol, Digit, Character
         */
        token_pool = [
            /**
             * 1. Keywords
             */
            // Commands
            new NightingaleCompiler.LexicalToken(KEYWORD_PRINT, /^(print)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(KEYWORD_WHILE, /^(while)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(KEYWORD_IF, /^(if)$/, null, -1, -1),
            // Types
            new NightingaleCompiler.LexicalToken(KEYWORD_INT, /^(int)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(KEYWORD_STRING, /^(string)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(KEYWORD_BOOLEAN, /^(boolean)$/, null, -1, -1),
            // Boolean keywords
            new NightingaleCompiler.LexicalToken(KEYWORD_TRUE, /^(true)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(KEYWORD_FALSE, /^(false)$/, null, -1, -1),
            /**
             * 2. Identifiers
             */
            new NightingaleCompiler.LexicalToken(IDENTIFIER, /^[a-z]$/, null, -1, -1),
            /**
             * 3. Symbols
             */
            // Comments
            new NightingaleCompiler.LexicalToken(START_BLOCK_COMMENT, /^(\/\*)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(END_BLOCK_COMMENT, /^(\*\/)$/, null, -1, -1),
            // Quotation
            new NightingaleCompiler.LexicalToken(STRING_EXPRESSION_BOUNDARY, /^["]$/, null, -1, -1),
            // Open/Close blocks
            new NightingaleCompiler.LexicalToken(SYMBOL_OPEN_BLOCK, /^[\{]$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(SYMBOL_CLOSE_BLOCK, /^[\}]$/, null, -1, -1),
            // Open/Close arguments
            new NightingaleCompiler.LexicalToken(SYMBOL_OPEN_ARGUMENT, /^[\(]$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(SYMBOL_CLOSE_ARGUMENT, /^[\)]$/, null, -1, -1),
            // Operands
            new NightingaleCompiler.LexicalToken(SYMBOL_INT_OP, /^[\+]$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(SYMBOL_BOOL_OP_EQUALS, /^(==)$/, null, -1, -1),
            new NightingaleCompiler.LexicalToken(SYMBOL_BOOL_OP_NOT_EQUALS, /^(!=)$/, null, -1, -1),
            // Assignments
            new NightingaleCompiler.LexicalToken(SYMBOL_ASSIGNMENT_OP, /^[=]$/, null, -1, -1),
            // Digits
            new NightingaleCompiler.LexicalToken(DIGIT, /^[0-9]$/, null, -1, -1),
            // Whitespace
            new NightingaleCompiler.LexicalToken(SPACE_SINGLE, new RegExp("^ $"), null, -1, -1),
            new NightingaleCompiler.LexicalToken(SPACE_TAB, new RegExp("^\t$"), null, -1, -1),
            new NightingaleCompiler.LexicalToken(SPACE_END_OF_LINE, new RegExp("^\n$"), null, -1, -1),
            // End of Program
            new NightingaleCompiler.LexicalToken(END_OF_PROGRAM, /^[\$]$/, null, -1, -1),
            // Character
            new NightingaleCompiler.LexicalToken(CHARACTER, /^[a-z]$/, null, -1, -1),
        ]) {
            this.token_stream = token_stream;
            this.stacktrace_stack = stacktrace_stack;
            this.debug_token_stream = debug_token_stream;
            this.output = output;
            this.tempToken = tempToken;
            this.lineNumber = lineNumber;
            this.linePosition = linePosition;
            this.lastPosition = lastPosition;
            this.currentPosition = currentPosition;
            this.errors_stream = errors_stream;
            this.warnings_stream = warnings_stream;
            this.isInString = isInString;
            this.isInComment = isInComment;
            this.missingEndOfProgram = missingEndOfProgram;
            this.programNumber = programNumber;
            this.token_pool = token_pool;
        }
        /**
         * Scans source code and generates tokens.
         *
        * @param {string} sourceCode formatted source code from CodeMirror input field.
         */
        main(sourceCode) {
            this.output.push(`INFO LEXER - Lexing program ${this.programNumber}`);
            // The current substring of the source code that will be tested against tokens.
            var current_potential_lexeme = "???";
            LoopThroughSourceCodeWhileLoop: while (this.lastPosition <= sourceCode.length && this.currentPosition <= sourceCode.length) {
                current_potential_lexeme = sourceCode.substring(this.lastPosition, this.currentPosition);
                this.stacktrace_stack.push(current_potential_lexeme);
                console.log("Current Lexeme: " + current_potential_lexeme);
                // Already inside a comment
                if (this.isInComment) {
                    // Don't care about contents of a comment until an end comment symbol is found.
                    if (/(\*\/$)/.test(current_potential_lexeme)) {
                        this.isInComment = false;
                        // Offset since \n in comments can make line numbering wierd
                        var offset = 0;
                        if (current_potential_lexeme.includes("\n")) {
                            offset = current_potential_lexeme.lastIndexOf("\n");
                        } // if
                        // Generate token
                        this.tempToken = new NightingaleCompiler.LexicalToken(END_BLOCK_COMMENT, /^(\*\/)$/, current_potential_lexeme, this.lineNumber, this.linePosition + (current_potential_lexeme.length - offset));
                        this.emit_token_to_stream(this.tempToken);
                        this.linePosition += current_potential_lexeme.length - offset;
                        this.advance_last_position();
                        this.tempToken = null;
                    } // if
                    // Keeping reading through comment
                    else {
                        // Update line number is \n is found
                        if (current_potential_lexeme.endsWith("\n")) {
                            this.lineNumber++;
                            this.linePosition = 0;
                        } // if
                        this.currentPosition++;
                    } // else
                } // if
                // In string
                else if (this.isInString) {
                    // Must be a CHARACTER_TOKEN or space
                    if (/^[a-z]$/.test(current_potential_lexeme) || RegExp("^ $").test(current_potential_lexeme) || RegExp("^\t$").test(current_potential_lexeme)) {
                        // Generate token
                        this.tempToken = new NightingaleCompiler.LexicalToken(CHARACTER, /^(\*\/)$/, current_potential_lexeme, this.lineNumber, this.linePosition + 1);
                        this.emit_token_to_stream(this.tempToken);
                        // Adance tab 4 spaces
                        if (RegExp("^\t$").test(current_potential_lexeme)) {
                            this.linePosition += this.calc_relative_length(current_potential_lexeme);
                        } // if
                        else {
                            this.linePosition += current_potential_lexeme.length;
                        } // else
                        this.advance_last_position();
                    } // if: must be a CHARACTER_TOKEN
                    // No line breaks in strings
                    else if (RegExp("^\n$").test(current_potential_lexeme)) {
                        // Error
                        this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(INVALID_TOKEN, null, "EOL", this.lineNumber, this.linePosition));
                        this.linePosition += current_potential_lexeme.length;
                        this.advance_last_position();
                        this.check_to_advance_line_number(current_potential_lexeme);
                    } // else-if 
                    // Quotation found in string
                    else if (/^["]$/.test(current_potential_lexeme)) {
                        this.isInString = false;
                        // Generate an invalid token for the first character in the invalid sub string.
                        this.emit_token_to_stream(new NightingaleCompiler.LexicalToken("END_STRING_EXPRESSION", null, current_potential_lexeme, this.lineNumber, this.linePosition + 1));
                        // Calculate the location
                        this.linePosition += current_potential_lexeme.length;
                        this.advance_last_position();
                    } // if
                    // Not a valid character
                    else {
                        // Invalid token for the first character in the invalid sub string
                        this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(INVALID_TOKEN, null, current_potential_lexeme, this.lineNumber, this.linePosition + 1));
                        this.linePosition += current_potential_lexeme.length;
                        this.advance_last_position();
                    } // else
                } // else-if
                // Not in comment nor in a string
                else {
                    /**
                     * Sentinel conditions
                     *
                     * Symbols, whitespace (if present and outside of quotes) and the EOP
                     * meta-symbol mean that we can stop moving ahead and see what we’ve got so far.
                     */
                    if (/=$|\{$|\}$|\($|\)$|\"$|\+$|\/\*$|\*\/$|\s$|\$$/.test(current_potential_lexeme) && current_potential_lexeme.length > 1) {
                        /*
                         * Tokens were found in the substring, emit the longest matched token.
                         *
                         * Temporary token is useful:
                         *      - If null, no tokens were found.
                         *      - If not null, stores the longest matched token.
                        */
                        if (this.tempToken != null) {
                            this.emit_token_to_stream(this.tempToken);
                            // Keep like this 
                            if (this.tempToken.name.includes("SPACE")) {
                                this.linePosition += this.calc_relative_length(this.tempToken.lexeme);
                            } // if
                            else {
                                this.linePosition += this.tempToken.lexeme.length;
                            } // else
                            /**
                             * Last position is set past the tokens lexeme length
                             *
                             * This is not necessary, as you could advance the last position by one,
                             * but you would be wasting time iterating over parts an already discovered token.
                             */
                            this.set_last_position(this.lastPosition + this.tempToken.lexeme.length);
                            this.check_to_advance_line_number(this.tempToken.lexeme);
                            // Reset temp token
                            this.tempToken = null;
                            // Skip the Check Tokens From Token Pool Loop
                            continue LoopThroughSourceCodeWhileLoop;
                        } // if
                        /*
                         * No tokens were found in the substring.
                         *
                         * That means the entire substring is filled with invalid
                         * tokens, except for the last character which must be a symbol.
                         * So we generate an invalid token for the first character in the invalid sub string.
                        */
                        else {
                            let invalidToken = new NightingaleCompiler.LexicalToken(INVALID_TOKEN, null, current_potential_lexeme, this.lineNumber, this.linePosition + current_potential_lexeme.length - (current_potential_lexeme.length - 1));
                            this.emit_token_to_stream(invalidToken);
                            this.linePosition += invalidToken.lexeme.length;
                            this.check_to_advance_line_number(invalidToken.lexeme);
                            this.advance_last_position();
                            continue LoopThroughSourceCodeWhileLoop;
                        } // else
                    } // if
                    // Test current substring of source code against tokens in the token pool
                    let token = this.get_token_from_token_pool(current_potential_lexeme);
                    /**
                     * Characters that are not matched are illegal.
                     *
                     * Some tokens have sets that overlap with illegal characters.
                     *  - BOOLEAN NOT EQUALS OPERATION (!=) overlaps with illegal character (!).
                     *  - START BLOCK COMMENT (/ *) overlaps with illegal character (/).
                     *  - END BLOCK COMMENT (* /), overlaps with illegal character (*).
                     */
                    if (token == null) {
                        this.check_illegal_characters_for_symbols(current_potential_lexeme, sourceCode);
                        continue LoopThroughSourceCodeWhileLoop;
                    } // if
                    // Must check string boundaries in order to tell if this is a Open or Close String Boundary
                    else if (token.name == STRING_EXPRESSION_BOUNDARY) {
                        this.check_current_string_expression_boundaries(token, current_potential_lexeme);
                        continue LoopThroughSourceCodeWhileLoop;
                    } // if
                    /**
                     * A type of symbol, but which?
                     *
                     * Since symbols are a sentinel condition to stop the current recursion,
                     * We must check if this symbol is a sentinel or is part of a larger symbol.
                     */
                    else if (token.name.includes(SYMBOL)) {
                        this.check_for_longer_symbol(token, current_potential_lexeme, sourceCode);
                        continue LoopThroughSourceCodeWhileLoop;
                    } // else-if
                    /**
                     * End of current program
                     *
                     * Is there a way to figure out a way to check if there are more?
                     */
                    else if (token.name.includes(END_OF_PROGRAM)) {
                        this.check_for_more_programs(token, current_potential_lexeme, sourceCode);
                        continue LoopThroughSourceCodeWhileLoop;
                    } // else if 
                    /**
                     * Non-special cases
                     *
                     * Includes like ID's and Keywords that are stored in a temp variable.
                     * The temp variable will hold the longest key in the current recursion.
                     */
                    else {
                        // Replace temporary token with the new longest token.
                        // Don't use relative length, it will cause the line position to be read at the end of the tab
                        if (token.name.includes("SPACE_TAB")) {
                            this.emit_token_to_stream(token.copyWith(current_potential_lexeme, this.lineNumber, this.linePosition));
                            this.advance_last_position();
                            this.linePosition += 4;
                        } // if
                        else {
                            this.tempToken = token.copyWith(current_potential_lexeme, this.lineNumber, this.linePosition + current_potential_lexeme.length - (current_potential_lexeme.length - 1));
                            this.currentPosition++;
                        } // else
                        /**
                         * Intermediate Tokens shown in stacktrace.
                         *
                         * This is the first possible token found.
                         * Most likely will be overriden if a longer token match is found.
                         */
                        // this.stacktrace_stack.push(this.tempToken);
                        // Increase the current position, whether a match was found or not
                        continue LoopThroughSourceCodeWhileLoop;
                    } // else
                } // else: not in comment nor in string
            } // while: loop through source code
            sourceCode = this.post_check_for_warnings(sourceCode);
            this.post_check_for_errors();
            this.output.push(`INFO LEXER - Lexer completed with ${this.warnings_stream.length} warnings.`);
            this.output.push(`INFO LEXER - Lexer completed with ${this.errors_stream.length} errors.`);
            return sourceCode;
        } // function: main
        check_illegal_characters_for_symbols(new_current_potential_lexeme, source_code) {
            if (/(^!$|^\*$|^\/$)/.test(new_current_potential_lexeme)) {
                // Infinite loop protection
                // let foundMatchByPeekingAheadOfInvalidString: boolean = false;
                /**
                 * Peek ahead one position.
                 *
                 * Only need to peek ahead one position since
                 * SYMBOLS in our grammar are only a max length of 2.
                 */
                let nextPosition = this.currentPosition + 1;
                let peekingChunk = source_code.substring(this.lastPosition, nextPosition);
                /**
                 * Validate the new substring against the pool of tokens.
                 *
                 * For example:
                 *  - 1.) Original illegal symbol was !.
                 *  - 2.) We peeked ahead another character so now our new substring is !=.
                 *  - 3.) NOW, we validate != against the token pool.
                 */
                let current_token = this.get_token_from_token_pool(peekingChunk);
                if (current_token == null) {
                    this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(INVALID_TOKEN, null, new_current_potential_lexeme, this.lineNumber, this.linePosition));
                    this.advance_last_position();
                } // if
                else {
                    // Generate a new token.
                    this.tempToken = current_token.copyWith(peekingChunk, this.lineNumber, this.linePosition + peekingChunk.length - (peekingChunk.length - 1));
                    // Special Case: token match was a START_BLOCK_COMMENT
                    if (this.tempToken.name == START_BLOCK_COMMENT) {
                        this.isInComment = true;
                    } // if
                    else if (this.tempToken.name == END_BLOCK_COMMENT) {
                        // End Block Comment Symbol found without a matching Start Block Comment Symbol.
                        if (!this.isInComment) {
                            // Token line position already calculated
                            this.advance_last_position();
                            this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(INVALID_TOKEN, null, new_current_potential_lexeme, this.lineNumber, this.linePosition + peekingChunk.length - (peekingChunk.length - 1)));
                            this.tempToken = null;
                            return;
                        } // if
                        // End Block Comment Symbol has matching Start Block Comment Symbol.
                        else {
                            this.isInComment = false;
                        } // else
                    } // if
                    this.emit_token_to_stream(this.tempToken);
                    // Yesm order matters!, do this after you generate the token
                    this.linePosition += peekingChunk.length;
                    // Advance 2 spaces since symbol length is 2
                    this.advance_last_position();
                    this.advance_last_position();
                    this.tempToken = null;
                    return;
                } // else
            } // if: illegal character is: ! or / or *
            // Not a special illegal character.
            else {
                if (new_current_potential_lexeme.length == 1) {
                    this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(INVALID_TOKEN, null, new_current_potential_lexeme, this.lineNumber, this.lastPosition));
                    this.advance_last_position();
                }
                else {
                    this.currentPosition++;
                }
            } // else: not an illegal: ! or / or *
        } // check_illegal_characters_for_symbols
        check_current_string_expression_boundaries(newToken, new_current_potential_lexeme) {
            // Start of string
            if (!this.isInString) {
                this.isInString = true;
                this.tempToken = newToken.copyWith(new_current_potential_lexeme, this.lineNumber, this.linePosition + 1);
                this.emit_token_to_stream(this.tempToken);
                this.linePosition += this.tempToken.lexeme.length;
                this.tempToken = null;
            } // if
            // End of string
            else {
                this.isInString = false;
            } // else
            this.advance_last_position();
        } // mapStringExpressionBoundaryToMethod
        check_for_longer_symbol(new_current_token, new_current_potential_lexeme, new_source_code) {
            /**
             * Save the current symbols token.
             *
             * If a longer symbol is found by peeking ahead, this symbols token
             * will be replaced with a new token for the longer symbol that was found.
             */
            this.tempToken = new_current_token.copyWith(new_current_potential_lexeme, this.lineNumber, this.linePosition + 1);
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
            let peekPosition = this.currentPosition + 1;
            let peekingChunk;
            // Only peek ahead if we do not fall off the string (or in some languages, wrap-around).
            if (peekPosition <= new_source_code.length) {
                /**
                 * Generate a new substring from peeking ahead a line-position.
                 *
                 * The longer substring will be tested to see if it matches a longer token.
                 * If so, replace the original symbol token, with the current longer symbol token.
                 */
                peekingChunk = new_source_code.substring(this.lastPosition, peekPosition);
                // Loop through pool of tokens to see if the longer substring matches any of definitions.
                let token_from_pool = this.get_token_from_token_pool(peekingChunk);
                // Replace the current symbol token with the new longer token.
                if (token_from_pool != null) {
                    this.tempToken = token_from_pool.copyWith(peekingChunk, this.lineNumber, this.linePosition + peekingChunk.length - (peekingChunk.length - 1));
                    this.set_last_position(peekPosition);
                    // Position must come after token generation
                    this.emit_token_to_stream(this.tempToken);
                    this.linePosition += peekingChunk.length;
                    this.tempToken = null;
                    return;
                } // if
            } // if
            this.emit_token_to_stream(this.tempToken);
            // Position must come after token generation
            this.linePosition += new_current_potential_lexeme.length;
            this.advance_last_position();
            this.tempToken = null;
        } // check_for_longer_symbol
        /**
         *
         *
         * @param new_current_token
         * @param new_current_potential_lexeme
         */
        check_for_more_programs(new_current_token, new_current_potential_lexeme, source_code) {
            // Generate end of program token.
            this.tempToken = new_current_token.copyWith(new_current_potential_lexeme, this.lineNumber, this.linePosition + 1);
            this.emit_token_to_stream(this.tempToken);
            this.linePosition += new_current_potential_lexeme.length;
            this.advance_last_position();
            this.tempToken = null;
            /**
             * Check for more programs
             *
             * If theres anything after the $, then we're in a new program
             * This technivally counts white-space too...
             */
            if (this.lastPosition != source_code.length) {
                this.programNumber++;
                this.output.push(`INFO LEXER - Lexing program ${this.programNumber}`);
                this.missingEndOfProgram = true;
            } // if
            else {
                this.missingEndOfProgram = false;
            } // else
        } // check_for_more_programs
        /**
         * Checks for lexical warnings.
         *
         * These warnings will be fixed at compilation, but could
         * change the meaning of the program slighttly, hence "warning."
         *
         * @param newSourceCode source code from coder mirror.
         * @returns modifed source code
         */
        post_check_for_warnings(newSourceCode) {
            // Missing EOP, add it
            if (this.missingEndOfProgram) {
                this.output.push(`WARNING  LEXER - Missing EOP. Try adding $ to line ${this.lineNumber}`);
                this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(MISSING_TOKEN, null, "$", this.lineNumber, -1));
                return newSourceCode += "$";
            } // if
        } // post_check_for_warnings
        post_check_for_errors() {
            // Missing close string expression?
            if (this.isInComment) {
                this.output.push(`ERROR  LEXER - Missing End End Comment. Try adding */ to line ${this.lineNumber}`);
                this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(MISSING_TOKEN, null, "*/", this.lineNumber, -1));
            } // if
            if (this.isInString) {
                this.output.push(`ERROR  LEXER - ${this.programNumber}-  Missing End String Boundary Expression. Try adding \" to line ${this.lineNumber}`);
                this.emit_token_to_stream(new NightingaleCompiler.LexicalToken(MISSING_TOKEN, null, "\"", this.lineNumber, -1));
            } // if
        } // post_check_for_errors
        /**
         * Matches a new substring from the source code against tokens.
         *
         * @param newLexeme [string] a substring of the source code
         * @returns [LexicalToken] Lexical Token if lexeme matches token definition, null if not.
         *
         */
        get_token_from_token_pool(newLexeme) {
            let index = 0;
            while (index < this.token_pool.length) {
                if (this.token_pool[index].definition.test(newLexeme)) {
                    return this.token_pool[index];
                } // if
                index++;
            } // while
            return null;
        } // check_for_match_in_token_pool
        /**
         * Sorts which streams to emit the token too.
         *
         * @param newToken [Lexical Token] to be emitte to the parser
         */
        emit_token_to_stream(newToken) {
            if (newToken.name == WARNING_TOKEN) {
                this.warnings_stream.push(newToken);
            } // if
            else if (newToken.name == INVALID_TOKEN) {
                this.output.push(`ERROR- ${this.lineNumber}:${this.linePosition} Unrecognized Token: ${newToken.lexeme}`);
                this.errors_stream.push(newToken);
            } // else-if
            else if (newToken.name == MISSING_TOKEN) {
                this.warnings_stream.push(newToken);
            } // else-if
            else {
                this.token_stream.push(newToken);
            } // else
            // Tokens for debugging
            this.debug_token_stream.push(newToken);
            this.stacktrace_stack.push(newToken);
            console.log(`[${newToken.name}] Lexeme: ${newToken.lexeme}, Line-Position: ${newToken.linePosition}`);
        } // emit_token_to_stream
        /**
         * Advances the last position by one.
         *
         * Resets the current position relative to the starting position.
         * This function usually should be called when emitting a token.
         */
        advance_last_position() {
            this.lastPosition = this.currentPosition;
            this.currentPosition = this.lastPosition + 1;
        } // advance_last_position
        /**
         * Sets the last position.
         *
         * @param [number] sets last position to new position.
         */
        set_last_position(newPosition) {
            this.lastPosition = newPosition;
            this.currentPosition = this.lastPosition + 1;
        } // set_last_position
        /**
         * Advances the line number by 1 if the string includes \n.
         *
         * @param codeSubString [string] a lexeme from the source code and tokens
         */
        check_to_advance_line_number(newLexeme) {
            if (newLexeme.includes("\n")) {
                this.lineNumber++;
                this.linePosition = 0;
            } // if
        } // check_to_advance_line_number
        /**
         * Returns the relative length of a string.
         *
         * This method values \t = 4 as opposed to normal string.length methods value \t = 1.
         * @param codeSubString [string] string with \t.
         */
        calc_relative_length(code) {
            let numberOfTabs = 0;
            for (var h = 0; h < code.length; ++h) {
                if (RegExp("^\t$").test(code[h])) {
                    numberOfTabs++;
                } // if
            } // for
            return code.length + (numberOfTabs * 3);
        } // length
    } // class: lexer
    NightingaleCompiler.Lexer = Lexer;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module: NightingaleCompiler
//# sourceMappingURL=lexer.js.map