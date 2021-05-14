module NightingaleCompiler {
    export class CodeGeneration {
        private _error_count: number;
        private _warning_count: number;

        public programs: Array<ProgramModel>;
        private _current_program: ProgramModel;

        public output: Array<Array<OutputConsoleMessage>>;
        public verbose: Array<Array<OutputConsoleMessage>>;

        private _current_scope_tree: ScopeTreeModel;
        private _current_scope_table: ScopeTableModel;

        public static_tables: Array<StaticTableModel>;
        private _current_static_table: StaticTableModel;

        constructor(
            private _abstract_syntax_trees: Array<AbstractSyntaxTree>,
            private _invalid_abstract_syntax_trees: Array<number>,
        ){
            // Initialize output and verbose
            this.output = [[]];
            this.verbose = [[]];

            this.programs = [];
            this._current_program = null;
            
            this.static_tables = [];

            this._current_scope_tree = null;

            // this.main();
        }// constructor

        private main(): void {
            for (var astIndex: number = 0; astIndex < this._abstract_syntax_trees.length; ++astIndex) {
                // New output array for each program
                this.output.push(new Array<OutputConsoleMessage>());
                this.verbose.push(new Array<OutputConsoleMessage>());
                console.log("AST's received: ");
                console.log(this._abstract_syntax_trees);
                console.log("Invalid AST's by program id: ");
                console.log(this._invalid_abstract_syntax_trees);

                // Skips invalid semantic analyzed programs
                if (!this._invalid_abstract_syntax_trees.includes(this._abstract_syntax_trees[astIndex].program)) {
                    console.log(`Performing code generation for: ${this._abstract_syntax_trees[astIndex].program + 1}`);
                    this.output[astIndex].push(
                        new OutputConsoleMessage(
                            CODE_GENERATION, 
                            INFO, 
                            `Performing Code Generation on program ${this._abstract_syntax_trees[astIndex].program + 1}...`
                        )// OutputConsoleMessage
                    );// this.output[astIndex].push

                    // Set current scope
                    this._current_scope_tree = this._abstract_syntax_trees[astIndex].scope_tree;

                    // Create a new image of the program
                    this._current_program = new ProgramModel();
                    this.programs.push(this._current_program);

                    // Create a new static table
                    this._current_static_table = new StaticTableModel();
                    this.static_tables.push(this._current_static_table);

                    // Traverse the valid AST, depth first in order, and generate code
                    this.code_gen(this._abstract_syntax_trees[astIndex].root, this._abstract_syntax_trees[astIndex].scope_tree.root.getScopeTable());
                    this.programs.push(this._current_program);

                    this.output[this.output.length -1].push(
                        new OutputConsoleMessage(
                            CODE_GENERATION, 
                            INFO, 
                            `Finished code generation on program ${astIndex + 1}.`
                        )// OutputConsoleMessage
                    );// this.output[astIndex].push
                    this.verbose[this.verbose.length -1].push(
                        new OutputConsoleMessage(
                            CODE_GENERATION, 
                            INFO, 
                            `Finished code generation on program ${astIndex + 1}.`
                        )// OutputConsoleMessage
                    );// this.verbose[astIndex].push

                    console.log(`Finished code generation on program ${astIndex + 1}.`);
                    console.log(this._current_program);
                    console.log(`Showing static table for program ${astIndex + 1}`);
                    console.log(this._current_static_table);
                }// if

                // Tell user: skipped the program
                else {
                    console.log(`Skipping code generation for: ${this._abstract_syntax_trees[astIndex].program + 1}`);
                    this.output[astIndex].push(
                        new OutputConsoleMessage(
                            CODE_GENERATION, 
                            WARNING, 
                            `Skipping program ${this._abstract_syntax_trees[astIndex].program + 1} due to semantic analysis errors.`
                        )
                    );
                    this.verbose[astIndex].push(
                        new OutputConsoleMessage(
                            CODE_GENERATION, 
                            WARNING, 
                            `Skipping program ${this._abstract_syntax_trees[astIndex].program + 1} due to semantic analysis errors.`
                        )
                    );
                }// else
            }// for

            this.output[this.output.length -1].push(
                new OutputConsoleMessage(
                    CODE_GENERATION, 
                    INFO, 
                    `Code Generation completed with ${this._warning_count} warning(s)`
                )// OutputConsoleMessage
            );// this.output[astIndex].push
            this.output[this.output.length -1].push(
                new OutputConsoleMessage(
                    CODE_GENERATION, 
                    INFO, 
                    `Code Generation completed with  ${this._error_count} error(s)`
                )// OutputConsoleMessage
            );// this.output[astIndex].push

            this.verbose[this.verbose.length -1].push(
                new OutputConsoleMessage(
                    CODE_GENERATION, 
                    INFO, 
                    `Code Generation completed with ${this._warning_count} warning(s)`
                )// OutputConsoleMessage
            );// this.verbose[astIndex].push
            this.verbose[this.verbose.length -1].push(
                new OutputConsoleMessage(
                    CODE_GENERATION, 
                    INFO, 
                    `Code Generation completed with  ${this._error_count} error(s)`
                )// OutputConsoleMessage
            );// this.verbose[astIndex].push
        }// main

        private code_gen(current_node: Node, current_scope_table: ScopeTableModel): void {
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
            }// switch
        }// code_gen

        private _code_gen_block(current_node: Node, current_scope_table: ScopeTableModel = null): void {
            if (current_scope_table === null) {
                current_scope_table = current_node.getScopeTable();
            }// if

            console.log("Current Scope Table: ");
            console.log(current_scope_table.entries());

            for (let i: number = 0; i < current_node.children_nodes.length; ++i) {
                if (current_node.children_nodes[i].name === NODE_NAME_BLOCK) {
                    this._code_gen_block(current_node.children_nodes[i]);
                }// if
                else {
                    this.code_gen(current_node.children_nodes[i], current_scope_table);
                }// else
            }// for
        }// _code_gen_block

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
        private _code_gen_variable_decalration(current_node: Node, current_scope_table: ScopeTableModel): void {
            console.log("Code generation for variable declarations: ");

            let type: string = current_node.children_nodes[0].name;
            let identifier: string = current_node.children_nodes[1].name;
            let static_table_size: number = this._current_static_table.size();

            // Make an entry in the static table, for later backtracking
            this._current_static_table.put(
                identifier, 
                current_scope_table.id, 
                new StaticDataMetadata(`T${static_table_size}$$`, static_table_size)
            );// this._current_static_table.put

            // Integers and boolean
            if (type !== STRING) {

                // Initialize the variable to zero and store it in memory,
                // where the exact location is to be determined in backtracking.
                this.load_accumulator_with_constant("00");
            }// if 

            // Strings
            else {
                // Initialiaze strings as "null" by pointing to the word "null" in the heap
                this.load_accumulator_with_constant("FF");
            }// else 

            this.store_accumulator_to_memory(`T${static_table_size}`, "$$");
        }// _code_gen_variable_decalration

        private _code_gen_assignment_statement(current_node: Node, current_scope_table: ScopeTableModel): void {
            return;
            throw Error("Unimplemented error: assignment statement code generation has not yet been implemented!");
        }// _code_gen_assignment_statement

        private _code_gen_print_statement(current_node: Node, current_scope_table: ScopeTableModel): void {
            return;
            throw Error("Unimplemented error: Print statement code generation has not yet been implemented!");
        }// _code_gen_print_statement

        private _code_gen_if_statement(if_node: Node, current_scope_table: ScopeTableModel): void {
            this._code_gen_block(if_node.children_nodes[1]);
            return;
            throw Error("Unimplemented error: If statement code generation has not yet been implemented!");
        }// _code_gen_if_statement

        private _code_gen_while_statement(while_node: Node, current_scope_table: ScopeTableModel): void {
            this._code_gen_block(while_node.children_nodes[1]);
            return;
            throw Error("Unimplemented error: While statement code generation has not yet been implemented!");
        }// _code_gen_while_statement

        /**
         * Load the accumulator with a constant.
         * @param hex_pair_constant 1 byte constant being loaded into the accumulator
         */
        private load_accumulator_with_constant(hex_pair_constant: string) {
            this._current_program.write_to_code("A9");
            this._current_program.write_to_code(hex_pair_constant);
        }// loadAccumulatorWithConstant

        /**
         * Store the contents of the accumulator in memory.
         * @param leading_hex_pair first byte in the 2 byte address.
         * @param trailing_hex_pair second byte in the 2 byte address.
         */
        private store_accumulator_to_memory(leading_hex_pair: string, trailing_hex_pair: string) {
            this._current_program.write_to_code("8D");

            // Remember to reverse the order, as this used to be 
            // an optimaztion for direct addressing in the old 6502a days.
            this._current_program.write_to_code(trailing_hex_pair);
            this._current_program.write_to_code(leading_hex_pair);
        }// loadAccumulatorWithConstant
    }//class
}// module
