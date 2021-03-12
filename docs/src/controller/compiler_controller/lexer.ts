/**
 * lexer.ts
 * Author: Alex Badia
 * 
 * This is the Lexing stage of compilation.
 */

module NightingaleCompiler {
    export class Lexer {
        constructor(
            /**
             * An array of Lexical Tokens.
             * 
             * An array that must be filled with Lexical 
             * Tokens and passed to the Parser in synchronous manner.
             */
            public token_stream: Array<Array<LexicalToken>> = [[]],

            /**
             * An array of invalidly lexed programs
             */
            public invalid_programs: Array<number> = [],

            /*
            * An array of only Lexical Token types: invalid, valid, warning.
            */
            public debug_token_stream: Array<Array<LexicalToken>> = [[]],

            /**
             * An array of errors, warnings, tokens, lexemes and other debug info.
             * Shows trace of the greedy algorithm used to generate tokens.
             */
            public stacktrace_stack: Array<any> = [],

            /**
             * An array of errors, warnings, compilation info.
             */
            public output: Array<OutputConsoleMessage> = [],

            /**
             * Stores all warning tokens
             */
            public errors_stream: Array<LexicalToken> = [],

            /**
             * Stores all error tokens
             */
            public warnings_stream: Array<LexicalToken> = [],

            /**
             * Keeps track of the number of programs
             */
            public program_number: number = 0,

            /**
             * Stores tokens generated by each recurrence of the lexeme/substring loop.
             * 
             * - If null, no tokens were found in the current substring. 
             * - If non-null, stores the longest matched token found in the substring.
             * 
             * This should be nullified after use by the emit_token_to_stream method.
             */
            private _temp_token: NightingaleCompiler.LexicalToken = null,

            /** 
             * Current line number in the code editor. 
             * 
             * Whenever an End Of Line is encountered in the source code this line number should 
             * increase by 1. Remember that End Of Line's can legally be found in comments but not strings.
             * */
            private _code_editor_line_number: number = 1,


            /** 
             * Current line position in code editor.
             * 
             * After a token is emitted, this code editor line number
             * should increase by the length of the emitted token's lexeme.
             * */
            private _code_editor_line_position: number = 0,

            /**
             * The relative starting position in the raw source code string.
             * 
             * This position only is updated when the current position reaches
             * some boundary position in the source code such as a symbol or whitespace
             * and can safely generate a lexical token for the substring/lexeme.
             */
            private _last_position: number = 0,

            /**
             * The iterator that sets the end boundary for the substring after each reccurance.
             * 
             * Must be 1-based since Typescripts "substring" is not inclusive as for example:
             *      substring(0, 2) will return string[0-1] only, not string[2].
             */
            private _current_position: number = 0,


            private isInString: boolean = false,
            private isInComment: boolean = false,
            private missingEndOfProgram: boolean = true,

            /**
             * Pool of predefined tokens and their definitions
             * 
             * Rule Order:
             *  1. Keyword
             *  2. ID
             *  3. Symbol, Digit, Character
             */
            private _token_pool: Array<LexicalToken> = [
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
            ],
        ) { }// constructor

        /**
         * Generates tokens for the parser.
         * 
         * Scans the source code from the code editor using a subset greedy algorithm.
         * Each subset is tested against the token pool [this._token_pool] and if valid is
         * outputted to the token stream. If invalid, a new longer subset is found and tested.
         * 
         * After the entire source code has been scanned, there is one final check for errors.
         * If there are fixable warnings, the lexer will modify the source code and return the fixed source code.
         * 
         * @param {string} new_source_code source code from code editor.
         */
        public main(new_source_code: string): string {

            // Assume this is the first program
            this.output.push(new OutputConsoleMessage(LEXER, INFO, `Lexing program ${this.program_number + 1}...`));

            // The current substring of the source code that will be tested against tokens.
            var current_potential_lexeme: string = "???";

            while (this._last_position <= new_source_code.length && this._current_position <= new_source_code.length) {

                // Generate a new substring and stacktrace it
                current_potential_lexeme = new_source_code.substring(this._last_position, this._current_position);
                this.stacktrace_stack.push(current_potential_lexeme);

                // Already inside a comment
                if (this.isInComment) {
                    // Skip reading the next line in comment if an END_BLOCK_COMMENT Token is found
                    if (this.check_for_end_comment(current_potential_lexeme)) { continue; }// if

                    // Update line number is End Of Line is found
                    if (current_potential_lexeme.endsWith("\n")) {
                        this._code_editor_line_number++;
                        this._code_editor_line_position = 0;
                    }// if
                    this._current_position++;
                }// if

                // Already inside a string
                else if (this.isInString) {
                    if (this.check_for_valid_character_or_space(current_potential_lexeme)) { continue; }// if
                    if (this.check_for_end_string_boundary(current_potential_lexeme)) { continue; }// if
                    if (this.check_for_end_of_line(current_potential_lexeme)) { continue; }// if

                    // Invalid token for the first character in the invalid sub string
                    this.emit_token_to_stream(
                        new LexicalToken(
                            INVALID_TOKEN,
                            null,
                            current_potential_lexeme,
                            this._code_editor_line_number, this._code_editor_line_position + 1
                        )// LexicalToken
                    ); // emit_token_to_stream
                    this._code_editor_line_position += current_potential_lexeme.length;
                    this.advance_last_position();
                }// else-if

                // Not in comment nor in a string
                else {
                    // Skip testing against token pool if a sentinel value is found.
                    if (this.check_for_sentinel(current_potential_lexeme)) { continue; }// if

                    // Test current substring of source code against tokens in the token pool
                    let token: LexicalToken = this.get_token_from_token_pool(current_potential_lexeme);

                    // No token was returned. The character is probably illegal. Check to make sure.
                    if (token == null) {
                        this.check_illegal_characters_for_symbols(current_potential_lexeme, new_source_code);
                    }// if

                    // Check if it is an open or close string expression boundary.
                    else if (token.name == STRING_EXPRESSION_BOUNDARY) {
                        this.check_current_string_expression_boundaries(token, current_potential_lexeme);
                    }// if

                    // Make sure the symbol is not part of a larger symbol.
                    else if (token.name.includes(SYMBOL)) {
                        this.check_for_longer_symbol(token, current_potential_lexeme, new_source_code);
                    }// else-if

                    // End of current program, check for more programs.
                    else if (token.name.includes(END_OF_PROGRAM)) {
                        this.check_for_more_programs(token, current_potential_lexeme, new_source_code);
                    }// else if 

                    // TABS have a length of 4 spaces in the code editor, be sure to update the code editor position [_code_editor_line_position] correctly.
                    else if (token.name.includes("SPACE_TAB")) {
                        this.emit_token_to_stream(
                            token.copyWith(
                                current_potential_lexeme,
                                this._code_editor_line_number,
                                this._code_editor_line_position
                            )// copyWith
                        );// emit_token_to_stream
                        this.advance_last_position();

                        // Don't use the relative length function, it will cause the line position to be read at the end of the tab.
                        this._code_editor_line_position += CODE_EDITOR_TAB_LENGTH;
                    }// else-if

                   // Store ID's and Keywords in a temp variable this way the temp variable will hold the longest key in the current recursion.
                    else {
                        // This will end up replacing shorter tokens
                        this._temp_token = token.copyWith(
                            current_potential_lexeme, 
                            this._code_editor_line_number, 
                            this._code_editor_line_position + current_potential_lexeme.length - (current_potential_lexeme.length - 1)
                        );// copyWith
                        this._current_position++;
                    }// else
                }// else
            }// while

            // Fix warnings before handing of tokens to the parser
            new_source_code = this.post_check_for_warnings(new_source_code);

            // Fixing errors is even more dangerous that fixing warnings... so don't.
            this.post_check_for_errors();

            // Lex metadata
            this.output.push(new OutputConsoleMessage(LEXER, INFO, `Lexer completed with ${this.warnings_stream.length} warnings.`));
            this.output.push(new OutputConsoleMessage(LEXER, INFO, `Lexer completed with ${this.errors_stream.length} errors.`));

            // This is the fixed source code
            return new_source_code;
        }// function: main

        /**
         * Checks if the given argument is astrix (*) immediately followed by a forward slash (/).
         * If true, an END_BLOCK_COMMENT token will be generated and emitted. Nothing if false.
         * 
         * @param new_current_potential_lexeme substring of the source code
         * @returns true | false
         */
        private check_for_end_comment(new_current_potential_lexeme: string): boolean {
            // Don't care about contents of a comment until an end comment symbol is found.
            if (/(\*\/$)/.test(new_current_potential_lexeme)) {
                this.isInComment = false;

                // Offset since \n in comments can make line numbering wierd
                var offset: number = 0;

                if (new_current_potential_lexeme.includes("\n")) {
                    offset = new_current_potential_lexeme.lastIndexOf("\n");
                }// if

                // Generate token
                this._temp_token = new NightingaleCompiler.LexicalToken(
                    END_BLOCK_COMMENT,
                    /^(\*\/)$/,
                    new_current_potential_lexeme,
                    this._code_editor_line_number,
                    this._code_editor_line_position + (new_current_potential_lexeme.length - offset));

                this.emit_token_to_stream(this._temp_token);

                // Calculate the new location in code editor
                this._code_editor_line_position += new_current_potential_lexeme.length - offset;
                this.advance_last_position();

                // Reset the temporary token, to avoid tokens from being carried over when last_position updates.
                this._temp_token = null;
                return true;
            }// if
            return false;
        }// check_for_end_comment

        
        /**
         * Checks if the string argument is end string boundary (") and genrates a END_STRING_EXPRESSION token if so.
         * 
         * @param new_current_potential_lexeme substring in source code
         * @returns true | false
         */
        private check_for_end_string_boundary(new_current_potential_lexeme: string): boolean {
            if (/^["]$/.test(new_current_potential_lexeme)) {
                this.isInString = false;

                // Generate an invalid token for the first character in the invalid sub string.
                this.emit_token_to_stream(
                    new LexicalToken(
                        STRING_EXPRESSION_BOUNDARY, 
                        null, 
                        new_current_potential_lexeme, 
                        this._code_editor_line_number, 
                        this._code_editor_line_position + 1
                    )// Lexical Token
                );// emit_token_to_stream

                // Calculate the new location in code editor
                this._code_editor_line_position += new_current_potential_lexeme.length;
                this.advance_last_position();

                return true;
            }// if

            return false;
        }// check_for_end_string_boundary

        /**
         * Checks if the string argument is an End Of Line character. If so, emits
         * an INVALID_TOKEN since End Of Line characters are not allowed in our grammars string.
         * 
         * @param new_current_potential_lexeme substring in source code
         * @returns true | false
         */
        private check_for_end_of_line(new_current_potential_lexeme: string): boolean {
            if (RegExp("^\n$").test(new_current_potential_lexeme)) {
                // Error
                this.emit_token_to_stream(new LexicalToken(INVALID_TOKEN, null, "EOL", this._code_editor_line_number, this._code_editor_line_position));
                this._code_editor_line_position += new_current_potential_lexeme.length;
                this.advance_last_position();
                this.check_to_advance_line_number(new_current_potential_lexeme);
                return true;
            }// if 

            return false;
        }// check_for_end_of_line

        /**
         * Checks if the string argument is a valid string character according to the grammar.
         * Our grammar defines valid string characters as [a-z] and spaces. Note this is case sensitive.
         * 
         * @param new_current_potential_lexeme 
         * @returns true | false
         */
        private check_for_valid_character_or_space(new_current_potential_lexeme: string): boolean {
            if (/^[a-z]$/.test(new_current_potential_lexeme) || RegExp("^ $").test(new_current_potential_lexeme) || RegExp("^\t$").test(new_current_potential_lexeme)) {

                // Generate token
                this._temp_token = new NightingaleCompiler.LexicalToken(CHARACTER, /^(\*\/)$/, new_current_potential_lexeme, this._code_editor_line_number, this._code_editor_line_position + 1);

                this.emit_token_to_stream(this._temp_token);

                // Adance tab 4 spaces
                if (RegExp("^\t$").test(new_current_potential_lexeme)) {
                    this._code_editor_line_position += this.calc_relative_length(new_current_potential_lexeme);
                }// if

                else {
                    this._code_editor_line_position += new_current_potential_lexeme.length;
                }// else

                this.advance_last_position();

                return true;
            }// if

            return false;
        }// check_for_valid_character_or_space

        
        /**
         * Sentinel conditions
         * 
         * Symbols, whitespace (if present and outside of quotes) and the EOP 
         * meta-symbol mean that we can stop moving ahead and see what we’ve got so far.
         */
        private check_for_sentinel(new_current_potential_lexeme: string): boolean {
            if (/=$|\{$|\}$|\($|\)$|\"$|\+$|\/\*$|\*\/$|\s$|\$$/.test(new_current_potential_lexeme) && new_current_potential_lexeme.length > 1) {

                /*
                 * Tokens were found in the substring, emit the longest matched token.
                 * 
                 * Temporary token is useful:
                 *      - If null, no tokens were found.
                 *      - If not null, stores the longest matched token.
                */
                if (this._temp_token != null) {
                    this.emit_token_to_stream(this._temp_token);

                    // Keep like this 
                    if (this._temp_token.name.includes("SPACE")) {
                        this._code_editor_line_position += this.calc_relative_length(this._temp_token.lexeme);
                    }// if
                    else {
                        this._code_editor_line_position += this._temp_token.lexeme.length;
                    }// else

                    /**
                     * Last position is set past the tokens lexeme length
                     * 
                     * This is not necessary, as you could advance the last position by one,
                     * but you would be wasting time iterating over parts an already discovered token.
                     */
                    this.set_last_position(this._last_position + this._temp_token.lexeme.length);

                    this.check_to_advance_line_number(this._temp_token.lexeme);

                    // Reset temp token
                    this._temp_token = null;
                }// if

                else {
                    /*
                    * No tokens were found in the substring.
                    * 
                    * That means the entire substring is filled with invalid 
                    * tokens, except for the last character which must be a symbol.
                    * So we generate an invalid token for the first character in the invalid sub string.
                    */
                    let invalidToken = new LexicalToken(
                        INVALID_TOKEN,
                        null,
                        new_current_potential_lexeme,
                        this._code_editor_line_number,
                        this._code_editor_line_position + new_current_potential_lexeme.length - (new_current_potential_lexeme.length - 1));
                    this.emit_token_to_stream(invalidToken);
                    this._code_editor_line_position += invalidToken.lexeme.length;
                    this.check_to_advance_line_number(invalidToken.lexeme);
                    this.advance_last_position();
                }// else

                return true;
            }// if

            return false;
        }// check_for_sentinel

        /**
         * Characters that are not matched are illegal.
         * 
         * Some tokens have sets that overlap with illegal characters.
         *  - BOOLEAN NOT EQUALS OPERATION (!=) overlaps with illegal character (!).
         *  - START BLOCK COMMENT (/ *) overlaps with illegal character (/).
         *  - END BLOCK COMMENT (* /), overlaps with illegal character (*).
         */
        private check_illegal_characters_for_symbols(new_current_potential_lexeme: string, source_code: string) {
            if (/(^!$|^\*$|^\/$)/.test(new_current_potential_lexeme)) {
                /**
                 * Peek ahead one position.
                 * 
                 * Only need to peek ahead one position since 
                 * SYMBOLS in our grammar are only a max length of 2.
                 */
                let nextPosition: number = this._current_position + 1;
                let peekingChunk: string = source_code.substring(this._last_position, nextPosition);

                /**
                 * Validate the new substring against the pool of tokens.
                 * 
                 * For example: 
                 *  - 1.) Original illegal symbol was !.
                 *  - 2.) We peeked ahead another character so now our new substring is !=.
                 *  - 3.) NOW, we validate != against the token pool.
                 */
                let current_token: LexicalToken = this.get_token_from_token_pool(peekingChunk);

                if (current_token == null) {
                    this.emit_token_to_stream(new LexicalToken(INVALID_TOKEN, null, new_current_potential_lexeme, this._code_editor_line_number, this._code_editor_line_position));
                    this.advance_last_position();
                }// if

                else {
                    // Generate a new token.
                    this._temp_token = current_token.copyWith(peekingChunk, this._code_editor_line_number, this._code_editor_line_position + peekingChunk.length - (peekingChunk.length - 1));

                    // Special Case: token match was a START_BLOCK_COMMENT
                    if (this._temp_token.name == START_BLOCK_COMMENT) {
                        this.isInComment = true;
                    }// if

                    else if (this._temp_token.name == END_BLOCK_COMMENT) {

                        // End Block Comment Symbol found without a matching Start Block Comment Symbol.
                        if (!this.isInComment) {
                            // Token line position already calculated
                            this.advance_last_position();
                            this.emit_token_to_stream(new LexicalToken(INVALID_TOKEN, null, new_current_potential_lexeme, this._code_editor_line_number, this._code_editor_line_position + peekingChunk.length - (peekingChunk.length - 1)));

                            this._temp_token = null;
                            return;
                        }// if

                        // End Block Comment Symbol has matching Start Block Comment Symbol.
                        else {
                            this.isInComment = false;
                        }// else
                    }// if

                    this.emit_token_to_stream(this._temp_token);

                    // Yes order matters!, do this after you generate the token
                    this._code_editor_line_position += peekingChunk.length;

                    // Advance 2 spaces since symbol length is 2
                    this.advance_last_position();
                    this.advance_last_position();

                    this._temp_token = null;
                    return;
                }// else
            }// if: illegal character is: ! or / or *

            // Not a special illegal character.
            else {
                if (new_current_potential_lexeme.length == 1) {
                    this.emit_token_to_stream(new LexicalToken(INVALID_TOKEN, null, new_current_potential_lexeme, this._code_editor_line_number, this._last_position));
                    this.advance_last_position();
                }
                else {
                    this._current_position++;
                }
            }// else: not an illegal: ! or / or *
        }// check_illegal_characters_for_symbols

        private check_current_string_expression_boundaries(newToken: LexicalToken, new_current_potential_lexeme: string): void {
            // Start of string
            if (!this.isInString) {
                this.isInString = true;
                this._temp_token = newToken.copyWith(new_current_potential_lexeme, this._code_editor_line_number, this._code_editor_line_position + 1);
                this.emit_token_to_stream(this._temp_token);
                this._code_editor_line_position += this._temp_token.lexeme.length;

                this._temp_token = null;
            }// if

            // End of string
            else {
                this.isInString = false;
            }// else
            this.advance_last_position();
        }// check_current_string_expression_boundaries

        /**
         * Some symbols have overlapping sets, such as:
         *  - Assignment Operation (=) and Boolean Operation Equals (==).
         *  - Boolean Operation Not Equals (!=) and Boolean Operation Equals (==).
         * 
         * Therfore, we must peek ahead to check for the LONGEST symbol.
         */
        private check_for_longer_symbol(new_current_token: LexicalToken, new_current_potential_lexeme: string, new_source_code: string): void {
            /**
             * Save the current symbols token.
             * 
             * If a longer symbol is found by peeking ahead, this symbols token
             * will be replaced with a new token for the longer symbol that was found.
             */
            this._temp_token = new_current_token.copyWith(
                new_current_potential_lexeme,
                this._code_editor_line_number,
                this._code_editor_line_position + 1);

            // Since our current language's longest symbols are length 2, we only need to peek ahead one line-position.
            let peekPosition: number = this._current_position + 1;
            let peekingChunk: string;

            // Only peek ahead if we do not fall off the string (or in some languages, wrap-around).
            if (peekPosition <= new_source_code.length) {

                /**
                 * Generate a new substring from peeking ahead a line-position.
                 * 
                 * The longer substring will be tested to see if it matches a longer token.
                 * If so, replace the original symbol token, with the current longer symbol token.
                 */
                peekingChunk = new_source_code.substring(this._last_position, peekPosition);

                // Loop through pool of tokens to see if the longer substring matches any of definitions.
                let token_from_pool = this.get_token_from_token_pool(peekingChunk);

                // Replace the current symbol token with the new longer token.
                if (token_from_pool != null) {
                    this._temp_token = token_from_pool.copyWith(peekingChunk, this._code_editor_line_number, this._code_editor_line_position + peekingChunk.length - (peekingChunk.length - 1));
                    this.set_last_position(peekPosition);

                    // Position must come after token generation
                    this.emit_token_to_stream(this._temp_token);
                    this._code_editor_line_position += peekingChunk.length;
                    this._temp_token = null;

                    return;
                }// if
            }// if
            this.emit_token_to_stream(this._temp_token);

            // Position must come after token generation
            this._code_editor_line_position += new_current_potential_lexeme.length;
            this.advance_last_position();
            this._temp_token = null;
        }// check_for_longer_symbol

        /**
         * Checks if the string argument is a End Program symbol ($). If so, emits a END_PROGRAM token.
         * Also checks if there are any characters following the End Of Program symbol ($)
         * 
         * If there are: 
         *  - increases the current program count [this.program_number].
         *  - raises missing end of program flag.
         * 
         * If not:
         *  - lowers missing end of program flag.
         * 
         * @param new_current_token 
         * @param new_current_potential_lexeme 
         */
        private check_for_more_programs(new_current_token: LexicalToken, new_current_potential_lexeme: string, source_code: string) {

            // Generate end of program token.
            this._temp_token = new_current_token.copyWith(
                new_current_potential_lexeme, 
                this._code_editor_line_number, 
                this._code_editor_line_position + 1
            );// copyWith
            this.emit_token_to_stream(this._temp_token);
            this._code_editor_line_position += new_current_potential_lexeme.length;
            this.advance_last_position();
            this._temp_token = null;

            /**
             * Check for more programs
             * 
             * If theres anything after the $, then we're in a new program
             * This technically counts white-space too...
             */
            if (this._last_position != source_code.length) {
                this.program_number++;
                this.token_stream.push(new Array<LexicalToken>());
                this.debug_token_stream.push(new Array<LexicalToken>());
                this.output.push(new OutputConsoleMessage(LEXER, INFO, `Lexing program ${this.program_number + 1}...`));
                this.missingEndOfProgram = true;

                // Reset flags
                this.isInComment = false;
                this.isInString = false;
            }// if

            else {
                this.missingEndOfProgram = false;
            }// else
        }// check_for_more_programs

        /**
         * Checks for lexical warnings.
         * 
         * These warnings will be fixed at compilation, but could 
         * change the meaning of the program slighttly, hence "warning."
         * 
         * @param newnew_source_code source code from coder mirror.
         * @returns modifed source code
         */
        private post_check_for_warnings(newnew_source_code: string): string {
            // Missing EOP, add it
            if (this.missingEndOfProgram) {
                this.output.push(new OutputConsoleMessage(LEXER, WARNING, `Missing EOP. Try adding $ to line ${this._code_editor_line_number}`));
                this.emit_token_to_stream(new LexicalToken(MISSING_TOKEN, null, "$", this._code_editor_line_number, -1));
                return newnew_source_code += "$";
            }// if
        }// post_check_for_warnings

        /**
         * Checks for error, though will not fix them.
         */
        private post_check_for_errors() {
            // Missing close string expression?
            if (this.isInComment) {
                this.output.push(new OutputConsoleMessage(LEXER, WARNING, `Missing End End Comment. Try adding */ to line ${this._code_editor_line_number}`));
                this.emit_token_to_stream(new LexicalToken(MISSING_TOKEN, null, "*/", this._code_editor_line_number, -1));
            }// if

            if (this.isInString) {
                this.output.push(new OutputConsoleMessage(LEXER, WARNING, `Missing End String Boundary Expression. Try adding \" to line ${this._code_editor_line_number}`));
                this.emit_token_to_stream(new LexicalToken(MISSING_TOKEN, null, "\"", this._code_editor_line_number, -1));
            }// if
        }// post_check_for_errors

        /**
         * Matches a new substring from the source code against tokens.
         * 
         * @param newLexeme [string] a substring of the source code
         * @returns [LexicalToken] Lexical Token if lexeme matches token definition, null if not.
         * 
         */
        private get_token_from_token_pool(newLexeme: string): LexicalToken {
            let index: number = 0;
            while (index < this._token_pool.length) {
                if (this._token_pool[index].definition.test(newLexeme)) {
                    return this._token_pool[index];
                }// if
                index++;
            }// while
            return null;
        }// check_for_match_in_token_pool

        /**
         * Sorts which streams to emit the token too.
         * 
         * @param newToken [Lexical Token] to be emitte to the parser
         */
        private emit_token_to_stream(newToken: LexicalToken): void {
            if (newToken.name == WARNING_TOKEN) {
                this.warnings_stream.push(newToken);
            }// if

            else if (newToken.name == INVALID_TOKEN) {
                if (!this.invalid_programs.includes(this.program_number)) {
                    this.invalid_programs.push(this.program_number);
                }// if
                this.output.push(new OutputConsoleMessage(
                    LEXER, ERROR, 
                    `${this._code_editor_line_number}:${this._code_editor_line_position} Unrecognized Token: ${newToken.lexeme}`
                    )
                );
                this.errors_stream.push(newToken);
            }// else-if

            else if (newToken.name == MISSING_TOKEN) {
                this.warnings_stream.push(newToken);
            }// else-if

            else {
                // Only emit tokens space and tab tokens in string
                if (this.isInString && (newToken.name == SPACE_SINGLE || newToken.name == SPACE_TAB)) {
                    this.token_stream[this.program_number].push(newToken);
                }// if

                // 
                else if (
                    newToken.name != START_BLOCK_COMMENT 
                    && newToken.name != END_BLOCK_COMMENT 
                    && newToken.name != SPACE_END_OF_LINE 
                    && newToken.name != SPACE_TAB
                    && newToken.name != SPACE_SINGLE
                ) {
                    this.token_stream[this.program_number].push(newToken);
                }// else if
                else {
                    // Don't emit comment tokens.
                    // Don't emit space tokens that aren't in strings
                }// else
            }// else

            this.debug_token_stream[this.program_number].push(newToken);
            this.stacktrace_stack.push(newToken);
            //console.log(`[${newToken.name}] Lexeme: ${newToken.lexeme}, Line-Position: ${newToken.linePosition}`);
        }// emit_token_to_stream


        /**
         * Advances the last position by one.
         * 
         * Resets the current position relative to the starting position.
         * This function usually should be called when emitting a token.
         */
        private advance_last_position(): void {
            this._last_position = this._current_position;
            this._current_position = this._last_position + 1;
        }// advance_last_position

        /**
         * Sets the last position.
         * 
         * @param [number] sets last position to new position.
         */
        private set_last_position(newPosition: number): void {
            this._last_position = newPosition;
            this._current_position = this._last_position + 1;
        }// set_last_position

        /**
         * Advances the line number by 1 if the string includes \n.
         * 
         * @param codeSubString [string] a lexeme from the source code and tokens
         */
        private check_to_advance_line_number(newLexeme: string): void {
            if (newLexeme.includes("\n")) {
                this._code_editor_line_number++;
                this._code_editor_line_position = 0;
            }// if
        }// check_to_advance_line_number

        /**
         * Returns the relative length of a string.
         * 
         * This method values \t = 4 as opposed to normal string.length methods value \t = 1. 
         * @param codeSubString [string] string with \t.
         */
        private calc_relative_length(code: string): number {
            let numberOfTabs = 0;
            for (var h: number = 0; h < code.length; ++h) {
                if (RegExp("^\t$").test(code[h])) {
                    numberOfTabs++;
                }// if
            }// for
            return code.length + (numberOfTabs * 3);
        }// length
    }// class: lexer
}// module: NightingaleCompiler