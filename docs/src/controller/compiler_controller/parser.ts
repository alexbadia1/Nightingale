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
            /**
             * A two-dimensional array of programs and their valid lexical tokens.
             */
            private token_stream: Array<Array<LexicalToken>> = [[]],

            /**
             * Lexically invalid programs. These programs should be skipped.
             */
            private lexically_invalid_programs: Array<number> = [],

            /**
             * Current program number in the token stream.
             */
            private current_program_number: number = 0,

            /**
             * Current token in the program's token stream.
             */
            private current_token_index: number = 0,
        ){}// constructor

        private match_token() {

        }// match_token

        private consume_token() {
            this.current_token_index++;
        }// consume_token
    }// class
}// module