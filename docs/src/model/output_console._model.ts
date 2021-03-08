/**
 * output_console_model.ts
 * 
 * Author: Alex Badia
 * 
 * The logical model of the Ouput Console.
 * 
 * Stores lexer info, error and warnign reports in a stylized bootstrap list.
 * 
 * TODO: Override some of the Bootstrap styling.
 */
 
 module NightingaleCompiler {
    export class OutputConsoleModel {
        constructor(
            public output: Array<OutputConsoleMessage>,
        ) {
            this.show_output();
        }// constuctor

        public show_output() {
            let output_console: HTMLElement = document.getElementById("output_console");

            // Remove all children, to prevent infinite list.
            while (output_console.firstChild) {
                output_console.removeChild(output_console.firstChild);
            }// while: remove all children

            // Add new children
            for (let i: number = 0; i < this.output.length; ++i) {
                let listItem: HTMLLIElement = document.createElement("li");
                listItem.className = `token_${i}`;
                listItem.style.listStyle = "none";
                listItem.style.fontSize = "1rem";
                listItem.style.marginLeft = "15px";
                listItem.style.color = "white";

                if (this.output[i].type == INFO) {
                    listItem.innerHTML =
                        `${this.output[i].source} `
                        + `<span  style = "color: white;">${this.output[i].type}</span>`
                        + ` - ${this.output[i].message}`;
                }// if

                else if (this.output[i].type == WARNING) {
                    listItem.innerHTML =
                        `${this.output[i].source} `
                        + `<span  style = "color: yellow;">${this.output[i].type}</span>`
                        + ` - ${this.output[i].message}`;
                }// else-if

                else if (this.output[i].type == ERROR) {
                    listItem.innerHTML =
                        `${this.output[i].source} `
                        + `<span  style = "color: red;">${this.output[i].type}</span>`
                        + ` - ${this.output[i].message}`;
                }// else-if

                output_console.appendChild(listItem);
            }// for: add new children


            let bottomMargin: HTMLDivElement = document.createElement("div");

            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMargin.style.height = "10vh";
            output_console.appendChild(bottomMargin);
        }// ListEmmitedTokens

    }// class: DebugConsoleModel
}// module: NightingaleCompiler