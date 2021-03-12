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
        /**
         * Creates a compiler instance.
         */
        static init() {
            this.lexer = new NightingaleCompiler.Lexer();
            this.parser = new NightingaleCompiler.Lexer();
        } // init
        // TODO: Implement more stages
        /**
         * Compile Button
         * @param {string} rawSourceCode - The raw source code from Code Mirror.
         */
        static compilerControllerBtnCompile_click(rawSourceCode) {
            // Create a compiler instance
            this.init();
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
        } // compilerControllerBtnCompile_click
    } // class
    NightingaleCompiler.CompilerController = CompilerController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=compiler_controller.js.map