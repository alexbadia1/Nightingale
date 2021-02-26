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
        public static lexer: Lexer;

        /**
         * Parser...
         */
        public static parser: Parser;

        /**
         * Creates a compiler instance.
         */
        public static init(): void {
            this.lexer = new Lexer();
            this.parser = new Parser();
        }// init

        // TODO: Implement more stages

        /**
         * Compile Button
         * @param {string} rawSourceCode - The raw source code from Code Mirror.
         */
        public static compilerControllerBtnCompile_click(rawSourceCode: string) {
            // Create a compiler instance
            this.init();
            console.log("Compiling");

            let trimmedSourceCode = rawSourceCode.trim();
            console.log(`Trimmed User Source Code: ${trimmedSourceCode}`);
        }// compilerControllerBtnCompile_click
    }// class
}// module