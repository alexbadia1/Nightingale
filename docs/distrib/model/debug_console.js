/**
 * debug_console.ts
 *
 * Author: Alex Badia
 *
 * The logical model of the Debug Console.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class DebugConsoleModel {
        constructor(EmmitedTokens) {
            this.EmmitedTokens = EmmitedTokens;
            this.ListEmmitedTokens();
        } // constuctor
        ListEmmitedTokens() {
            let debugConsole = document.getElementById("debug_console");
            for (let i = 0; i < this.EmmitedTokens.length; ++i) {
                let listItem = document.createElement("a");
                // INVALID Tokens are RED
                if (this.EmmitedTokens[i].name.includes("INVALID_TOKEN")) {
                    listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-danger`;
                    listItem.innerHTML =
                        `<span class="badge badge-primary badge-pill">${this.EmmitedTokens[i].name}</span>`
                            + `Ancestor: ${this.EmmitedTokens[i].ancestor} (${listItem[i].lineNumber}:${listItem[i].linePosition})`;
                } // if
                // VALID Tokens are GREEN
                else {
                    listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-success`;
                    listItem.innerHTML =
                        `<span class="badge badge-primary badge-pill">${this.EmmitedTokens[i].name}</span>`
                            + `Ancestor: ${this.EmmitedTokens[i].ancestor} (${listItem[i].lineNumber}:${listItem[i].linePosition})`;
                } // if
            } // for
        } // ListEmmitedTokens
    } // class: DebugConsoleModel
    NightingaleCompiler.DebugConsoleModel = DebugConsoleModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module: NightingaleCompiler
//# sourceMappingURL=debug_console.js.map