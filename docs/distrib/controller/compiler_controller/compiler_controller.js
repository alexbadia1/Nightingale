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
        // TODO: Implement more stages
        /**
         * Compile Button
         * @param {string} rawSourceCode - The raw source code from Code Mirror.
         */
        static compilerControllerBtnCompile_click(rawSourceCode) {
            // var t = new NightingaleCompiler.ConcreteSyntaxTree();
            // t.add_node("Root", BRANCH);
            // t.add_node("Expr", BRANCH);
            // t.add_node("Term", BRANCH);
            // t.add_node("Factor", BRANCH);
            // t.add_node("a", LEAF);
            // t.root_node();
            // t.root_node();
            // t.root_node();
            // // t.root_node();  // Un-comment this to test guards against moving "up" past the root of the tree.
            // t.add_node("Op", BRANCH);
            // t.add_node("+", LEAF);
            // t.root_node();
            // t.add_node("Term", BRANCH);
            // t.add_node("Factor", BRANCH);
            // t.add_node("2", LEAF);
            // t.root_node();
            // t.root_node();
            // console.log(t.toString());
            // document.getElementById("cst").innerHTML = t.toString();
            // Create a compiler instance
            this.lexer = new NightingaleCompiler.Lexer();
            console.log("Compiling");
            let trimmedSourceCode = rawSourceCode.trim();
            // Step 1: Lex
            let lexer_modified_source_code = this.lexer.main(trimmedSourceCode);
            // Step 2: Parse
            this.parser = new NightingaleCompiler.Parser(this.lexer.token_stream, this.lexer.invalid_programs);
            let cst_controller = new NightingaleCompiler.ConcreteSyntaxTreeController(this.parser.concrete_syntax_trees);
            // Final output
            let output_console_model = new NightingaleCompiler.OutputConsoleModel(this.lexer.output, cst_controller, this.parser.output, this.parser.invalid_parsed_programs);
            let debug_console_model = new NightingaleCompiler.DebugConsoleModel(this.lexer.debug_token_stream, this.parser.debug);
            let stacktrace_console_model = new NightingaleCompiler.StacktraceConsoleModel(this.lexer.stacktrace_stack);
            let footer_model = new NightingaleCompiler.FooterModel(this.lexer.errors_stream.length, this.lexer.warnings_stream.length);
        } // compilerControllerBtnCompile_click
        static compilerControllerBtnLightUpTree_click(program_num, node_id) {
            //  TODO: Fix this, not important though
            // let stack: Array<HTMLCollection> = [];
            // let current_node = document.getElementById(`p${program_num}_li_node_id_${node_id}`);
            // stack.push(current_node.children);
            // if (current_node.classList.contains("node_active")) {
            //     current_node.classList.remove("node__active");
            //     let children = current_node.children;
            //     while (stack.length != 0) {
            //         let currentItemInStack = stack.pop();
            //         for (let child: number = 0; child < currentItemInStack.length; ++child) {
            //             children[child].classList.remove("node__active");
            //             let nestedChildren = children[child].children;
            //             // Prevents infinite stack hopefully... I hatre recursion...
            //             if (nestedChildren != undefined && nestedChildren != null && nestedChildren.length > 0) {
            //                 stack.push(children[child].children);
            //             }// if
            //         }// for
            //     }// while
            // }// if
            // else {
            //     current_node.classList.remove("node__active");
            //     let children = current_node.children;
            //     while (stack.length != 0) {
            //         let currentItemInStack = stack.pop();
            //         for (let child: number = 0; child < currentItemInStack.length; ++child) {
            //             children[child].classList.add("node__active");
            //             let nestedChildren = children[child].children;
            //             // Prevents infinite stack hopefully... I hatre recursion...
            //             if (nestedChildren != undefined && nestedChildren != null && nestedChildren.length > 0) {
            //                 stack.push(children[child].children);
            //             }// if
            //         }// for
            //     }// while
            // }// else
            // // background: #c8e4f8; color: #000; border: 1px solid #94a0b4;
            // current_node.style.backgroundColor = "#c8e4f8";
            // current_node.style.color = "#000000";
            // current_node.style.border = "#c8e4f8";
        } // compilerControllBtnLightUpTree_click
    } // class
    NightingaleCompiler.CompilerController = CompilerController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=compiler_controller.js.map