var NightingaleCompiler;
(function (NightingaleCompiler) {
    class CodeGeneration {
        constructor(_abstract_syntax_trees, _invalid_abstract_syntax_trees) {
            this._abstract_syntax_trees = _abstract_syntax_trees;
            this._invalid_abstract_syntax_trees = _invalid_abstract_syntax_trees;
            // Initialize output and verbose
            this.output = [[]];
            this.verbose = [[]];
            this.programs = [];
            this._current_program = null;
            this.static_tables = [];
            this._current_scope_tree = null;
            // this.main();
        } // constructor
        main() {
            for (var astIndex = 0; astIndex < this._abstract_syntax_trees.length; ++astIndex) {
                // New output array for each program
                this.output.push(new Array());
                this.verbose.push(new Array());
                console.log("AST's received: ");
                console.log(this._abstract_syntax_trees);
                console.log("Invalid AST's by program id: ");
                console.log(this._invalid_abstract_syntax_trees);
                // Skips invalid semantic analyzed programs
                if (!this._invalid_abstract_syntax_trees.includes(this._abstract_syntax_trees[astIndex].program)) {
                    console.log(`Performing code generation for: ${this._abstract_syntax_trees[astIndex].program + 1}`);
                    this.output[astIndex].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Performing Code Generation on program ${this._abstract_syntax_trees[astIndex].program + 1}...`) // OutputConsoleMessage
                    ); // this.output[astIndex].push
                    // Set current scope
                    this._current_scope_tree = this._abstract_syntax_trees[astIndex].scope_tree;
                    // Create a new image of the program
                    this._current_program = new NightingaleCompiler.ProgramModel();
                    this.programs.push(this._current_program);
                    // Create a new static table
                    this._current_static_table = new NightingaleCompiler.StaticTableModel();
                    this.static_tables.push(this._current_static_table);
                    // Traverse the valid AST, depth first in order, and generate code
                    this.code_gen(this._abstract_syntax_trees[astIndex].root, this._abstract_syntax_trees[astIndex].scope_tree.root.getScopeTable());
                    this.programs.push(this._current_program);
                    this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.output[astIndex].push
                    this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.verbose[astIndex].push
                    console.log(`Finished code generation on program ${astIndex + 1}.`);
                    console.log(this._current_program);
                    console.log(this._current_program.memory());
                    console.log(`Showing static table for program ${astIndex + 1}`);
                    console.log(this._current_static_table);
                } // if
                // Tell user: skipped the program
                else {
                    console.log(`Skipping code generation for: ${this._abstract_syntax_trees[astIndex].program + 1}`);
                    this.output[astIndex].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, WARNING, `Skipping program ${this._abstract_syntax_trees[astIndex].program + 1} due to semantic analysis errors.`));
                    this.verbose[astIndex].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, WARNING, `Skipping program ${this._abstract_syntax_trees[astIndex].program + 1} due to semantic analysis errors.`));
                } // else
            } // for
            this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with ${this._warning_count} warning(s)`) // OutputConsoleMessage
            ); // this.output[astIndex].push
            this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with  ${this._error_count} error(s)`) // OutputConsoleMessage
            ); // this.output[astIndex].push
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with ${this._warning_count} warning(s)`) // OutputConsoleMessage
            ); // this.verbose[astIndex].push
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with  ${this._error_count} error(s)`) // OutputConsoleMessage
            ); // this.verbose[astIndex].push
        } // main
        code_gen(current_node, current_scope_table) {
            switch (current_node.name) {
                case NODE_NAME_BLOCK:
                    this._code_gen_block(current_node, current_scope_table);
                    break;
                case NODE_NAME_VARIABLE_DECLARATION:
                    this._code_gen_variable_decalration(current_node, current_scope_table);
                    break;
                case NODE_NAME_ASSIGNMENT_STATEMENT:
                    this._code_gen_assignment_statement(current_node, current_scope_table);
                    break;
                case NODE_NAME_PRINT_STATEMENT:
                    this._code_gen_print_statement(current_node, current_scope_table);
                    break;
                case AST_NODE_NAME_IF:
                    this._code_gen_if_statement(current_node, current_scope_table);
                    break;
                case AST_NODE_NAME_WHILE:
                    this._code_gen_while_statement(current_node, current_scope_table);
                    break;
                default:
                    throw Error("ERROR: Invalid Node found on the AST: " + current_node.name);
            } // switch
        } // code_gen
        _code_gen_block(current_node, current_scope_table = null) {
            if (current_scope_table === null) {
                current_scope_table = current_node.getScopeTable();
            } // if
            console.log("Current Scope Table: ");
            console.log(current_scope_table.entries());
            for (let i = 0; i < current_node.children_nodes.length; ++i) {
                if (current_node.children_nodes[i].name === NODE_NAME_BLOCK) {
                    this._code_gen_block(current_node.children_nodes[i]);
                } // if
                else {
                    this.code_gen(current_node.children_nodes[i], current_scope_table);
                } // else
            } // for
        } // _code_gen_block
        /**
         * Generates 6502a op codes that reserves a memory location
         * in the programs stack for a variable that is initialized to zero.
         *
         * Remember, if you built your ast correctly..
         *   - Variabel Declaration ::== { StatementList }
         *    - Node(Variable Declaration).children[0] --> int | char list | boolean
         *    - Node(Variable Declaration).children[1] --> identifier
         *
         * @param cst_current_node current node in the ast.
         */
        _code_gen_variable_decalration(current_node, current_scope_table) {
            let type = current_node.children_nodes[0].name;
            let identifier = current_node.children_nodes[1].name;
            let static_table_size = this._current_static_table.size();
            // Make an entry in the static table, for later backtracking
            this._current_static_table.put(identifier, current_scope_table.id, new NightingaleCompiler.StaticDataMetadata(`T${static_table_size}`, `$$`, static_table_size)); // this._current_static_table.put
            // Integers and boolean
            if (type === INT) {
                console.log("Code generation for VarDecl(int)");
                // Initialize the variable to zero and store it in memory,
                // where the exact location is to be determined in backtracking.
                this._load_accumulator_with_constant("00");
            } // if 
            else if (type === BOOLEAN) {
                console.log("Code generation for VarDecl(boolean)");
                // Booleans get initialized to the string "false" in the heap
                this._load_accumulator_with_constant(this._current_program.getFalseAddress().toString(16).toUpperCase());
            } // else-if
            // Strings
            else if (type === STRING) {
                console.log("Code generation for VarDecl(string)");
                // Initialize strings to the string "null" in the heap
                this._load_accumulator_with_constant(this._current_program.getNullAddress().toString(16).toUpperCase());
            } // else-if
            else {
                throw Error(`Variable Declaration: AST variable declaration node uses an invalid type [${type}]!`);
            } // else
            this._store_accumulator_to_memory(`T${static_table_size}`, "$$");
        } // _code_gen_variable_decalration
        _code_gen_assignment_statement(current_node, current_scope_table) {
            return;
            throw Error("Unimplemented error: assignment statement code generation has not yet been implemented!");
        } // _code_gen_assignment_statement
        _code_gen_print_statement(print_node, current_scope_table) {
            // Printing a single value
            if (print_node.children_nodes.length === 1) {
                let value = print_node.children_nodes[0].name;
                // Value is an identifier
                if (new RegExp("^[a-z]$").test(value)) {
                    console.log("Code generation for print(identifier) ");
                    let type = current_scope_table.get(value).type;
                    // Get start location of string in heap
                    let metadata = this._current_static_table.get(value, current_scope_table.id);
                    // Get int value from static area or pointer to string in heap
                    this._load_y_register_from_memory(metadata.temp_address_leading_hex, metadata.temp_address_trailing_hex);
                    if (type === INT) {
                        this._load_x_register_with_constant("01");
                    } // if
                    else if (type === BOOLEAN || type === STRING) {
                        this._load_x_register_with_constant("02");
                    } // else-if
                    else {
                        throw Error(`Scope Table: identifier ${value} has invalid type [${type}]`);
                    } // else
                } // if
                // Not an identifier
                else {
                    // Integer
                    if (new RegExp("^[0-9]$").test(value)) {
                        console.log("Code generation for print(integer) ");
                        // Load constant to Y register
                        this._load_y_register_with_constant(this._convert_decimal_to_one_byte_hex(parseInt(value, 10)));
                        this._load_x_register_with_constant("01");
                    } // if
                    // Value is a boolean false
                    else if (new RegExp("^(false)$").test(value)) {
                        console.log("Code generation for print(false) ");
                        this._load_y_register_with_constant(this._current_program.getFalseAddress().toString(16).toUpperCase());
                        this._load_x_register_with_constant("02");
                    } // else-if
                    // Value is boolean true
                    else if (new RegExp("^(true)$").test(value)) {
                        console.log("Code generation for print(true) ");
                        this._load_y_register_with_constant(this._current_program.getTrueAddress().toString(16).toUpperCase());
                        this._load_x_register_with_constant("02");
                    } // else-if
                    // Value is string
                    else if (value.startsWith("\"")) {
                        console.log("Code generation for print(string) ");
                        // Make entry in heap for string
                        this._current_program.write_string_to_heap(value);
                        let pointer_to_string_in_heap = this._current_program.getHeapLimit().toString(16).toUpperCase();
                        this._load_y_register_with_constant(pointer_to_string_in_heap);
                        this._load_x_register_with_constant("02");
                    } // else-if
                } // else
            } //if
            // Printing an expression
            else {
                console.log("Code generation for print(expr) ");
            } // else
            // Print
            this.system_call();
        } // _code_gen_print_statement
        _code_gen_if_statement(if_node, current_scope_table) {
            this._code_gen_block(if_node.children_nodes[1]);
            return;
            throw Error("Unimplemented error: If statement code generation has not yet been implemented!");
        } // _code_gen_if_statement
        _code_gen_while_statement(while_node, current_scope_table) {
            this._code_gen_block(while_node.children_nodes[1]);
            return;
            throw Error("Unimplemented error: While statement code generation has not yet been implemented!");
        } // _code_gen_while_statement
        _code_gen_int_expression(int_op_node, current_scope_table) {
            // LDA [root integer]
            this._load_accumulator_with_constant(this._convert_decimal_to_one_byte_hex(parseInt(int_op_node.children_nodes[0].name, 10)));
            // Make an anoymous address entry in the static table, for later backtracking
            let static_table_size = this._current_static_table.size();
            let temp_location = "T" + static_table_size.toString(16).toUpperCase().padStart(3, "$");
            this._current_static_table.add_anonymous_address(new NightingaleCompiler.StaticDataMetadata(temp_location.substring(0, 2), temp_location.substring(2, 4), static_table_size) // StaticDataMetadata
            ); // this._current_static_table.put
            // STA TX XX
            this._store_accumulator_to_memory(temp_location.substring(0, 2), temp_location.substring(2, 4));
            // Recursively add integers to the root integer in 
            // the accumulator possibly ending on an integer expression.
            this._code_gen_addition(int_op_node, temp_location.substring(0, 2), temp_location.substring(2, 4), current_scope_table);
        } // _code_gen_int_expression
        _code_gen_addition(int_op_node, leading_hex_pair, trailing_hex_pair, current_scope_table) {
            // Load new left digit to the accumulator
            let left_integer = int_op_node.children_nodes[0].name;
            this._load_accumulator_with_constant(this._convert_decimal_to_one_byte_hex(parseInt(left_integer, 10)));
            // Add current sum from memory to left integer
            this._add_with_carry(leading_hex_pair, trailing_hex_pair);
            // Store result back in anonymous location
            this._store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair);
            // Integer plus [integer expression]
            if (int_op_node.children_nodes[1].name === AST_NODE_NAME_INT_OP) {
                this._code_gen_addition(int_op_node.children_nodes[1], leading_hex_pair, trailing_hex_pair, current_scope_table);
            } // if
            // Expression ends with an integer
            else if (new RegExp("^[0-9]$").test(int_op_node.children_nodes[1].name)) {
                // Load new right digit to the accumulator
                let right_integer = int_op_node.children_nodes[1].name;
                this._load_accumulator_with_constant(this._convert_decimal_to_one_byte_hex(parseInt(right_integer, 10)));
                // Add current sum from memory to left integer
                this._add_with_carry(leading_hex_pair, trailing_hex_pair);
                // Store result back in anonymous location
                this._store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair);
            } // else-if
            // Expression ends with an identifier
            else if (new RegExp("^[a-z]$").test(int_op_node.children_nodes[1].name)) {
                // Get start location of string in heap
                let identifier_metadata = this._current_static_table.get(int_op_node.children_nodes[1].name, current_scope_table.id);
                // Load new right digit to the accumulator
                this._load_accumulator_from_memory(identifier_metadata.temp_address_leading_hex, identifier_metadata.temp_address_trailing_hex);
                // Add current sum from memory to left integer
                this._add_with_carry(leading_hex_pair, trailing_hex_pair);
                // Store result back in anonymous location
                this._store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair);
            } // else-if
            else {
                throw Error(`Code Gen Addition Error: expted integer expression to end with [integer | identifier], but got ${int_op_node.children_nodes[1].name}`);
            } // else
        } // _code_gen_addition
        _code_gen_boolean_expression() { } // _code_gen_boolean_expression
        _convert_decimal_to_one_byte_hex(int) {
            if (int < 0) {
                throw Error(`Cannot write negative number [${int}] to memory.`);
            } // if
            else if (int > 255) {
                throw Error(`Cannot write a number [${int}] bigger than 1 byte to memory.`);
            } // if
            else {
                return int.toString(16).toUpperCase().padStart(2, "0");
            } // else
        } // convert_decimal_to_one_byte_hex
        /**
         * Load the accumulator with a constant.
         *
         * @param hex_pair_constant 1 byte constant being loaded into the accumulator
         */
        _load_accumulator_with_constant(hex_pair_constant) {
            console.log(`LDA [${hex_pair_constant}]`);
            this._current_program.write_to_code("A9");
            this._current_program.write_to_code(hex_pair_constant);
        } // loadAccumulatorWithConstant
        /**
         * Load the X register from memory.
         *
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        _load_accumulator_from_memory(leading_hex_pair, trailing_hex_pair) {
            console.log(`LDA [${leading_hex_pair} ${trailing_hex_pair}]`);
            this._current_program.write_to_code("AD");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // _load_accumulator_from_memory
        /**
         * Store the contents of the accumulator in memory.
         *
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        _store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair) {
            console.log(`STA [${leading_hex_pair} ${trailing_hex_pair}]`);
            this._current_program.write_to_code("8D");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // store_accumulator_to_memory
        /**
         * Adds contents of an address in memory to the contents
         * of the accumulator and keeps the result in the accumulator.
         *
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        _add_with_carry(leading_hex_pair, trailing_hex_pair) {
            this._current_program.write_to_code("6D");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // _add_with_carry
        /**
         * Load the X register with a constant.
         *
         * @param hex_pair_constant 1 byte constant being loaded into the X Register
         */
        _load_x_register_with_constant(hex_pair_constant) {
            console.log(`LDX [${hex_pair_constant}]`);
            this._current_program.write_to_code("A2");
            this._current_program.write_to_code(hex_pair_constant);
        } // load_x_register_with_constant
        /**
         * Load the X register from memory.
         *
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        _load_x_register_from_memory(leading_hex_pair, trailing_hex_pair) {
            console.log(`LDX [${leading_hex_pair} ${trailing_hex_pair}]`);
            this._current_program.write_to_code("AE");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // load_x_register_from_memory
        /**
         * Load the y-register with a constant.
         *
         * @param hex_pair_constant 1 byte constant being loaded into the Y register
         */
        _load_y_register_with_constant(hex_pair_constant) {
            console.log(`LDY [${hex_pair_constant}]`);
            this._current_program.write_to_code("A0");
            this._current_program.write_to_code(hex_pair_constant);
        } // _load_y_register_with_constant
        /**
         * Load the y-register from memory.
         *
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        _load_y_register_from_memory(leading_hex_pair, trailing_hex_pair) {
            console.log(`LDY [${leading_hex_pair} ${trailing_hex_pair}]`);
            this._current_program.write_to_code("AC");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // load_y_register_from_memory
        /**
         * Compares the contents of the X register to
         * the value stored at the specified memory location.
         *
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        _compare_x_register_to_memory(leading_hex_pair, trailing_hex_pair) {
            console.log(`CPX [${leading_hex_pair} ${trailing_hex_pair}]`);
            this._current_program.write_to_code("EC");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // compare_x_register_to_memory
        /**
         * Branches when the zero flag is set to 0.
         *
         * @param hex_pair number of bytes to skip
         */
        _branch_on_zero(hex_pair) {
            console.log(`BNE [${hex_pair}]`);
            this._current_program.write_to_code("D0");
            // Bytes to skip
            this._current_program.write_to_code(hex_pair);
        } // _branch_on_zero
        /**
         * Writes a system call.
         */
        system_call() {
            console.log(`SYS Call`);
            this._current_program.write_to_code("FF");
        } // system_call
    } //class
    NightingaleCompiler.CodeGeneration = CodeGeneration;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=code_generation.js.map