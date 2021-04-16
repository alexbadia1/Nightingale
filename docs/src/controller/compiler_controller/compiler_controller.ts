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
            let lexer_modified_source_code: string = this.lexer.main(trimmedSourceCode);

            // Step 2: Parse
            this.parser = new  NightingaleCompiler.Parser(this.lexer.token_stream, this.lexer.invalid_programs);

            let cst_controller = new ConcreteSyntaxTreeController(this.parser.concrete_syntax_trees);

            // Final output
             let output_console_model: OutputConsoleModel = new OutputConsoleModel(this.lexer.output, cst_controller, this.parser.output, this.parser.invalid_parsed_programs);
             let debug_console_model: DebugConsoleModel = new DebugConsoleModel(this.lexer.debug_token_stream, this.parser.debug);
             let stacktrace_console_model: StacktraceConsoleModel = new StacktraceConsoleModel(this.lexer.stacktrace_stack);
             let footer_model: FooterModel = new FooterModel(this.lexer.errors_stream.length, this.lexer.warnings_stream.length);
        }// compilerControllerBtnCompile_click

        public static compilerControllerBtnLightUpTree_click(program_num: number, node_id: number): void {

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
        }// compilerControllBtnLightUpTree_click
    }// class
}// module