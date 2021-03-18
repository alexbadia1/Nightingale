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
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class OutputConsoleModel {
        constructor(output) {
            this.output = output;
            this.show_output();
        } // constuctor
        show_output() {
            let output_console = document.getElementById("output_console");
            // Remove all children, to prevent infinite list.
            while (output_console.firstChild) {
                output_console.removeChild(output_console.firstChild);
            } // while: remove all children
            for (let a_single_programs_output of this.output) {
                // Add new children
                for (let i = 0; i < a_single_programs_output.length; ++i) {
                    let listItem = document.createElement("li");
                    listItem.className = `token_${i}`;
                    listItem.style.listStyle = "none";
                    listItem.style.fontSize = "1rem";
                    listItem.style.marginLeft = "15px";
                    listItem.style.color = "white";
                    if (a_single_programs_output[i].type == INFO) {
                        listItem.innerHTML =
                            `${a_single_programs_output[i].source} `
                                + `<span  style = "color: white;">${a_single_programs_output[i].type}</span>`
                                + ` - ${a_single_programs_output[i].message}`;
                    } // if
                    else if (a_single_programs_output[i].type == WARNING) {
                        listItem.innerHTML =
                            `${a_single_programs_output[i].source} `
                                + `<span  style = "color: yellow;">${a_single_programs_output[i].type}</span>`
                                + ` - ${a_single_programs_output[i].message}`;
                    } // else-if
                    else if (a_single_programs_output[i].type == ERROR) {
                        listItem.innerHTML =
                            `${a_single_programs_output[i].source} `
                                + `<span  style = "color: red;">${a_single_programs_output[i].type}</span>`
                                + ` - ${a_single_programs_output[i].message}`;
                    } // else-if
                    output_console.appendChild(listItem);
                } // for: add new children
            } // for: each program
            let bottomMargin = document.createElement("div");
            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMargin.style.height = "10vh";
            output_console.appendChild(bottomMargin);
        } // ListEmmitedTokens
    } // class: DebugConsoleModel
    NightingaleCompiler.OutputConsoleModel = OutputConsoleModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module: NightingaleCompiler
//# sourceMappingURL=output_console._model.js.map