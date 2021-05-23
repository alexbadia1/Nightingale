/**
 * compiler_controller.ts
 *
 * Author: Alex Badia.
 *
 * This is the virtual compiler at an abstract level.
 *
 * At an abstract level this compiler will perform the following stages:
 *  1.) Lex
 *  2.) Parse
 *  3.) ...
 *
 *
 * MVC Architecture:
 *  The compiler will manipulate data using Token models,
 *  Abstract Syntax Tree models, Concrete Syntax Tree models, and other
 *  models and interact with their corresponding views in index.html to render their final output.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class CompilerController {
        //
        // TODO: Implement more stages...
        //
        /**
         * Compile Button
         * @param {string} rawSourceCode - The raw source code from Code Mirror.
         */
        static compilerControllerBtnCompile_click(rawSourceCode) {
            // Lexer ignores spaces, so trim raw source code.
            let trimmedSourceCode = rawSourceCode.trim();
            // Step 1: Lex
            this.lexer = new NightingaleCompiler.Lexer(trimmedSourceCode);
            // Step 2: Parse
            this.parser = new NightingaleCompiler.Parser(this.lexer.token_stream, this.lexer.invalid_programs);
            let cst_controller = new NightingaleCompiler.ConcreteSyntaxTreeController(this.parser.concrete_syntax_trees);
            // Step 3: Semantic Analysis
            this.semantic_analysis = new NightingaleCompiler.SemanticAnalysis(this.parser.concrete_syntax_trees, this.parser.invalid_parsed_programs);
            let ast_controller = new NightingaleCompiler.AbstractSyntaxTreeController(this.semantic_analysis.abstract_syntax_trees);
            let scope_tree_controller = new NightingaleCompiler.ScopeTreeController(this.semantic_analysis.scope_trees);
            // Step 4: Code Generation
            this.code_generation = new NightingaleCompiler.CodeGeneration(this.semantic_analysis.abstract_syntax_trees, this.semantic_analysis.invalid_semantic_programs);
            // Final output
            let output_console_model = new NightingaleCompiler.OutputConsoleModel(this.lexer.output, cst_controller, ast_controller, scope_tree_controller, this.parser.output, this.semantic_analysis.output, this.parser.invalid_parsed_programs, this.code_generation.output, this.code_generation.programs, this.code_generation.invalid_programs);
            let debug_console_model = new NightingaleCompiler.DebugConsoleModel(this.lexer.debug_token_stream, this.parser.debug, this.semantic_analysis.verbose, this.code_generation.verbose);
            // let stacktrace_console_model: StacktraceConsoleModel = new StacktraceConsoleModel(this.lexer.stacktrace_stack);
            let footer_model = new NightingaleCompiler.FooterModel((this.lexer.errors_stream.length + this.parser.getErrorCount() + this.semantic_analysis.getErrorCount()), (this.lexer.warnings_stream.length));
        } // compilerControllerBtnCompile_click
        /**
         * Highlights the current node clicked on and all of the node's descendants
         *
         * I simply don't understand recursion enough... Although, the iterative approach, really is
         * recursion, except you are "physically handling" the call stack. Think about it...
         *
         * In theory, this can never error, since this function can only be called by a valid Tree...
         *
         * @param program_num program number that the cst belongs to.
         * @param node_id unique id to keep track of each node in the tree.
         */
        static compilerControllerBtnLightUpTree_click(program_num, node_id, cst_or_ast_or_scope_tree /* This is crude, i know */) {
            // To simulate recursion, iteratively, use a stack.
            let stack = [];
            // Get the starting node from DOM
            let current_node;
            // TODO: Change this curde implementation of abstracting the button!
            if (cst_or_ast_or_scope_tree === "CST") {
                current_node = document.getElementById(`cst_p${program_num}_li_node_id_${node_id}`);
            } // if
            else if (cst_or_ast_or_scope_tree === "AST") {
                current_node = document.getElementById(`ast_p${program_num}_li_node_id_${node_id}`);
            } // else if
            else if (cst_or_ast_or_scope_tree === "SCOPETREE") {
                current_node = document.getElementById(`scope-tree_p${program_num}_li_node_id_${node_id}`);
            } // else if
            else {
                return;
            } // else
            // Push starting node's children onto stack
            let children = current_node.children;
            stack.push(children);
            // Starting node is already highlighted, thus unhighlight starting node and it's descendants.
            if (children.namedItem("node-anchor-tag").classList.contains("anchor-node__active")) {
                if (current_node instanceof HTMLAnchorElement) {
                    // Remove the CSS class that highlights the node
                    current_node.classList.remove("anchor-node__active");
                } // if
                while (stack.length > 0) {
                    // Get current nodes children elements from the stack
                    let currentRemoveItemInStack = stack.pop();
                    // Remove highlight from each child
                    for (let removeChild = 0; removeChild < currentRemoveItemInStack.length; ++removeChild) {
                        // Only remove highlight from links <a> and <li>
                        if (currentRemoveItemInStack[removeChild] instanceof HTMLAnchorElement) {
                            if (currentRemoveItemInStack[removeChild].classList.contains("anchor-node__active")) {
                                currentRemoveItemInStack[removeChild].classList.remove("anchor-node__active");
                            } // if
                        } // if
                        let nestedChildren = currentRemoveItemInStack[removeChild].children;
                        // Prevents infinite stack hopefully... I hatre recursion...
                        if (nestedChildren !== undefined && nestedChildren !== null && nestedChildren.length > 0) {
                            stack.push(nestedChildren);
                        } // if
                    } // for
                } // while
            } // if
            // Highlight current nod and its descendants
            else {
                if (current_node instanceof HTMLAnchorElement) {
                    // Add the CSS class that highlights the node
                    current_node.classList.add("anchor-node__active");
                } // if
                while (stack.length > 0) {
                    // Get current nodes children elements from the stack
                    let currentAddItemInStack = stack.pop();
                    // Add highlight from each child
                    for (let addChild = 0; addChild < currentAddItemInStack.length; ++addChild) {
                        // Only remove highlight from links <a> and <li>
                        if (currentAddItemInStack[addChild] instanceof HTMLAnchorElement) {
                            if (!currentAddItemInStack[addChild].classList.contains("anchor-node__active")) {
                                currentAddItemInStack[addChild].classList.add("anchor-node__active");
                            } // if
                        } // if
                        let nestedChildren = currentAddItemInStack[addChild].children;
                        // Prevents infinite stack hopefully... I hatre recursion...
                        if (nestedChildren !== undefined && nestedChildren !== null && nestedChildren.length > 0) {
                            stack.push(nestedChildren);
                        } // if
                    } // for
                } // while
            } // else
        } // compilerControllBtnLightUpTree_click
    } // class
    NightingaleCompiler.CompilerController = CompilerController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=compiler_controller.js.map