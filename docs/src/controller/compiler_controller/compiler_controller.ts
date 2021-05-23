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

module NightingaleCompiler {
    export class CompilerController {

        /**
         * Lexer validates given input is part of the language.
         * 
         * Lexer will generate tokens to be passed to the parser. 
         * Compiliation will stop if there are any syntatical errors to report.
         */
        public static lexer: NightingaleCompiler.Lexer;

        /**
         * Parser enforces the first and follow sets of the language.
         * 
         * For example, unmatched parenthesis, brackets, or if, say, the keyword 
         * "while" is not followed by a boolean expression of some sort, et cetera.
         * 
         * Parser will generate a concrete syntax trees to be passed to the semantic.
         * Compilation will stop if there are any parse errors to report.
         */
        public static parser: NightingaleCompiler.Parser;

        /**
         * Semantic analysis, enforces scope, or type checking, and other rules of the grammar.
         * 
         * Semantic analysis will generate an Abstract Syntax Tree, from the Parser's 
         * Concrete Syntax Tree which is the Intermediate Representation sent to code generation. 
         */
        public static semantic_analysis: NightingaleCompiler.SemanticAnalysis;

        /**
         * Semantic analysis, enforces scope, or type checking, and other rules of the grammar.
         * 
         * Semantic analysis will generate an Abstract Syntax Tree, from the Parser's 
         * Concrete Syntax Tree which is the Intermediate Representation sent to code generation. 
         */
        public static code_generation: NightingaleCompiler.CodeGeneration;

        //
        // TODO: Implement more stages...
        //

        /**
         * Compile Button
         * @param {string} rawSourceCode - The raw source code from Code Mirror.
         */
        public static compilerControllerBtnCompile_click(rawSourceCode: string) {
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
            let output_console_model: OutputConsoleModel = new OutputConsoleModel(
                this.lexer.output,
                cst_controller,
                ast_controller,
                scope_tree_controller,
                this.parser.output,
                this.semantic_analysis.output,
                this.parser.invalid_parsed_programs,
                this.code_generation.output,
                this.code_generation.programs,
                this.code_generation.invalid_programs,
            );

            let debug_console_model: DebugConsoleModel = new DebugConsoleModel(
                this.lexer.debug_token_stream,
                this.parser.debug,
                this.semantic_analysis.verbose,
                this.code_generation.verbose,
            );
            // let stacktrace_console_model: StacktraceConsoleModel = new StacktraceConsoleModel(this.lexer.stacktrace_stack);
            let footer_model: FooterModel = new FooterModel(
                (this.lexer.errors_stream.length + this.parser.get_error_count() + this.semantic_analysis.get_error_count() + this.code_generation.get_error_count()),
                (this.lexer.warnings_stream.length + this.parser.get_warning_count() + this.semantic_analysis.get_warning_count() + this.code_generation.get_warning_count())
            );// footer_model
        }// compilerControllerBtnCompile_click

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
        public static compilerControllerBtnLightUpTree_click(program_num: number, node_id: number, cst_or_ast_or_scope_tree: string /* This is crude, i know */): void {
            // To simulate recursion, iteratively, use a stack.
            let stack: Array<HTMLCollection> = [];

            // Get the starting node from DOM
            let current_node;

            // TODO: Change this curde implementation of abstracting the button!
            if (cst_or_ast_or_scope_tree === "CST") {
                current_node = document.getElementById(`cst_p${program_num}_li_node_id_${node_id}`);
            }// if

            else if (cst_or_ast_or_scope_tree === "AST") {
                current_node = document.getElementById(`ast_p${program_num}_li_node_id_${node_id}`);
            }// else if

            else if (cst_or_ast_or_scope_tree === "SCOPETREE") {
                current_node = document.getElementById(`scope-tree_p${program_num}_li_node_id_${node_id}`);
            }// else if

            else {
                return;
            }// else

            // Push starting node's children onto stack
            let children = current_node.children;
            stack.push(children);

            // Starting node is already highlighted, thus unhighlight starting node and it's descendants.
            if (children.namedItem("node-anchor-tag").classList.contains("anchor-node__active")) {

                if (current_node instanceof HTMLAnchorElement) {
                    // Remove the CSS class that highlights the node
                    current_node.classList.remove("anchor-node__active");
                }// if

                while (stack.length > 0) {

                    // Get current nodes children elements from the stack
                    let currentRemoveItemInStack = stack.pop();

                    // Remove highlight from each child
                    for (let removeChild: number = 0; removeChild < currentRemoveItemInStack.length; ++removeChild) {

                        // Only remove highlight from links <a> and <li>
                        if (currentRemoveItemInStack[removeChild] instanceof HTMLAnchorElement) {
                            if (currentRemoveItemInStack[removeChild].classList.contains("anchor-node__active")) {
                                currentRemoveItemInStack[removeChild].classList.remove("anchor-node__active");
                            }// if
                        }// if

                        let nestedChildren = currentRemoveItemInStack[removeChild].children;

                        // Prevents infinite stack hopefully... I hatre recursion...
                        if (nestedChildren !== undefined && nestedChildren !== null && nestedChildren.length > 0) {
                            stack.push(nestedChildren);
                        }// if
                    }// for
                }// while
            }// if

            // Highlight current nod and its descendants
            else {

                if (current_node instanceof HTMLAnchorElement) {
                    // Add the CSS class that highlights the node
                    current_node.classList.add("anchor-node__active");
                }// if

                while (stack.length > 0) {

                    // Get current nodes children elements from the stack
                    let currentAddItemInStack = stack.pop();

                    // Add highlight from each child
                    for (let addChild: number = 0; addChild < currentAddItemInStack.length; ++addChild) {

                        // Only remove highlight from links <a> and <li>
                        if (currentAddItemInStack[addChild] instanceof HTMLAnchorElement) {
                            if (!currentAddItemInStack[addChild].classList.contains("anchor-node__active")) {
                                currentAddItemInStack[addChild].classList.add("anchor-node__active");
                            }// if
                        }// if

                        let nestedChildren = currentAddItemInStack[addChild].children;

                        // Prevents infinite stack hopefully... I hatre recursion...
                        if (nestedChildren !== undefined && nestedChildren !== null && nestedChildren.length > 0) {
                            stack.push(nestedChildren);
                        }// if
                    }// for
                }// while
            }// else
        }// compilerControllBtnLightUpTree_click
    }// class
}// module