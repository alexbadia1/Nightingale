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

module NightingaleCompiler {
    export class DebugConsoleModel {
        constructor(
            public EmmitedTokens: Array<LexicalToken>,
        ) {
            this.ListEmmitedTokens();
        }// constuctor

        public ListEmmitedTokens() {
            let debugConsoleList: HTMLElement = document.getElementById("debug_console_list");

            // Remove all children, to prevent infinite list.
            while (debugConsoleList.firstChild) {
                debugConsoleList.removeChild(debugConsoleList.firstChild);
            }// while: remove all children

            // Add new children
            for (let i: number = 0; i < this.EmmitedTokens.length; ++i) {
                let listItem: HTMLAnchorElement = document.createElement("a");

                // INVALID Tokens are RED
                if (this.EmmitedTokens[i].name.includes(INVALID_TOKEN)) {
                    listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-danger`;
                    listItem.innerHTML =
                        `<span class="badge badge-primary badge-pill">${this.EmmitedTokens[i].name}</span>`
                        + `Ancestor: ${this.EmmitedTokens[i].ancestor} (${this.EmmitedTokens[i].lineNumber}:${this.EmmitedTokens[i].linePosition})`;
                }// if

                // VALID Tokens are GREEN
                else {
                    listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-success`;
                    listItem.innerHTML =
                        `<span class="badge badge-primary badge-pill">${this.EmmitedTokens[i].name}</span>`
                        + `Ancestor: ${this.EmmitedTokens[i].ancestor} (${this.EmmitedTokens[i].lineNumber}:${this.EmmitedTokens[i].linePosition})`;
                }// if

                debugConsoleList.appendChild(listItem);
            }// for: add new children
            let bottomMargin: HTMLDivElement = document.createElement("div");

            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMargin.style.height = "4vh";
            debugConsoleList.appendChild(bottomMargin);
        }// ListEmmitedTokens

    }// class: DebugConsoleModel
}// module: NightingaleCompiler