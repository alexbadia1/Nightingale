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
         * Parser...
         */
        public static parser: NightingaleCompiler.Parser;

        // TODO: Implement more stages

        /**
         * Compile Button
         * @param {string} rawSourceCode - The raw source code from Code Mirror.
         */
        public static compilerControllerBtnCompile_click(rawSourceCode: string) {
            // Create a compiler instance
            this.lexer = new NightingaleCompiler.Lexer();
            console.log("Compiling");

            let trimmedSourceCode = rawSourceCode.trim();

            // Lex Phase
            let lexer_modified_source_code: string = this.lexer.main(trimmedSourceCode);

            // Output Lex information
            console.log(this.lexer.token_stream);
            let output_console_model: OutputConsoleModel = new OutputConsoleModel(this.lexer.output);
            let debug_console_model: DebugConsoleModel = new DebugConsoleModel(this.lexer.debug_token_stream);
            let stacktrace_console_model: StacktraceConsoleModel = new StacktraceConsoleModel(this.lexer.stacktrace_stack);
            let footer_model: FooterModel = new FooterModel(this.lexer.errors_stream.length, this.lexer.warnings_stream.length);

            console.log(this.lexer.invalid_programs);
            this.parser = new  NightingaleCompiler.Parser(this.lexer.token_stream);
        }// compilerControllerBtnCompile_click
    }// class
}// module