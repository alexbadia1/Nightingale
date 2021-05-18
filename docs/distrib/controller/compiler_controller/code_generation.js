var NightingaleCompiler;
(function (NightingaleCompiler) {
    class CodeGeneration {
        constructor(_abstract_syntax_trees, _invalid_abstract_syntax_trees) {
            this._abstract_syntax_trees = _abstract_syntax_trees;
            this._invalid_abstract_syntax_trees = _invalid_abstract_syntax_trees;
            // Initialize output and verbose
            this.output = new Array();
            this.verbose = new Array();
            // Keep track of code generated from programs
            // and the current program being used for code generation.
            this.programs = new Array();
            this._current_program = null;
            // Keep track of each programs static tables
            this.static_tables = new Array();
            this.main();
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
                    // Create a new image of the program
                    this._current_program = new NightingaleCompiler.ProgramModel();
                    this.programs.push(this._current_program);
                    // Create a new static table
                    this._current_static_table = new NightingaleCompiler.StaticTableModel();
                    this.static_tables.push(this._current_static_table);
                    // Keep track of strings already in the heap
                    this._current_static_table.put_new_string("null", this._convert_decimal_to_one_byte_hex(this._current_program.get_null_address()));
                    this._current_static_table.put_new_string("true", this._convert_decimal_to_one_byte_hex(this._current_program.get_true_address()));
                    this._current_static_table.put_new_string("false", this._convert_decimal_to_one_byte_hex(this._current_program.get_false_address()));
                    // Traverse the valid AST, depth first in order, and generate code
                    this.code_gen(this._abstract_syntax_trees[astIndex].root, this._abstract_syntax_trees[astIndex].scope_tree.root.getScopeTable());
                    // Teminate the program with a break, so the operating system doesn't read into the static area or heap!
                    this._current_program.write_to_code("00");
                    // Back patch temp variables
                    this._back_patch();
                    this.programs.push(this._current_program);
                    this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.output[this.output.length - 1].push
                    this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.verbose[this.output.length - 1].push
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
            if (this.output.length === 0) {
                this.output.push(new Array());
            } // if
            this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with ${this._warning_count} warning(s)`) // OutputConsoleMessage
            ); // this.output[this.output.length - 1].push
            this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with  ${this._error_count} error(s)`) // OutputConsoleMessage
            ); // this.output[this.output.length - 1].push
            if (this.verbose.length === 0) {
                this.verbose.push(new Array());
            } // if
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with ${this._warning_count} warning(s)`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Code Generation completed with  ${this._error_count} error(s)`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
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
            // Find scope table that contains the identifer
            let scope_table_with_identifier = this._get_scope_table_with_identifier(identifier, current_scope_table);
            // Make an entry in the static table, for later backtracking
            let temp_location = "T" + static_table_size.toString(16).toUpperCase().padStart(3, "$");
            this._current_static_table.put(identifier, scope_table_with_identifier.id, new NightingaleCompiler.StaticDataMetadata(temp_location.substring(0, 2), temp_location.substring(2, 4), static_table_size) // StaticDataMetadata
            ); // this._current_static_table.put
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
                this._load_accumulator_with_constant(this._current_program.get_false_address().toString(16).toUpperCase());
            } // else-if
            // Strings
            else if (type === STRING) {
                console.log("Code generation for VarDecl(string)");
                // Initialize strings to the string "null" in the heap
                this._load_accumulator_with_constant(this._current_program.get_null_address().toString(16).toUpperCase());
            } // else-if
            else {
                throw Error(`Variable Declaration: AST variable declaration node uses an invalid type [${type}]!`);
            } // else
            this._store_accumulator_to_memory(temp_location.substring(0, 2), temp_location.substring(2, 4));
        } // _code_gen_variable_decalration
        _code_gen_assignment_statement(assignment_statement_node, current_scope_table) {
            let identifier = assignment_statement_node.children_nodes[0].name;
            let right_child_node_value = assignment_statement_node.children_nodes[1].name;
            // Find scope table with the identifier
            let scope_table_with_left_identifier = this._get_scope_table_with_identifier(identifier, current_scope_table);
            // Get left hand variable location
            let left_id_metadata = null;
            // Given a valid AST, eventually a declared variable should be found
            while (left_id_metadata === null && scope_table_with_left_identifier !== null) {
                left_id_metadata = this._current_static_table.get(identifier, scope_table_with_left_identifier.id);
                if (left_id_metadata === null) {
                    scope_table_with_left_identifier = this._get_scope_table_with_identifier(identifier, scope_table_with_left_identifier.parent_scope_table);
                } // if
            } // while
            // Assigning to another identifier
            if (new RegExp("^[a-z]$").test(right_child_node_value)) {
                console.log("Code generation for Assigment Statement(identifier) ");
                // Find scope table with the identifier
                let scope_table_with_right_identifier = this._get_scope_table_with_identifier(right_child_node_value, current_scope_table);
                // Get right hand variable location
                let right_id_metadata = null;
                // Given a valid AST, eventually a declared variable should be found
                while (right_id_metadata === null && scope_table_with_right_identifier !== null) {
                    right_id_metadata = this._current_static_table.get(right_child_node_value, scope_table_with_right_identifier.id);
                    if (right_id_metadata === null) {
                        scope_table_with_right_identifier = this._get_scope_table_with_identifier(right_child_node_value, scope_table_with_right_identifier.parent_scope_table);
                    } // if
                } // while
                // Load accumulator with right hand variable value
                this._load_accumulator_from_memory(right_id_metadata.temp_address_leading_hex, right_id_metadata.temp_address_trailing_hex);
            } // if
            // Not an identifier
            else {
                // Integer
                if (new RegExp("^[0-9]$").test(right_child_node_value)) {
                    console.log("Code generation for Assigment Statement(integer) ");
                    // Load accumulator with right hand integer
                    this._load_accumulator_with_constant(this._convert_decimal_to_one_byte_hex(parseInt(right_child_node_value, 10)));
                } // if
                // Value is a boolean false
                else if (new RegExp("^(false)$").test(right_child_node_value)) {
                    console.log("Code generation for Assigment Statement(false) ");
                    // Load the accumulator with pointer to "false" in the heap
                    this._load_accumulator_with_constant(this._current_program.get_false_address().toString(16).toUpperCase());
                } // else-if
                // Value is boolean true
                else if (new RegExp("^(true)$").test(right_child_node_value)) {
                    console.log("Code generation for Assigment Statement(true) ");
                    // Load the accumulator with pointer to "true" in the heap
                    this._load_accumulator_with_constant(this._current_program.get_true_address().toString(16).toUpperCase());
                } // else-if
                // String expression
                else if (right_child_node_value.startsWith("\"")) {
                    console.log("Code generation for Assigment Statement(string expr) ");
                    let str = right_child_node_value.split("\"").join("");
                    // Check if string is already in heap
                    let string_in_heap_address = this._current_static_table.get_string_in_heap(str);
                    // String already exists in the heap, point to it instead of making a new entry.
                    if (string_in_heap_address !== null) {
                        console.log(`String already exists in heap starting at: ${string_in_heap_address}`);
                        this._load_accumulator_with_constant(string_in_heap_address);
                    } // if
                    // Make new entry in heap for new string
                    else {
                        let string_start_address = this._current_program.write_string_to_heap(str);
                        console.log(`String does not exist in heap writing new string starting at: ${string_start_address}`);
                        this._current_static_table.put_new_string(str, string_start_address);
                        this._load_accumulator_with_constant(string_start_address);
                    } // else
                } // else-if
                // Integer Expression
                else if (right_child_node_value === AST_NODE_NAME_INT_OP) {
                    console.log("Code generation for print(int expr) ");
                    // memory_address_of_sum[0] = leading_hex_byte
                    // memory_address_of_sum[1] = trailing_hex_byte
                    let memory_address_of_sum = this._code_gen_int_expression(assignment_statement_node.children_nodes[1], null, null, current_scope_table);
                    // Load the Y register with the sum of the integer expression
                    this._load_accumulator_from_memory(memory_address_of_sum[0], memory_address_of_sum[1]);
                } // else-if
                // Boolean expression
                else if (right_child_node_value === AST_NODE_NAME_BOOLEAN_EQUALS || right_child_node_value == AST_NODE_NAME_BOOLEAN_NOT_EQUALS) {
                    console.log("Code generation for print(boolean expr) ");
                } // else-if
                else {
                    throw Error(`Code Gen Print --> Expected [Int | Boolean Value | StringExpr | IntExpr | BooleanExpr], but got ${right_child_node_value}`);
                } // else
            } // else
            // Store accumulator in the left hand identifier address
            this._store_accumulator_to_memory(left_id_metadata.temp_address_leading_hex, left_id_metadata.temp_address_trailing_hex);
        } // _code_gen_assignment_statement
        /**
         * Prints the argument to standard output.
         *
         * If the abstract syntax tree was built correctly,
         * then the print node should only have one child node.
         *
         * @param print_node ast parent print node.
         * @param current_scope_table current scope used for identifier lookups.
         */
        _code_gen_print_statement(print_node, current_scope_table) {
            let value = print_node.children_nodes[0].name;
            // Value is an identifier
            if (new RegExp("^[a-z]$").test(value)) {
                console.log("Code generation for print(identifier) ");
                // Find scope with the identifier
                let scope_table_with_identifier = this._get_scope_table_with_identifier(value, current_scope_table);
                let type = null;
                // Get start location of string in heap
                let metadata = null;
                // Given a valid AST, eventually a declared variable should be found
                while (metadata === null && scope_table_with_identifier !== null) {
                    metadata = this._current_static_table.get(value, scope_table_with_identifier.id);
                    type = scope_table_with_identifier.get(value).type;
                    if (metadata === null) {
                        scope_table_with_identifier = this._get_scope_table_with_identifier(value, scope_table_with_identifier.parent_scope_table);
                    } // if
                } // while
                // Get int value from static area or pointer to string in heap
                this._load_y_register_from_memory(metadata.temp_address_leading_hex, metadata.temp_address_trailing_hex);
                if (type === INT) {
                    this._load_x_register_with_constant("01");
                } // if
                else if (type === BOOLEAN || type === STRING) {
                    this._load_x_register_with_constant("02");
                } // else-if
                else {
                    throw Error(`Code gen Print --> Scope Table: identifier ${value} has invalid type [${type}]`);
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
                    this._load_y_register_with_constant(this._current_program.get_false_address().toString(16).toUpperCase());
                    this._load_x_register_with_constant("02");
                } // else-if
                // Value is boolean true
                else if (new RegExp("^(true)$").test(value)) {
                    console.log("Code generation for print(true) ");
                    this._load_y_register_with_constant(this._current_program.get_true_address().toString(16).toUpperCase());
                    this._load_x_register_with_constant("02");
                } // else-if
                // String expression
                else if (value.startsWith("\"")) {
                    console.log("Code generation for print(string expr) ");
                    let str = value.split("\"").join("");
                    // Check if string is already in heap
                    let string_in_heap_address = this._current_static_table.get_string_in_heap(str);
                    // String already exists in the heap, point to it instead of making a new entry.
                    if (string_in_heap_address !== null) {
                        console.log(`String already exists in heap starting at: ${string_in_heap_address}`);
                        this._load_y_register_with_constant(string_in_heap_address);
                    } // if
                    // Make new entry in heap for new string
                    else {
                        let string_start_address = this._current_program.write_string_to_heap(str);
                        console.log(`String does not exist in heap writing new string starting at: ${string_start_address}`);
                        this._current_static_table.put_new_string(str, string_start_address);
                        this._load_y_register_with_constant(string_start_address);
                    } // else
                    this._load_x_register_with_constant("02");
                } // else-if
                // Integer Expression
                else if (print_node.children_nodes[0].name === AST_NODE_NAME_INT_OP) {
                    console.log("Code generation for print(int expr) ");
                    // memory_address_of_sum[0] = leading_hex_byte
                    // memory_address_of_sum[1] = trailing_hex_byte
                    let memory_address_of_sum = this._code_gen_int_expression(print_node.children_nodes[0], null, null, current_scope_table);
                    // Load the Y register with the sum of the integer expression
                    this._load_y_register_from_memory(memory_address_of_sum[0], memory_address_of_sum[1]);
                    // Print out number
                    this._load_x_register_with_constant("01");
                } // if
                // Boolean expression
                else if (print_node.children_nodes[0].name === AST_NODE_NAME_BOOLEAN_EQUALS || print_node.children_nodes[0].name == AST_NODE_NAME_BOOLEAN_NOT_EQUALS) {
                    console.log("Code generation for print(boolean expr) ");
                } // else-if
                else {
                    throw Error(`Code Gen Print --> Expected [Int | Boolean Value | StringExpr | IntExpr | BooleanExpr], but got ${print_node.children_nodes[0].name}`);
                } // else
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
        /**
         * Recursively adds two two numbers of an integer expression.
         *
         * The left child integer (addend) is loaded into the accumulator. Then
         * the current sum is added to the left child integer that was stored in the
         * accumulator. Finally, the new sum is stored back in memory, at the same address
         * of the old sum, effectively replacing the old sum with the new sum.
         *
         * @param int_op_node ast parent node to the two addends.
         * @param leading_hex_pair leading byte of memory address where the sum is stored.
         * @param trailing_hex_pair trailing byte of memory address where the sum is stored.
         * @param current_scope_table current scope table used to perform identifier lookups.
         * @returns the address in memory where the sum is stored.
         */
        _code_gen_int_expression(int_op_node, leading_hex_pair, trailing_hex_pair, current_scope_table) {
            // Load new left digit to the accumulator
            let left_integer = int_op_node.children_nodes[0].name;
            this._load_accumulator_with_constant(this._convert_decimal_to_one_byte_hex(parseInt(left_integer, 10)));
            // Base case, make new entry in static table
            if (leading_hex_pair === null && trailing_hex_pair === null) {
                // Make an anoymous address entry in the static table, for later backtracking
                let static_table_size = this._current_static_table.size();
                let temp_location = "T" + static_table_size.toString(16).toUpperCase().padStart(3, "$");
                this._current_static_table.add_anonymous_address(new NightingaleCompiler.StaticDataMetadata(temp_location.substring(0, 2), temp_location.substring(2, 4), static_table_size) // StaticDataMetadata
                ); // this._current_static_table.put
                leading_hex_pair = temp_location.substring(0, 2);
                trailing_hex_pair = temp_location.substring(2, 4);
            } // if
            // Not base case, add current sum from memory to left integer
            else {
                this._add_with_carry(leading_hex_pair, trailing_hex_pair);
            } // else
            // Store result back in anonymous location
            this._store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair);
            // Integer plus [integer expression]
            if (int_op_node.children_nodes[1].name === AST_NODE_NAME_INT_OP) {
                return this._code_gen_int_expression(int_op_node.children_nodes[1], leading_hex_pair, trailing_hex_pair, current_scope_table);
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
                return [leading_hex_pair, trailing_hex_pair];
            } // else-if
            // Expression ends with an identifier
            else if (new RegExp("^[a-z]$").test(int_op_node.children_nodes[1].name)) {
                // Search for scope table with ID
                let scope_table_with_identifier = this._get_scope_table_with_identifier(int_op_node.children_nodes[1].name, current_scope_table);
                // Get start location of string in heap
                let identifier_metadata = this._current_static_table.get(int_op_node.children_nodes[1].name, scope_table_with_identifier.id);
                // Load new right digit to the accumulator
                this._load_accumulator_from_memory(identifier_metadata.temp_address_leading_hex, identifier_metadata.temp_address_trailing_hex);
                // Add current sum from memory to left integer
                this._add_with_carry(leading_hex_pair, trailing_hex_pair);
                // Store result back in anonymous location
                this._store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair);
                return [leading_hex_pair, trailing_hex_pair];
            } // else-if
            else {
                throw Error(`Code Gen Addition Error: expted integer expression to end with [integer | identifier], but got ${int_op_node.children_nodes[1].name}`);
            } // else
        } // _code_gen_int_expression
        _code_gen_boolean_expression() {
        } // _code_gen_boolean_expression
        /**
         * Back patches identifiers' temporary addresses and anonymous temporary addresses.
         */
        _back_patch() {
            // Initialize stack base and limit
            this._current_program.initialize_stack();
            // Back patch all identifiers using the static area
            console.log(`Back patching identifiers...`);
            for (let identifier_metadata of this._current_static_table.values()) {
                // Convert the logical stack address to a physical address in memory
                let physical_address = (this._current_program.get_stack_base() + identifier_metadata.logical_stack_address).toString(16).toUpperCase().padStart(4, "0");
                let leading_hex_byte = physical_address.substring(0, 2);
                let trailing_hex_byte = physical_address.substring(2, 4);
                console.log(`Identifier [${identifier_metadata.temp_address_leading_hex} ${identifier_metadata.temp_address_trailing_hex}] patched with [${physical_address}].`);
                // Search for occurences of the temp address in the code area to backpatch
                for (let logical_address = 0; logical_address < this._current_program.get_code_area_size(); ++logical_address) {
                    // Found temp variable
                    if (this._current_program.read_code_area(logical_address) === identifier_metadata.temp_address_leading_hex) {
                        if (logical_address !== 0) {
                            if (this._current_program.read_code_area(logical_address - 1) === identifier_metadata.temp_address_trailing_hex) {
                                // Back patch the leading byte...
                                //
                                // Since we are using 256 bytes, we only need to worry about
                                // 1 byte addresses, so the leading byte in this case should always be: "00"
                                this._current_program.write_to_code(leading_hex_byte, logical_address);
                                // Back patch trailing byte
                                //
                                // Remember the ordering is reversed in memory, as it was an 
                                // optimization for direct addressing with no offset for the 6502a...
                                this._current_program.write_to_code(trailing_hex_byte, logical_address - 1);
                            } // if
                        } // if
                    } // if
                } // for
                // Replace static table entry's current temp address with the real static area address
                identifier_metadata.temp_address_leading_hex = leading_hex_byte;
                identifier_metadata.temp_address_trailing_hex = trailing_hex_byte;
            } // for
            // Back patch anonymous address
            console.log(`Back patching anonymous addresses...`);
            for (let temp_anonymous_address of this._current_static_table.get_anonymous_address()) {
                // Convert the logical stack address to a physical address in memory
                let physical_address = (this._current_program.get_stack_base() + temp_anonymous_address.logical_stack_address).toString(16).toUpperCase().padStart(4, "0");
                let leading_hex_byte = physical_address.substring(0, 2);
                let trailing_hex_byte = physical_address.substring(2, 4);
                console.log(`Anonymous address [${temp_anonymous_address.temp_address_leading_hex} ${temp_anonymous_address.temp_address_trailing_hex}] patched with [${physical_address}].`);
                // Search for occurences of the temp address in the code area to backpatch
                for (let logical_address = 0; logical_address < this._current_program.get_code_area_size(); ++logical_address) {
                    // Found temp variable
                    if (this._current_program.read_code_area(logical_address) === temp_anonymous_address.temp_address_leading_hex) {
                        if (logical_address !== 0) {
                            if (this._current_program.read_code_area(logical_address - 1) === temp_anonymous_address.temp_address_trailing_hex) {
                                // Back patch the leading byte...
                                //
                                // Since we are using 256 bytes, we only need to worry about
                                // 1 byte addresses, so the leading byte in this case should always be: "00"
                                this._current_program.write_to_code(leading_hex_byte, logical_address);
                                // Back patch trailing byte
                                //
                                // Remember the ordering is reversed in memory, as it was an 
                                // optimization for direct addressing with no offset for the 6502a...
                                this._current_program.write_to_code(trailing_hex_byte, logical_address - 1);
                            } // if
                        } // if
                    } // if
                } // for
                // Replace static table entry's current temp address with the real static area address
                temp_anonymous_address.temp_address_leading_hex = leading_hex_byte;
                temp_anonymous_address.temp_address_trailing_hex = trailing_hex_byte;
            } // for
        } // back_patch
        _get_scope_table_with_identifier(identifier, current_scope_table) {
            let identifier_metadata = null;
            // Check parents for identfier
            while (identifier_metadata === null && current_scope_table !== null) {
                identifier_metadata = current_scope_table.get(identifier);
                // Keep searching
                if (identifier_metadata === null) {
                    current_scope_table = current_scope_table.parent_scope_table;
                } // if
            } // while
            return current_scope_table;
        } // _get_identifier_from_scope_table
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support LDA [${hex_pair_constant}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support LDA [${leading_hex_pair} ${trailing_hex_pair}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support STA [${leading_hex_pair} ${trailing_hex_pair}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support ADC [${leading_hex_pair} ${trailing_hex_pair}]!`);
            } // if
            console.log(`ADC [${leading_hex_pair} ${trailing_hex_pair}]`);
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support LDX [${hex_pair_constant}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support LDX [${leading_hex_pair} ${trailing_hex_pair}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support LDY [${hex_pair_constant}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support LDY [${leading_hex_pair} ${trailing_hex_pair}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support CPX [${leading_hex_pair} ${trailing_hex_pair}]!`);
            } // if
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
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support BNE [${hex_pair}]!`);
            } // if
            console.log(`BNE [${hex_pair}]`);
            this._current_program.write_to_code("D0");
            // Bytes to skip
            this._current_program.write_to_code(hex_pair);
        } // _branch_on_zero
        /**
         * Writes a system call.
         */
        system_call() {
            let max_static_area_size = this._current_program.get_heap_limit() - this._current_program.get_code_limit() - 1;
            if (this._current_static_table.size() - this._current_static_table.get_number_of_anonymous_address() >= max_static_area_size) {
                throw Error(`Program static area is not big enough to support SYS Call [FF]!`);
            } // if
            console.log(`SYS Call`);
            this._current_program.write_to_code("FF");
        } // system_call
    } //class
    NightingaleCompiler.CodeGeneration = CodeGeneration;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=code_generation.js.map