/**
 * concrete_syntax_tree_controller.ts
 * 
 * Author: Alex Badia
 * 
 * The Concrete Syntax Tree Controller will use the Concrete Syntax Tree Model 
 * to render final Concrete Syntax Tree Model output in its corresponding view in index.html.
 */

module NightingaleCompiler {
    export class ConcreteSyntaxTreeController {
        constructor(
            private _concrete_syntax_trees,
        ) { }// constuctor

        public add_tree_to_output_console(output_console: HTMLElement, program_number: number) {
            let traversalResults: Array<string> = this._concrete_syntax_trees[program_number].toString().split("\n");
            for (let result of traversalResults) {
                let listItem: HTMLLIElement = document.createElement("li");
                listItem.style.listStyle = "none";
                listItem.style.fontSize = "1rem";
                listItem.style.marginLeft = "15px";
                listItem.style.color = "white";
                listItem.innerHTML += `${result}`;
                output_console.appendChild(listItem);
            }// for
        }// show_trees_cmd

        private show_trees_gui() {}// show_trees_gui
    }// class
}// module