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
                    // Set current scope
                    this._current_scope_tree = this._abstract_syntax_trees[astIndex].scope_tree;
                    // Create a new image of the program
                    this._current_program = new NightingaleCompiler.ProgramModel();
                    this.programs.push(this._current_program);
                    // Create a new static table
                    this._current_static_table = new NightingaleCompiler.StaticTableModel();
                    this.static_tables.push(this._current_static_table);
                    // Traverse the valid AST, depth first in order, and generate code
                    this.code_gen(this._abstract_syntax_trees[astIndex].root);
                    this.programs.push(this._current_program);
                    this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.output[astIndex].push
                    this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.verbose[astIndex].push
                    console.log(`Finished code generation on program ${astIndex + 1}.`);
                    console.log(this._current_program);
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
        code_gen(current_node) {
            switch (current_node.name) {
                case NODE_NAME_BLOCK:
                    this._code_gen_block(current_node);
                    break;
                case NODE_NAME_VARIABLE_DECLARATION:
                    this._code_gen_variable_decalration(current_node);
                    break;
                case NODE_NAME_ASSIGNMENT_STATEMENT:
                    this._code_gen_assignment_statement(current_node);
                    break;
                case NODE_NAME_PRINT_STATEMENT:
                    this._code_gen_print_statement(current_node);
                    break;
                case AST_NODE_NAME_IF:
                    this._code_gen_if_statement(current_node);
                    break;
                case AST_NODE_NAME_WHILE:
                    this._code_gen_while_statement(current_node);
                    break;
                default:
                    throw Error("ERROR: Invalid Node found on the AST: " + current_node.name);
            } // switch
        } // code_gen
        _code_gen_block(current_node) {
            console.log("Current Scope Table: ");
            console.log(current_node.getScopeTable().entries());
            // Get scope table
            this._current_scope_table = current_node.getScopeTable();
            for (let i = 0; i < current_node.children_nodes.length; ++i) {
                this.code_gen(current_node.children_nodes[i]);
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
        _code_gen_variable_decalration(current_node) {
            console.log("Code generation for variable declarations: ");
            let type = current_node.children_nodes[0].name;
            let identifier = current_node.children_nodes[1].name;
            let static_table_size = this._current_static_table.size();
            // Make an entry in the static table, for later backtracking
            this._current_static_table.put(identifier, this._current_scope_table.id, new NightingaleCompiler.StaticDataMetadata(`T${static_table_size}$$`, static_table_size)); // this._current_static_table.put
            // Integers and boolean
            if (type !== STRING) {
                // Initialize the variable to zero and store it in memory,
                // where the exact location is to be determined in backtracking.
                this.load_accumulator_with_constant("00");
            } // if 
            // Strings
            else {
                // Initialiaze strings as "null" by
                // pointing to the word "null" in the heap
                this.load_accumulator_with_constant("FF");
            } // else 
            this.store_accumulator_to_memory(`T${static_table_size}`, "$$");
        } // _code_gen_variable_decalration
        _code_gen_assignment_statement(current_node) {
            return;
            throw Error("Unimplemented error: assignment statement code generation has not yet been implemented!");
        } // _code_gen_assignment_statement
        _code_gen_print_statement(current_node) {
            return;
            throw Error("Unimplemented error: Print statement code generation has not yet been implemented!");
        } // _code_gen_print_statement
        _code_gen_if_statement(current_node) {
            this._code_gen_block(current_node.children_nodes[1]);
            return;
            throw Error("Unimplemented error: If statement code generation has not yet been implemented!");
        } // _code_gen_if_statement
        _code_gen_while_statement(current_node) {
            this._code_gen_block(current_node.children_nodes[1]);
            return;
            throw Error("Unimplemented error: While statement code generation has not yet been implemented!");
        } // _code_gen_while_statement
        /**
         * Load the accumulator with a constant.
         * @param hex_pair_constant 1 byte constant being loaded into the accumulator
         */
        load_accumulator_with_constant(hex_pair_constant) {
            this._current_program.write_to_code("A9");
            this._current_program.write_to_code(hex_pair_constant);
        } // loadAccumulatorWithConstant
        /**
         * Store the contents of the accumulator in memory.
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        store_accumulator_to_memory(leading_hex_pair, trailing_hex_pair) {
            this._current_program.write_to_code("8D");
            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        } // loadAccumulatorWithConstant
    } //class
    NightingaleCompiler.CodeGeneration = CodeGeneration;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=code_generation.js.map