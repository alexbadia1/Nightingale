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
            // Lex Phase
            let lexer_modified_source_code = this.lexer.main(trimmedSourceCode);
            // Output Lex information
            console.log(this.lexer.token_stream);
            let output_console_model = new NightingaleCompiler.OutputConsoleModel(this.lexer.output);
            let debug_console_model = new NightingaleCompiler.DebugConsoleModel(this.lexer.debug_token_stream);
            let stacktrace_console_model = new NightingaleCompiler.StacktraceConsoleModel(this.lexer.stacktrace_stack);
            let footer_model = new NightingaleCompiler.FooterModel(this.lexer.errors_stream.length, this.lexer.warnings_stream.length);
            console.log(this.lexer.invalid_programs);
            this.parser = new NightingaleCompiler.Parser(this.lexer.token_stream, this.lexer.invalid_programs);
            try {
                this.parser.parse_program();
            } // try
            catch (e) {
                console.log(e);
            } // catch
            for (let cst of this.parser.concrete_syntax_trees) {
                console.log(cst.toString());
            } // for
        } // compilerControllerBtnCompile_click
    } // class
    NightingaleCompiler.CompilerController = CompilerController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=compiler_controller.js.map