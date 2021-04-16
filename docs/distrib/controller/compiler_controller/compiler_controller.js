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
        /**
         * Highlights the current node clicked on and all of the node's descendants
         *
         * Too much recursive brain damage, thus implemented iteratively
         * @param program_num
         * @param node_id
         */
        static compilerControllerBtnLightUpTree_click(program_num, node_id) {
            // To simulate recursion, iteratively, use a stack.
            let stack = [];
            // Get the starting node from DOM
            let current_node = document.getElementById(`p${program_num}_li_node_id_${node_id}`);
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
                        console.log(currentAddItemInStack[addChild]);
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
            // // background: #c8e4f8; color: #000; border: 1px solid #94a0b4;
            // current_node.style.backgroundColor = "#c8e4f8";
            // current_node.style.color = "#000000";
            // current_node.style.border = "#c8e4f8";
        } // compilerControllBtnLightUpTree_click
    } // class
    NightingaleCompiler.CompilerController = CompilerController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
// Stack to store the nodes
// let nodes: Array<Node> = [];
// // push the current node onto the stack
// nodes.push(root);
// // Loop while the stack is not empty
// while (nodes.length !== 0) {
//     // Store the current node and pop
//     // it from the stack
//     let curr: Node = nodes.pop();
//     // Current node has been travarsed
//     if (curr != null) {
//         // Root node
//         if (curr.parent_node == null) {
//             // Root node already created
//             ///console.log(`Current: ${curr.name} | ${curr.id}, Parent: ${curr.parent_node.id}`);
//         }// if
//         // Node is the first node of the parent
//         else if (curr.parent_node.children_nodes[0] == curr) {
//             console.log(`Current: ${curr.name} | ${curr.id}, Parent: ${curr.parent_node.id}, 1st child`);
//             let ul: HTMLUListElement = document.createElement("ul");
//             ul.id = `p${this._program}_ul_node_id_${curr.id}`;
//             let li: HTMLLIElement = document.createElement("li");
//             li.id = `p${this._program}_li_node_id_${curr.id}`;
//             ul.appendChild(li);
//             li.innerHTML = `<a onclick="NightingaleCompiler.CompilerController.compilerControllerBtnLightUpTree_click(${this._program}, ${curr.id});" >${curr.name}</a>`;
//             document.getElementById(`p${this._program}_li_node_id_${curr.parent_node.id}`).appendChild(ul);
//         }// if
//         // Node is 2nd or 3rd or nth child of parent
//         else {
//             console.log(`Current: ${curr.name} | ${curr.id}, Parent: ${curr.parent_node.id}, ul ${curr.parent_node.children_nodes[0].id}`);
//             let li: HTMLLIElement = document.createElement("li");
//             li.id = `p${this._program}_li_node_id_${curr.id}`;
//             li.innerHTML = `<a>${curr.name}</a>`;
//             document.getElementById(`p${this._program}_ul_node_id_${curr.parent_node.children_nodes[0].id}`).appendChild(li);
//         }// else
//         // Store all the children of 
//         // current node from right to left.
//         for (let i: number = curr.children_nodes.length - 1; i >= 0; --i) {
//             nodes.push(curr.children_nodes[i]);
//         }// for
//     }
// }
//# sourceMappingURL=compiler_controller.js.map