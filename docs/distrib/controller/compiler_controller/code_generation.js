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
                    // Traverse the valid AST, depth first in order, and generate code
                    this.code_gen(this._abstract_syntax_trees[astIndex].root);
                    this.programs.push(this._current_program);
                    this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.output[astIndex].push
                    this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(CODE_GENERATION, INFO, `Finished code generation on program ${astIndex + 1}.`) // OutputConsoleMessage
                    ); // this.verbose[astIndex].push
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
            this._current_scope_table = current_node.getScopeTable();
            for (let i = 0; i < current_node.children_nodes.length; ++i) {
                this.code_gen(current_node.children_nodes[i]);
            } // for
        } // _code_gen_block
        _code_gen_variable_decalration(current_node) {
            return;
            throw Error("Unimplemented error: variable declaration code generation has not yet been implemented!");
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
    } //class
    NightingaleCompiler.CodeGeneration = CodeGeneration;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=code_generation.js.map