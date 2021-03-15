/**
 * parser.ts
 * 
 * Author: Alex Badia
 * 
 * This is the Parsing stage of compilation.
 */

module NightingaleCompiler {
    export class Parser {
        constructor(

            public output: Array<OutputConsoleMessage> = [],

            /**
             * A two-dimensional array of programs and their valid lexical tokens.
             */
            private _token_stream: Array<Array<LexicalToken>> = [[]],

            /**
             * Lexically invalid programs. These programs should be skipped.
             */
            private _lexically_invalid_programs: Array<number> = [],

            /**
             * Current program in the token stream.
             */
            private _current_program_number: number = 0,

            /**
             * Current index in the current program's token stream.
             */
            private _current_token_index: number = 0,

            /**
             * Current token in the current program's token stream.
             */
            private _current_token: LexicalToken = null,
        ){}// constructor

        private parse_program(): void {
            this.parse_block();
            this.match_token(END_OF_PROGRAM);
        }// parse_program

        private parse_block(): void {
            this.match_token(SYMBOL_OPEN_BLOCK);
            this.parse_statement_list();
            this.match_token(SYMBOL_CLOSE_BLOCK);
        }// parse_block

        private parse_statement_list(): void {
            if (this.current_token_is_statement()) {
                this.parse_statement();
                this.parse_statement_list();
            }// if

            else {
                // Do nothing, it's an empty production!
            }// else
        }// parse_statement_list

        private parse_statement(): void {
            switch(this._current_token.name) {
                case KEYWORD_PRINT:
                    this.parse_print_statement();
                    break;

                // In the language, assignment statements can only start with an identifier.
                case IDENTIFIER:
                    this.parse_assignment_statement();
                    break;

                case KEYWORD_INT:
                    // Non-terminal: int is a subset of the non-terminal: type.
                    // Just fall through.

                case KEYWORD_STRING:
                    // Non-terminal: string is a subset of the non-terminal: type.
                    // Just fall through.

                case KEYWORD_BOOLEAN:
                    // Non-terminal: boolean is a subset of the non-terminal: type.
                    this.parse_variable_declaration();
                    break;
                
                case KEYWORD_WHILE:
                    this.parse_while_statement();
                    break;
                
                case KEYWORD_IF:
                    this.parse_if_statement();
                    break;

                case SYMBOL_OPEN_BLOCK:
                    this.parse_block();
                    break;
                
                default: 
                    throw Error("Fatal Error: Parse Statement --> token has no matching non-terminal or terminal!");
            }// switch
        }// parse_statement

        private parse_print_statement(): void {
            this.match_token(KEYWORD_PRINT);
            this.match_token(SYMBOL_OPEN_ARGUMENT);
            this.parse_expression();
            this.match_token(SYMBOL_CLOSE_ARGUMENT);
        }// parse_print_statement

        private parse_assignment_statement(): void {
            this.parse_identifier();
            this.match_token(SYMBOL_ASSIGNMENT_OP);
            this.parse_expression();
        }// parse_assignment_statement

        private parse_variable_declaration(): void {
            this.parse_type();
            this.parse_identifier();
        }// parse_variable_declaration

        private parse_while_statement() {
            this.match_token(KEYWORD_WHILE);
            this.parse_boolean_expression();
            this.parse_block();
        }// parse_while_statement

        private parse_if_statement() {
            this.match_token(KEYWORD_IF);
            this.parse_boolean_expression();
            this.parse_block();
        }// parse_if_statement

        
        private match_token(expected_token_name: string): void {
            if (expected_token_name != this._current_token.name) {
                this.output.push(new OutputConsoleMessage(PARSER, ERROR, `Expected ${expected_token_name}, but got ${this._current_token}`));
            }// if
            this.consume_token();
            this.get_next_token();
        }// match_token

        /**
         * Checks for parse errors.
         * 
         * Uses the list of consumed tokens to throw parser errors. 
         * For example, this function will notice if a KEYWORD_PRINT_TOKEN 
         * is not followed by an OPEN_ARGUMENT_TOKEN and throw a parse error.
         */
        private consume_token() {
            
        }// consume_token

        private get_next_token() {
            this._current_token_index++;
            this._current_token = this._token_stream[this._current_program_number][this._current_token_index];
        }// advance_current_token_index

        private current_token_is_statement(): boolean {
            let statements: Array<string> = [
                KEYWORD_PRINT,
                KEYWORD_WHILE,
                KEYWORD_IF,
                IDENTIFIER,
                KEYWORD_TRUE,
                KEYWORD_FALSE,
                KEYWORD_INT,
                KEYWORD_STRING,
                SYMBOL_OPEN_BLOCK,
            ];

            for (let statement in statements) {
                if (this._current_token.name == statement) {
                    return true;
                }// if
            }// for

            return false;
        }// token_is_statement
    }// class
}// module