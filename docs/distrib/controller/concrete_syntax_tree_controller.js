/**
 * concrete_syntax_tree_controller.ts
 *
 * Author: Alex Badia
 *
 * The Concrete Syntax Tree Controller will use the Concrete Syntax Tree Model
 * to render final Concrete Syntax Tree Model output in its corresponding view in index.html.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class ConcreteSyntaxTreeController {
        constructor(_concrete_syntax_trees) {
            this._concrete_syntax_trees = _concrete_syntax_trees;
        } // constuctor
        add_tree_to_output_console(output_console, program_number) {
            let traversalResults = this._concrete_syntax_trees[program_number].toString().split("\n");
            for (let result of traversalResults) {
                let listItem = document.createElement("li");
                listItem.style.listStyle = "none";
                listItem.style.fontSize = "1rem";
                listItem.style.marginLeft = "15px";
                listItem.style.color = "white";
                listItem.innerHTML += `${result}`;
                output_console.appendChild(listItem);
            } // for
        } // show_trees_cmd
        show_trees_gui() { } // show_trees_gui
    } // class
    NightingaleCompiler.ConcreteSyntaxTreeController = ConcreteSyntaxTreeController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=concrete_syntax_tree_controller.js.map