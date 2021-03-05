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
            // console.log(`Trimmed User Source Code: ${trimmedSourceCode}`);
            // console.log(`Source Code as String Literal: ${JSON.stringify(trimmedSourceCode)}`);
            // Lex Phase
            this.lexer.main(trimmedSourceCode);
            /**
             *
             */
            let debugConsole = new NightingaleCompiler.DebugConsoleModel(this.lexer.tokenStream);
            let stacktraceConsole = new NightingaleCompiler.StacktraceConsoleModel(this.lexer.stacktraceStack);
        } // compilerControllerBtnCompile_click
    } // class
    NightingaleCompiler.CompilerController = CompilerController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=compiler_controller.js.map