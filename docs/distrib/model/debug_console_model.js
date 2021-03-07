/**
 * debug_console_model.ts
 *
 * Author: Alex Badia
 *
 * The logical model of the Debug Console.
 *
 * Stores the tokens from the lexer in a stylized bootstrap list.
 *
 * TODO: Override some of the Bootstrap styling.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class DebugConsoleModel {
        constructor(EmmitedTokens) {
            this.EmmitedTokens = EmmitedTokens;
            this.ListEmmitedTokens();
        } // constuctor
        ListEmmitedTokens() {
            let debugConsoleList = document.getElementById("debug_console_list");
            // Remove all children, to prevent infinite list.
            while (debugConsoleList.firstChild) {
                debugConsoleList.removeChild(debugConsoleList.firstChild);
            } // while: remove all children
            // Add new children
            for (let i = 0; i < this.EmmitedTokens.length; ++i) {
                let listItem = document.createElement("a");
                // INVALID Tokens are RED
                if (this.EmmitedTokens[i].name.includes(INVALID_TOKEN)) {
                    listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-danger`;
                    listItem.innerHTML =
                        `<span class="badge badge-primary badge-pill">${this.EmmitedTokens[i].name}</span>`
                            + `Lexeme: ${this.EmmitedTokens[i].lexeme} (${this.EmmitedTokens[i].lineNumber}:${this.EmmitedTokens[i].linePosition})`;
                } // if
                // VALID Tokens are GREEN
                else {
                    listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-success`;
                    listItem.innerHTML =
                        `<span class="badge badge-primary badge-pill">${this.EmmitedTokens[i].name}</span>`
                            + `Lexeme: ${this.EmmitedTokens[i].lexeme} (${this.EmmitedTokens[i].lineNumber}:${this.EmmitedTokens[i].linePosition})`;
                } // if
                debugConsoleList.appendChild(listItem);
            } // for: add new children
            let bottomMargin = document.createElement("div");
            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMargin.style.height = "4vh";
            debugConsoleList.appendChild(bottomMargin);
        } // ListEmmitedTokens
    } // class: DebugConsoleModel
    NightingaleCompiler.DebugConsoleModel = DebugConsoleModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module: NightingaleCompiler
//# sourceMappingURL=debug_console_model.js.map