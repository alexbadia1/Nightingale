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

            private _current_cst: ConcreteSyntaxTree = new ConcreteSyntaxTree(),

            public output: Array<Array<OutputConsoleMessage>> = [[]],
            public invalid_parsed_programs: Array<number> = [],
            public concrete_syntax_trees: Array<ConcreteSyntaxTree> = [],

        ){
            // Get first token
            this._current_token = this._token_stream[this._current_program_number][this._current_token_index];
            this.parse_program();
        }// constructor

        public parse_program(): void {
            console.log(`Parsing Program ${this._current_program_number}...`);
            this._current_cst.add_node("Program", BRANCH);
            this.parse_block();
            this.match_token([END_OF_PROGRAM]);
            // this._current_cst.climb_one_level();
            if (
                this._current_program_number < this._token_stream.length // There are more programs to parse
                && this._current_token_index < this._token_stream[this._current_program_number].length // There are tokens in the program to parse
            ) {
                this.parse_program();
            }// if
        }// parse_program

        private parse_block(): void {
            this._current_cst.add_node("Block", BRANCH);
            this.match_token([SYMBOL_OPEN_BLOCK]);
            this.parse_statement_list();
            this.match_token([SYMBOL_CLOSE_BLOCK]);
            this._current_cst.climb_one_level();
        }// parse_block

        private parse_statement_list(): void {
            if (this.current_token_is_statement()) {
                this._current_cst.add_node("Statement List", BRANCH);
                //console.log(`Parse Statement List: ${this._current_token.name} -> true`);
                this.parse_statement();
                this.parse_statement_list();
                this._current_cst.climb_one_level();
            }// if

            else {
                // Do nothing, it's an empty production!
            }// else
        }// parse_statement_list

        private parse_statement(): void {
            this._current_cst.add_node("Statement", BRANCH);
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
                    throw Error(`Fatal Error: Parse Statement --> token [${this._current_token.name}] has no matching non-terminal or terminal!`);
            }// switch

            this._current_cst.climb_one_level();
        }// parse_statement

        private parse_print_statement(): void {
            this._current_cst.add_node("Print Statement", BRANCH);
            this.match_token([KEYWORD_PRINT]);
            this.match_token([SYMBOL_OPEN_ARGUMENT]);
            this.parse_expression();
            this.match_token([SYMBOL_CLOSE_ARGUMENT]);
            this._current_cst.climb_one_level();
        }// parse_print_statement

        private parse_assignment_statement(): void {
            this._current_cst.add_node("Assignment Statement", BRANCH);
            this.parse_identifier();
            this.match_token([SYMBOL_ASSIGNMENT_OP]);
            this.parse_expression();
            this._current_cst.climb_one_level();
        }// parse_assignment_statement

        private parse_variable_declaration(): void {
            this._current_cst.add_node("Variable Declaration", BRANCH);
            this.parse_type();
            this.parse_identifier();
            this._current_cst.climb_one_level();
        }// parse_variable_declaration

        private parse_while_statement(): void {
            this._current_cst.add_node("While Statement", BRANCH);
            this.match_token([KEYWORD_WHILE]);
            this.parse_boolean_expression();
            this.parse_block();
            this._current_cst.climb_one_level();
        }// parse_while_statement

        private parse_if_statement(): void {
            this._current_cst.add_node("If Statement", BRANCH);
            this.match_token([KEYWORD_IF]);
            this.parse_boolean_expression();
            this.parse_block();
            this._current_cst.climb_one_level();
        }// parse_if_statement

        private parse_expression(): void {
            this._current_cst.add_node("Expression", BRANCH);
            switch (this._current_token.name){
                // Int expressions must start with a DIGIT
                case DIGIT:
                    this.parse_int_expression();
                    break;

                // Strings must start with a STRING EXPRESSION BOUNDARY
                case STRING_EXPRESSION_BOUNDARY:
                    this.parse_string_expression();
                    break;
                
                // All boolean expressions must start with (
                case SYMBOL_OPEN_ARGUMENT:
                    this.parse_boolean_expression();
                    break;
                
                case IDENTIFIER:
                    this.parse_identifier();
                    break;
                
                default:
                    throw Error("Fatal Error: Parse Expression --> token has no matching non-terminal or terminal!");
            }// switch
            this._current_cst.climb_one_level();
        }//parse_expression

        private parse_int_expression(): void {
            this._current_cst.add_node("Int Expression", BRANCH);
            this.parse_digit();

            if (this._current_token.name == SYMBOL_INT_OP) {
                this.parse_int_operation();
                this.parse_expression();
            }// if
            this._current_cst.climb_one_level();
        }//parse_int_expression

        private parse_string_expression(): void {
            this._current_cst.add_node("String Expression", BRANCH);
            this.match_token([STRING_EXPRESSION_BOUNDARY]);
            this.parse_character_list();
            this.match_token([STRING_EXPRESSION_BOUNDARY]);
            this._current_cst.climb_one_level();
        }//parse_string_expression

        private parse_boolean_expression(): void {
            this._current_cst.add_node("Boolean Expression", BRANCH);
            if (this._current_token.name == SYMBOL_OPEN_ARGUMENT) {
                this.match_token([SYMBOL_OPEN_ARGUMENT]);
                this.parse_expression();
                this.parse_boolean_operation();
                this.parse_expression();
                this.match_token([SYMBOL_CLOSE_ARGUMENT]);
            }// if

            else {
                this.parse_boolean_value();
            }// else
            this._current_cst.climb_one_level();
        }//parse_boolean_expression

        private parse_identifier(): void {
            /**
             * Technicaly the grammar defines 
             * identifiers as a superset of characters so:
             * 
             *  this.parse_character();
             * 
             * But this leads to annoying and unnecessary type checking, 
             * so skipping to matching the token instead...
             */

            this._current_cst.add_node("Identifier", BRANCH);
            this.match_token([IDENTIFIER]);
            this._current_cst.climb_one_level();
        }// parse_identifier

        private parse_character_list(): void {
            if (this._current_token.name == CHARACTER) {
                this._current_cst.add_node("Character List", BRANCH);
                this.parse_character();
                this.parse_character_list();
                this._current_cst.climb_one_level();
            }// if

            else if (this._current_token.name == SPACE_SINGLE || this._current_token.name == SPACE_TAB) {
                this._current_cst.add_node("Character List", BRANCH);
                this.parse_space();
                this.parse_character_list();
                this._current_cst.climb_one_level();
            }// if

            else {
                // Epsilon, do nothing!
            }// else
        }// parse_character_list

        private parse_type():void {
            this._current_cst.add_node("Type", BRANCH);
            this.match_token([KEYWORD_INT, KEYWORD_STRING, KEYWORD_BOOLEAN]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Type --> token [${this._current_token.name}] is not type int | string | boolean!`);
        }// parse_type

        private parse_character(): void {
            this._current_cst.add_node("Character", BRANCH);
            this.match_token([CHARACTER]);
            this._current_cst.climb_one_level();
        }// parse_character

        private parse_space(): void {
            this._current_cst.add_node("Space", BRANCH);
            this.match_token([SPACE_SINGLE, SPACE_TAB]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Space --> token [${this._current_token.name}] is not a space or tab character!`);
        }// parse_space

        private parse_digit(): void {
            this._current_cst.add_node("Digit", BRANCH);
            this.match_token([DIGIT]);
            this._current_cst.climb_one_level();
        }// parse_digit

        private parse_boolean_operation(): void {
            this._current_cst.add_node("Boolean Operation", BRANCH);
            this.match_token([SYMBOL_BOOL_OP_EQUALS, SYMBOL_BOOL_OP_NOT_EQUALS]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Boolean Operation --> token ${this._current_token.name} is not a SYMBOL_BOOL_OP_EQUALS or SYMBOL_BOOL_OP_NOT_EQUALS!`);
        }// parse_boolean_operation

        private parse_boolean_value(): void {
            this._current_cst.add_node("Boolean Value", BRANCH);
            this.match_token([KEYWORD_TRUE, KEYWORD_FALSE]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Boolean Value --> token ${this._current_token.name} is not a true | false`);
        }// parse_boolean_operation

        private parse_int_operation(): void {
            if (this._current_token.name == SYMBOL_INT_OP) {
                this._current_cst.add_node("Int Operation", BRANCH);
                this.match_token([SYMBOL_INT_OP]);
                this._current_cst.climb_one_level();
            }// if
        }// parse_int_operation
        
        private match_token(expected_token_names: Array<string>): void {
            if (!expected_token_names.includes(this._current_token.name)) {
                console.log(
                    `Expected ${expected_token_names.toString()}, ` 
                    +`but got [${this._current_token.name}] `
                    +`|${this._current_token.lexeme}| `
                    +`at ${this._current_token.lineNumber}:${this._current_token.linePosition}`
                );
                this.output[this._current_program_number].push(
                    new OutputConsoleMessage(
                        PARSER, 
                        ERROR, 
                        `Expected ${expected_token_names.toString()}, ` 
                        +`but got [${this._current_token.name}] `
                        +`|${this._current_token.lexeme}| `
                        +`at ${this._current_token.lineNumber}:${this._current_token.linePosition}`
                    )// OutputConsoleMessage
                );// this.output.push

                // Record that this program has an error, if no already done so
                if(!this.invalid_parsed_programs.includes(this._current_program_number)){
                    this.invalid_parsed_programs.push(this._current_program_number)
                }// if
                return;
            }// if
            this._current_cst.add_node(this._current_token.lexeme, LEAF);
            // this._current_cst.climb_one_level();
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
        private consume_token(): void {
            console.log(`Consumed ${this._current_token.name}`);
        }// consume_token

        private get_next_token(): void {
            this._current_token_index++;

            // Ran out of tokens in the current program
            if (this._current_token_index >= this._token_stream[this._current_program_number].length) {
                this._current_program_number++;
                this.output.push(new Array<OutputConsoleMessage>());
                this._current_token_index = 0;
                this.concrete_syntax_trees.push(this._current_cst);
                this._current_cst = new ConcreteSyntaxTree();
            }// if

            // Ran out of programs
            if (this._current_program_number >= this._token_stream.length) {
                return;
            }// if

            this._current_token = this._token_stream[this._current_program_number][this._current_token_index];
            console.log(`Retrieved next Token [${this._current_token.name}], Lexeme % ${this._current_token.lexeme} %`);
        }// get_next_token

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

            for (let statement of statements) {
                if (this._current_token.name == statement) {
                    return true;
                }// if
            }// for
            return false;
        }// token_is_statement
    }// class
}// module