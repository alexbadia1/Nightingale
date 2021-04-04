/**
 * parser.ts
 *
 * Author: Alex Badia
 *
 * This is the Parsing stage of compilation.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class Parser {
        constructor(
        /**
         * A two-dimensional array of programs and their valid lexical tokens.
         */
        _token_stream = [[]], 
        /**
         * Lexically invalid programs. These programs should be skipped.
         */
        _lexically_invalid_programs = [], 
        /**
         * Current program in the token stream.
         */
        _current_program_number = 0, 
        /**
         * Current index in the current program's token stream.
         */
        _current_token_index = 0, 
        /**
         * Current token in the current program's token stream.
         */
        _current_token = null, _current_cst = new NightingaleCompiler.ConcreteSyntaxTree(null, null, 0), output = [[]], 
        /**
         * An array of tokens in the order that they are consumed
         */
        debug = [[]], invalid_parsed_programs = [], concrete_syntax_trees = [], _error_count = 0, _warning_count = 0) {
            this._token_stream = _token_stream;
            this._lexically_invalid_programs = _lexically_invalid_programs;
            this._current_program_number = _current_program_number;
            this._current_token_index = _current_token_index;
            this._current_token = _current_token;
            this._current_cst = _current_cst;
            this.output = output;
            this.debug = debug;
            this.invalid_parsed_programs = invalid_parsed_programs;
            this.concrete_syntax_trees = concrete_syntax_trees;
            this._error_count = _error_count;
            this._warning_count = _warning_count;
            // Get first token
            this._current_token = this._token_stream[this._current_program_number][this._current_token_index];
            this.parse_program();
        } // constructor
        parse_program() {
            if (this._error_count === 0) {
                this.output[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parsing Program ${this._current_program_number + 1}...`));
            }
            this._current_cst.add_node("Program", BRANCH);
            this.parse_block();
            this.match_token([END_OF_PROGRAM]);
            // this._current_cst.climb_one_level();
            if (this._current_program_number < this._token_stream.length // There are more programs to parse
                && this._current_token_index < this._token_stream[this._current_program_number].length // There are tokens in the program to parse
            ) {
                this.parse_program();
            } // if
        } // parse_program
        parse_block() {
            this._current_cst.add_node("Block", BRANCH);
            this.match_token([SYMBOL_OPEN_BLOCK]);
            this.parse_statement_list();
            this.match_token([SYMBOL_CLOSE_BLOCK]);
            this._current_cst.climb_one_level();
        } // parse_block
        parse_statement_list() {
            if (this.current_token_is_statement()) {
                this._current_cst.add_node("Statement List", BRANCH);
                //console.log(`Parse Statement List: ${this._current_token.name} -> true`);
                this.parse_statement();
                this.parse_statement_list();
                this._current_cst.climb_one_level();
            } // if
            else {
                // Do nothing, it's an empty production!
            } // else
        } // parse_statement_list
        parse_statement() {
            this._current_cst.add_node("Statement", BRANCH);
            switch (this._current_token.name) {
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
            } // switch
            this._current_cst.climb_one_level();
        } // parse_statement
        parse_print_statement() {
            this._current_cst.add_node("Print Statement", BRANCH);
            this.match_token([KEYWORD_PRINT]);
            this.match_token([SYMBOL_OPEN_ARGUMENT]);
            this.parse_expression();
            this.match_token([SYMBOL_CLOSE_ARGUMENT]);
            this._current_cst.climb_one_level();
        } // parse_print_statement
        parse_assignment_statement() {
            this._current_cst.add_node("Assignment Statement", BRANCH);
            this.parse_identifier();
            this.match_token([SYMBOL_ASSIGNMENT_OP]);
            this.parse_expression();
            this._current_cst.climb_one_level();
        } // parse_assignment_statement
        parse_variable_declaration() {
            this._current_cst.add_node("Variable Declaration", BRANCH);
            this.parse_type();
            this.parse_identifier();
            this._current_cst.climb_one_level();
        } // parse_variable_declaration
        parse_while_statement() {
            this._current_cst.add_node("While Statement", BRANCH);
            this.match_token([KEYWORD_WHILE]);
            this.parse_boolean_expression();
            this.parse_block();
            this._current_cst.climb_one_level();
        } // parse_while_statement
        parse_if_statement() {
            this._current_cst.add_node("If Statement", BRANCH);
            this.match_token([KEYWORD_IF]);
            this.parse_boolean_expression();
            this.parse_block();
            this._current_cst.climb_one_level();
        } // parse_if_statement
        parse_expression() {
            this._current_cst.add_node("Expression", BRANCH);
            switch (this._current_token.name) {
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
            } // switch
            this._current_cst.climb_one_level();
        } //parse_expression
        parse_int_expression() {
            this._current_cst.add_node("Int Expression", BRANCH);
            this.parse_digit();
            if (this._current_token.name == SYMBOL_INT_OP) {
                this.parse_int_operation();
                this.parse_expression();
            } // if
            this._current_cst.climb_one_level();
        } //parse_int_expression
        parse_string_expression() {
            this._current_cst.add_node("String Expression", BRANCH);
            this.match_token([STRING_EXPRESSION_BOUNDARY]);
            this.parse_character_list();
            this.match_token([STRING_EXPRESSION_BOUNDARY]);
            this._current_cst.climb_one_level();
        } //parse_string_expression
        parse_boolean_expression() {
            this._current_cst.add_node("Boolean Expression", BRANCH);
            if (this._current_token.name == SYMBOL_OPEN_ARGUMENT) {
                this.match_token([SYMBOL_OPEN_ARGUMENT]);
                this.parse_expression();
                this.parse_boolean_operation();
                this.parse_expression();
                this.match_token([SYMBOL_CLOSE_ARGUMENT]);
            } // if
            else {
                this.parse_boolean_value();
            } // else
            this._current_cst.climb_one_level();
        } //parse_boolean_expression
        parse_identifier() {
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
        } // parse_identifier
        parse_character_list() {
            if (this._current_token.name == CHARACTER) {
                this._current_cst.add_node("Character List", BRANCH);
                this.parse_character();
                this.parse_character_list();
                this._current_cst.climb_one_level();
            } // if
            else if (this._current_token.name == SPACE_SINGLE || this._current_token.name == SPACE_TAB) {
                this._current_cst.add_node("Character List", BRANCH);
                this.parse_space();
                this.parse_character_list();
                this._current_cst.climb_one_level();
            } // if
            else {
                // Epsilon, do nothing!
            } // else
        } // parse_character_list
        parse_type() {
            this._current_cst.add_node("Type", BRANCH);
            this.match_token([KEYWORD_INT, KEYWORD_STRING, KEYWORD_BOOLEAN]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Type --> token [${this._current_token.name}] is not type int | string | boolean!`);
        } // parse_type
        parse_character() {
            this._current_cst.add_node("Character", BRANCH);
            this.match_token([CHARACTER]);
            this._current_cst.climb_one_level();
        } // parse_character
        parse_space() {
            this._current_cst.add_node("Space", BRANCH);
            this.match_token([SPACE_SINGLE, SPACE_TAB]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Space --> token [${this._current_token.name}] is not a space or tab character!`);
        } // parse_space
        parse_digit() {
            this._current_cst.add_node("Digit", BRANCH);
            this.match_token([DIGIT]);
            this._current_cst.climb_one_level();
        } // parse_digit
        parse_boolean_operation() {
            this._current_cst.add_node("Boolean Operation", BRANCH);
            this.match_token([SYMBOL_BOOL_OP_EQUALS, SYMBOL_BOOL_OP_NOT_EQUALS]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Boolean Operation --> token ${this._current_token.name} is not a SYMBOL_BOOL_OP_EQUALS or SYMBOL_BOOL_OP_NOT_EQUALS!`);
        } // parse_boolean_operation
        parse_boolean_value() {
            this._current_cst.add_node("Boolean Value", BRANCH);
            this.match_token([KEYWORD_TRUE, KEYWORD_FALSE]);
            this._current_cst.climb_one_level();
            // throw Error(`Fatal Error: Parse Boolean Value --> token ${this._current_token.name} is not a true | false`);
        } // parse_boolean_operation
        parse_int_operation() {
            if (this._current_token.name == SYMBOL_INT_OP) {
                this._current_cst.add_node("Int Operation", BRANCH);
                this.match_token([SYMBOL_INT_OP]);
                this._current_cst.climb_one_level();
            } // if
        } // parse_int_operation
        match_token(expected_token_names) {
            if (!expected_token_names.includes(this._current_token.name)) {
                this._error_count++;
                console.log(`Expected ${expected_token_names.toString()}, `
                    + `but got [${this._current_token.name}] `
                    + `|${this._current_token.lexeme}| `
                    + `at ${this._current_token.lineNumber}:${this._current_token.linePosition}`);
                this.output[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, ERROR, `Expected ${expected_token_names.toString()}, `
                    + `but got [${this._current_token.name}] `
                    + `|${this._current_token.lexeme}| `
                    + `at ${this._current_token.lineNumber}:${this._current_token.linePosition}`) // OutputConsoleMessage
                ); // this.output.push
                this.debug[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, ERROR, `Expected ${expected_token_names.toString()}, `
                    + `but got [${this._current_token.name}] `
                    + `|${this._current_token.lexeme}| `
                    + `at ${this._current_token.lineNumber}:${this._current_token.linePosition}`) // OutputConsoleMessage
                ); // this.debug.push
                // Record that this program has an error, if no already done so
                if (!this.invalid_parsed_programs.includes(this._current_program_number)) {
                    this.invalid_parsed_programs.push(this._current_program_number);
                } // if
                return;
            } // if
            this.debug[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Valid token consumed: `
                + `[${this._current_token.name}] `
                + `|${this._current_token.lexeme}| `
                + `at ${this._current_token.lineNumber}:${this._current_token.linePosition}`) // OutputConsoleMessage
            ); // this.debug.push
            this._current_cst.add_node(this._current_token.lexeme, LEAF);
            this.consume_token();
            this.get_next_token();
        } // match_token
        /**
         * Checks for parse errors.
         *
         * Uses the list of consumed tokens to throw parser errors.
         * For example, this function will notice if a KEYWORD_PRINT_TOKEN
         * is not followed by an OPEN_ARGUMENT_TOKEN and throw a parse error.
         */
        consume_token() {
            console.log(`Consumed ${this._current_token.name}`);
        } // consume_token
        get_next_token() {
            this._current_token_index++;
            // Ran out of tokens in the current program
            if (this._current_token_index >= this._token_stream[this._current_program_number].length) {
                // Finished parsing program #: # errors, # warnings
                this.output[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser finished parsing program ${this._current_program_number + 1}.`));
                this.debug[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser finished parsing program ${this._current_program_number + 1}.`));
                // Get next program and reset pointers
                this._current_program_number++;
                this._current_token_index = 0;
                // Make room for next programs output
                this.output.push(new Array());
                this.debug.push(new Array());
                checkIfProgramIsValid: while (this._current_program_number < this._token_stream.length) {
                    if (this._lexically_invalid_programs.includes(this._current_program_number)) {
                        // Program is invalid, skip due to lex error
                        this.output[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser skipped parsing program ${this._current_program_number + 1} due to Lex Errors.`));
                        this.debug[this._current_program_number].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser skipped parsing program ${this._current_program_number + 1} due to Lex Errors.`));
                        // Record the invalid lex program as an invalid parse program
                        if (!this.invalid_parsed_programs.includes(this._current_program_number)) {
                            this.invalid_parsed_programs.push(this._current_program_number);
                        } // if
                        this._current_program_number++;
                        this.output.push(new Array());
                        this.debug.push(new Array());
                        break checkIfProgramIsValid;
                    } // if
                    else {
                        // The next program is valid stop checking for another valid program
                        break checkIfProgramIsValid;
                    } // else
                } // while
                // Push tree into the valid stack of trees
                this.concrete_syntax_trees.push(this._current_cst);
                // Make room for another tree
                this._current_cst = new NightingaleCompiler.ConcreteSyntaxTree(null, null, this._current_program_number);
            } // if
            // Ran out of programs
            if (this._current_program_number >= this._token_stream.length) {
                // Finished parsing all programs: # errors, # warnings
                this.output[this._current_program_number - 1].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser completed with ${this._warning_count} warnings.`));
                this.output[this._current_program_number - 1].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser completed with ${this._error_count} errors.`));
                this.debug[this._current_program_number - 1].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser completed with ${this._warning_count} warnings.`));
                this.debug[this._current_program_number - 1].push(new NightingaleCompiler.OutputConsoleMessage(PARSER, INFO, `Parser completed with ${this._error_count} errors.`));
                return;
            } // if
            this._current_token = this._token_stream[this._current_program_number][this._current_token_index];
            console.log(`Retrieved next Token [${this._current_token.name}], Lexeme % ${this._current_token.lexeme} %`);
        } // get_next_token
        current_token_is_statement() {
            let statements = [
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
                } // if
            } // for
            return false;
        } // token_is_statement
    } // class
    NightingaleCompiler.Parser = Parser;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=parser.js.map