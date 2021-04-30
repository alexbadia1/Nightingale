/**
 * scope_tree_controller.ts
 * 
 * Author: Alex Badia
 * 
 * The Scope Tree Controller will use the Concrete Syntax Tree Model 
 * to render final Concrete Syntax Tree Model output in its corresponding view in index.html.
 */

 module NightingaleCompiler {
    export class ScopeTreeController {
        constructor(
            private _scope_trees: Array<ScopeTreeModel>,
        ) { }// constuctor

        public add_tree_to_output_console(output_console: HTMLElement, program_number: number) {
            let traversalResults: Array<string>;
            let index: number = 0;
            while (index < this._scope_trees.length) {
                if (this._scope_trees[index].program === program_number) {
                    traversalResults = this._scope_trees[program_number].toString().split("\n");

                    for (let result of traversalResults) {
                        let listItem: HTMLLIElement = document.createElement("li");
                        listItem.style.listStyle = "none";
                        listItem.style.fontSize = "1rem";
                        listItem.style.marginLeft = "15px";
                        listItem.style.color = "white";
                        listItem.innerHTML += `${result}`;
                        output_console.appendChild(listItem);
                    }// for

                    break;
                }// if

                else {
                    index++;
                }// else
            }// while
        }// show_trees_cmd

        public add_tree_to_gui(cst_output: HTMLElement, program_number: number) {
            let index: number = 0;
            while (index < this._scope_trees.length) {
                if (this._scope_trees[index].program === program_number) {
                    this._scope_trees[program_number].toHtml();

                    let bottomMargin: HTMLDivElement = document.createElement("div");
                    bottomMargin.style.height = "10vh";
                    cst_output.appendChild(bottomMargin);
                    break;
                }// if

                else {
                    index++;
                }// else
            }// while
        }// show_trees_gui
    }// class
}// module