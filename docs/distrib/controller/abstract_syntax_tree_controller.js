/**
 * abstract_syntax_tree_controller.ts
 *
 * Author: Alex Badia
 *
 * The Abstract Syntax Tree Controller will use the Abstract Syntax Tree Model
 * to render final Abstract Syntax Tree Model output in its corresponding view in index.html.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class AbstractSyntaxTreeController {
        constructor(_abstract_syntax_trees) {
            this._abstract_syntax_trees = _abstract_syntax_trees;
        } // constuctor
        add_tree_to_output_console(output_console, program_number) {
            let traversalResults;
            let index = 0;
            while (index < this._abstract_syntax_trees.length) {
                if (this._abstract_syntax_trees[index].program === program_number) {
                    traversalResults = this._abstract_syntax_trees[index].toString().split("\n");
                    for (let result of traversalResults) {
                        let listItem = document.createElement("li");
                        listItem.style.listStyle = "none";
                        listItem.style.fontSize = "1rem";
                        listItem.style.marginLeft = "15px";
                        listItem.style.color = "white";
                        listItem.innerHTML += `${result}`;
                        output_console.appendChild(listItem);
                    } // for
                    break;
                } // if
                else {
                    index++;
                } // else
            } // while
        } // show_trees_cmd
        add_tree_to_gui(ast_output, program_number) {
            let index = 0;
            while (index < this._abstract_syntax_trees.length) {
                if (this._abstract_syntax_trees[index].program === program_number) {
                    this._abstract_syntax_trees[index].toHtml();
                    let bottomMargin = document.createElement("div");
                    bottomMargin.style.height = "10vh";
                    ast_output.appendChild(bottomMargin);
                    break;
                } // if
                else {
                    index++;
                } // else
            } // while
        } // show_trees_gui
    } // class
    NightingaleCompiler.AbstractSyntaxTreeController = AbstractSyntaxTreeController;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=abstract_syntax_tree_controller.js.map