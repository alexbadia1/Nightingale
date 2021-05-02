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
        constructor(lexer_output, cst_controller, ast_controller, scope_tree_controller, parser_output, semantic_output, invalid_parsed_programs) {
            this.lexer_output = lexer_output;
            this.cst_controller = cst_controller;
            this.ast_controller = ast_controller;
            this.scope_tree_controller = scope_tree_controller;
            this.parser_output = parser_output;
            this.semantic_output = semantic_output;
            this.invalid_parsed_programs = invalid_parsed_programs;
            this.show_output();
        } // constuctor
        show_output() {
            let output_console = document.getElementById("output_console");
            let cst_output = document.getElementById("cst");
            let ast_output = document.getElementById("ast");
            let scope_tree_output = document.getElementById("scope-tree");
            // Remove all children, to prevent infinite list.
            while (output_console.firstChild) {
                output_console.removeChild(output_console.firstChild);
            } // while: remove all children
            while (cst_output.firstChild) {
                cst_output.removeChild(cst_output.firstChild);
            } // while: remove all children
            while (ast_output.firstChild) {
                ast_output.removeChild(ast_output.firstChild);
            } // while: remove all children
            while (scope_tree_output.firstChild) {
                scope_tree_output.removeChild(scope_tree_output.firstChild);
            } // while: remove all children
            // Kept as separate for loops for future customized styling of each steps output
            for (var program_number = 0; program_number < this.lexer_output.length; ++program_number) {
                // Add Lexer output
                for (let i = 0; i < this.lexer_output[program_number].length; ++i) {
                    let listItem = document.createElement("li");
                    listItem.className = `token_${i}`;
                    listItem.style.listStyle = "none";
                    listItem.style.fontSize = "1rem";
                    listItem.style.marginLeft = "15px";
                    listItem.style.color = "white";
                    if (i == 0) {
                        listItem.style.marginTop = "15px";
                    } // if
                    if (this.lexer_output[program_number][i].type == INFO) {
                        listItem.innerHTML =
                            `${this.lexer_output[program_number][i].source} `
                                + `<span  style = "color: white;">${this.lexer_output[program_number][i].type}</span>`
                                + ` - ${this.lexer_output[program_number][i].message}`;
                    } // if
                    else if (this.lexer_output[program_number][i].type == WARNING) {
                        listItem.innerHTML =
                            `${this.lexer_output[program_number][i].source} `
                                + `<span  style = "color: yellow;">${this.lexer_output[program_number][i].type}</span>`
                                + ` - ${this.lexer_output[program_number][i].message}`;
                    } // else-if
                    else if (this.lexer_output[program_number][i].type == ERROR) {
                        listItem.innerHTML =
                            `${this.lexer_output[program_number][i].source} `
                                + `<span  style = "color: red;">${this.lexer_output[program_number][i].type}</span>`
                                + ` - ${this.lexer_output[program_number][i].message}`;
                    } // else-if
                    output_console.appendChild(listItem);
                } // for: add new children
                // Add Parser output
                if (this.parser_output[program_number] !== null || this.parser_output[program_number] !== null) {
                    for (let i = 0; i < this.parser_output[program_number].length; ++i) {
                        let listItem = document.createElement("li");
                        listItem.className = `token_${i}`;
                        listItem.style.listStyle = "none";
                        listItem.style.fontSize = "1rem";
                        listItem.style.marginLeft = "15px";
                        listItem.style.color = "white";
                        if (i == 0) {
                            listItem.style.marginTop = "15px";
                        } // if
                        if (this.parser_output[program_number][i].type == INFO) {
                            listItem.innerHTML =
                                `${this.parser_output[program_number][i].source} `
                                    + `<span  style = "color: white;">${this.parser_output[program_number][i].type}</span>`
                                    + ` - ${this.parser_output[program_number][i].message}`;
                        } // if
                        else if (this.parser_output[program_number][i].type == WARNING) {
                            listItem.innerHTML =
                                `${this.parser_output[program_number][i].source} `
                                    + `<span  style = "color: yellow;">${this.parser_output[program_number][i].type}</span>`
                                    + ` - ${this.parser_output[program_number][i].message}`;
                        } // else-if
                        else if (this.parser_output[program_number][i].type == ERROR) {
                            listItem.innerHTML =
                                `${this.parser_output[program_number][i].source} `
                                    + `<span  style = "color: red;">${this.parser_output[program_number][i].type}</span>`
                                    + ` - ${this.parser_output[program_number][i].message}`;
                        } // else-if
                        output_console.appendChild(listItem);
                    } // for: add new children
                    if (!this.invalid_parsed_programs.includes(program_number)) {
                        this.cst_controller.add_tree_to_output_console(output_console, program_number);
                        this.cst_controller.add_tree_to_gui(cst_output, program_number);
                    } // if
                } // if
                // Semantic Analysis Output
                if (this.semantic_output[program_number] !== null || this.semantic_output[program_number] !== null) {
                    for (let i = 0; i < this.semantic_output[program_number].length; ++i) {
                        let listItem = document.createElement("li");
                        listItem.className = `token_${i}`;
                        listItem.style.listStyle = "none";
                        listItem.style.fontSize = "1rem";
                        listItem.style.marginLeft = "15px";
                        listItem.style.color = "white";
                        if (i == 0) {
                            listItem.style.marginTop = "15px";
                        } // if
                        if (this.semantic_output[program_number][i].type == INFO) {
                            listItem.innerHTML =
                                `${this.semantic_output[program_number][i].source} `
                                    + `<span  style = "color: white;">${this.semantic_output[program_number][i].type}</span>`
                                    + ` - ${this.semantic_output[program_number][i].message}`;
                        } // if
                        else if (this.semantic_output[program_number][i].type == WARNING) {
                            listItem.innerHTML =
                                `${this.semantic_output[program_number][i].source} `
                                    + `<span  style = "color: yellow;">${this.semantic_output[program_number][i].type}</span>`
                                    + ` - ${this.semantic_output[program_number][i].message}`;
                        } // else-if
                        else if (this.semantic_output[program_number][i].type == ERROR) {
                            listItem.innerHTML =
                                `${this.semantic_output[program_number][i].source} `
                                    + `<span  style = "color: red;">${this.semantic_output[program_number][i].type}</span>`
                                    + ` - ${this.semantic_output[program_number][i].message}`;
                        } // else-if
                        output_console.appendChild(listItem);
                    } // for: add new children
                    // Abstract Syntax Trees
                    if (!this.invalid_parsed_programs.includes(program_number)) {
                        // Yes, this will show invalid ast's but not passed to code gen
                        this.ast_controller.add_tree_to_output_console(output_console, program_number);
                        this.ast_controller.add_tree_to_gui(ast_output, program_number);
                        this.scope_tree_controller.add_tree_to_output_console(output_console, program_number);
                        this.scope_tree_controller.add_tree_to_gui(scope_tree_output, program_number);
                    } // if
                } // if
            } // for: each program
            let bottomMarginOutputConsole = document.createElement("div");
            bottomMarginOutputConsole.id = "bottomMarginOutputConsole";
            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMarginOutputConsole.style.height = "10vh";
            output_console.appendChild(bottomMarginOutputConsole);
        } // ListEmmitedTokens
    } // class: DebugConsoleModel
    NightingaleCompiler.OutputConsoleModel = OutputConsoleModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module: NightingaleCompiler
//# sourceMappingURL=output_console._model.js.map