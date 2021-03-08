/**
 * stacktrace_console_model.ts
 * 
 * Author: Alex Badia
 * 
 * The logical model of the Debug Console.
 * 
 * Stores the entire compiler stacktrace in a stylized bootstrap list.
 * 
 * TODO: Override some of the Bootstrap styling.
 */

module NightingaleCompiler {
    export class StacktraceConsoleModel {
        constructor(
            /**
             * A stack of substrings of the source code and lexer tokens.
             * 
             * When listing the stack remember LIFO.
             */
            public stacktrace: Array<any>,
        ) {
            this.showStacktrace();
        }// constuctor

        public showStacktrace() {
            let stacktraceConsoleList: HTMLElement = document.getElementById("stacktrace_console_list");

            // Remove all children, to prevent infinite list.
            while (stacktraceConsoleList.firstChild) {
                stacktraceConsoleList.removeChild(stacktraceConsoleList.firstChild);
            }// while: remove all children

            // Add new children
            for (let i: number = 0; i < this.stacktrace.length; ++i) {
                let listItem: HTMLAnchorElement = document.createElement("a");

                // Lexical Token
                if (typeof this.stacktrace[i] == "object") {

                    // INVALID Tokens are RED
                    if (this.stacktrace[i].name.includes(INVALID_TOKEN)) {
                        listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-secondary`;
                        listItem.innerHTML =
                            `<span class="badge badge-primary badge-pill">${this.stacktrace[i].name}</span>`
                            + `Lexeme: ${this.stacktrace[i].lexeme} (${this.stacktrace[i].lineNumber}:${this.stacktrace[i].linePosition})`;
                    }// if

                    else if (this.stacktrace[i].name.includes(WARNING_TOKEN)) {
                        listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-warning`;
                        listItem.innerHTML =
                            `<span class="badge badge-primary badge-pill">${this.stacktrace[i].name}</span>`
                            + `Lexeme: ${this.stacktrace[i].lexeme} (${this.stacktrace[i].lineNumber}:${this.stacktrace[i].linePosition})`;
                    }// else if

                    // Missing token
                    else if (this.stacktrace[i].name.includes(MISSING_TOKEN)) {
                        listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-info`;
                        listItem.innerHTML =
                            `<span class="badge badge-primary badge-pill">${this.stacktrace[i].name}</span>`
                            + `Lexeme: ${this.stacktrace[i].lexeme} (${this.stacktrace[i].lineNumber})`;
                    }// if

                    // VALID Tokens are GREEN
                    else {
                        listItem.className = `token_${i} list-group-item list-group-item-action list-group-item-success`;
                        listItem.innerHTML =
                            `<span class="badge badge-primary badge-pill">${this.stacktrace[i].name}</span>`
                            + `Lexeme |${this.stacktrace[i].lexeme}| (${this.stacktrace[i].lineNumber}:${this.stacktrace[i].linePosition})`;
                    }// else

                }//if: lexical token

                // Substring of source code
                else {
                    listItem.className = `substring${i} list-group-item list-group-item-action list-group-item-secondary`;
                    listItem.innerHTML = `Chunk: |${this.stacktrace[i]}|`;
                }// else: Substring of source code

                stacktraceConsoleList.appendChild(listItem);
            }// for: add new children
            let bottomMargin: HTMLDivElement = document.createElement("div");

            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMargin.style.height = "4vh";
            stacktraceConsoleList.appendChild(bottomMargin);
        }// ListEmmitedTokens

    }// class: DebugConsoleModel
}// module: NightingaleCompiler