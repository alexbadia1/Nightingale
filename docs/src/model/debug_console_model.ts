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
        private isInString = false;
        private heartFaceEmojii: string = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="green" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.559 5.448a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zm-.07-5.448c1.397-.864 3.543 1.838-.953 3.434-3.067-3.554.19-4.858.952-3.434z" /> </svg>`;
        private neutralFaceEmojii: string = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="blue" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" /> </svg>`;
        private frownyFaceEmojii: string = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="yellow" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-2.715 5.933a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" /> </svg>`;
        private deadFaceEmojii: string = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="red" class="bi bi-emoji-dizzy-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM8 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>`;
        constructor(
            public debugTokens: Array<Array<LexicalToken>>,
            public parserDebug: Array<Array<OutputConsoleMessage>>,
            public semanticVerbose: Array<Array<OutputConsoleMessage>>,
            public codeGenVerbose: Array<Array<OutputConsoleMessage>>,
        ) {
            this.listDebugTokens();
        }// constuctor

        public listDebugTokens() {
            let debugConsoleList: HTMLElement = document.getElementById("debug_console_list");

            // Remove all children, to prevent infinite list.
            while (debugConsoleList.firstChild) {
                debugConsoleList.removeChild(debugConsoleList.firstChild);
            }// while: remove all children

            // Add a LEGEND to explain the emojiis
            let heartFaceEmojii: HTMLLIElement = document.createElement("li");
            heartFaceEmojii.style.listStyle = "none";
            heartFaceEmojii.style.margin = "5px 5px 0px 15px";
            let neutralFaceEmojii: HTMLLIElement = document.createElement("li");
            neutralFaceEmojii.style.listStyle = "none";
            neutralFaceEmojii.style.margin = "5px 5px 0px 15px";
            let frownyFaceEmojii: HTMLLIElement = document.createElement("li");
            frownyFaceEmojii.style.listStyle = "none";
            frownyFaceEmojii.style.margin = "5px 5px 0px 15px";
            let deadFaceEmojii: HTMLLIElement = document.createElement("li");
            deadFaceEmojii.style.listStyle = "none";
            deadFaceEmojii.style.margin = "5px 5px 0px 15px";

            heartFaceEmojii.innerHTML += this.heartFaceEmojii + `<span style = "color: white;">  Valid Token - included to parse</span>`;
            neutralFaceEmojii.innerHTML += this.neutralFaceEmojii + `<span style = "color: white;">  Metadata - excluded</span>`;
            frownyFaceEmojii.innerHTML += this.frownyFaceEmojii + `<span style = "color: white;">  Warning - excluded</span>`;
            deadFaceEmojii.innerHTML += this.deadFaceEmojii + `<span style = "color: white;">  Error - excluded</span>`;

            debugConsoleList.appendChild(heartFaceEmojii);
            debugConsoleList.appendChild(neutralFaceEmojii);
            debugConsoleList.appendChild(frownyFaceEmojii);
            debugConsoleList.appendChild(deadFaceEmojii);

            // For each program
            for (var emittedTokenArrayIndex: number = 0; emittedTokenArrayIndex < this.debugTokens.length; ++emittedTokenArrayIndex) {
                let programNumberHeader: HTMLAnchorElement = document.createElement("a");
                programNumberHeader.style.margin = "15px 0px 5px 17px";

                programNumberHeader.className = `program_${emittedTokenArrayIndex}`;
                programNumberHeader.innerHTML = `<span style = "font-size: 1rem; color: white;">Lexing program ${emittedTokenArrayIndex + 1}</span>`;

                debugConsoleList.appendChild(programNumberHeader);

                // Add all tokens found in LEX
                for (let nestedArrayIndex: number = 0; nestedArrayIndex < this.debugTokens[emittedTokenArrayIndex].length; ++nestedArrayIndex) {
                    if (this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name.includes("STRING")) {
                        this.isInString = !this.isInString;
                    }// if

                    let listItem: HTMLAnchorElement = document.createElement("a");
                    listItem.className = `token_${nestedArrayIndex}`;
                    listItem.style.margin = "0px 15px 3px 15px";

                    //
                    // TODO: This is dead code if I choose to keep the debug console only showing tokens that will be passed to the parser!
                    //
                    // INVALID Tokens are RED
                    if (this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name.includes(INVALID_TOKEN)) {
                        listItem.className = `token_${nestedArrayIndex}`;
                        listItem.innerHTML += this.deadFaceEmojii;
                        listItem.innerHTML += `<span style = "font-size: 1rem; color: red;">  ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name}</span>`;
                    }// if

                    //
                    // TODO: This is dead code if I choose to keep the debug console only showing tokens that will be passed to the parser!
                    //
                    // Warnings severley mess up positioning so only report the line number
                    else if (this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name.includes(WARNING_TOKEN)) {
                        // Don't show position number for being in strings
                        if (this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lexeme == "EOL" || this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lexeme == "$") {
                            listItem.className = `token_${nestedArrayIndex}`;
                            listItem.innerHTML += this.frownyFaceEmojii;
                            listItem.innerHTML += `<span style = "font-size: 1rem; color: yellow;">  ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name}</span>`;
                            listItem.innerHTML += `Lexeme: ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lexeme} (${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lineNumber})`;
                        }// if
                        else {
                            listItem.className = `token_${nestedArrayIndex} list-group-item list-group-item-action list-group-item-warning`;
                            listItem.innerHTML += this.frownyFaceEmojii;
                            listItem.innerHTML += `<span style = "font-size: 1rem; color: yellow;">  ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name}</span>`;
                            listItem.innerHTML += `Lexeme: ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lexeme} (${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lineNumber}:${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].linePosition})`;
                        }// else
                    }// else if

                    //
                    // TODO: This is dead code if I choose to keep the debug console only showing tokens that will be passed to the parser!
                    //
                    // Missing token
                    else if (this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name.includes(MISSING_TOKEN)) {
                        listItem.className = `token_${nestedArrayIndex}`;
                        listItem.innerHTML += this.frownyFaceEmojii;
                        listItem.innerHTML += `<span style = "font-size: 1rem; color: yellow;">${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name}</span>`;
                    }// if

                    // VALID Tokens are GREEN
                    else {
                        if ((!this.isInString && this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name.includes("SPACE")) ||
                            this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name == START_BLOCK_COMMENT
                            || this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name == END_BLOCK_COMMENT
                        ) {
                            listItem.innerHTML += this.neutralFaceEmojii;
                            listItem.innerHTML += `<span style = "font-size: 1rem; color: blue;" >  ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name} </span>`;
                        }// if
                        else {
                            listItem.innerHTML += this.heartFaceEmojii;
                            listItem.innerHTML += `<span style = "font-size: 1rem; color: green;" >  ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name} </span>`;
                        }// else
                    }// else

                    if (!this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].name.includes(WARNING_TOKEN)) {
                        listItem.innerHTML += `<span style = "font-size: 1rem; color: white;"> Lexeme: ${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lexeme} (${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].lineNumber}:${this.debugTokens[emittedTokenArrayIndex][nestedArrayIndex].linePosition}) </span>`;
                    }// if

                    debugConsoleList.appendChild(listItem);
                }// for
            }// for

            // Show Parser output in batches
            for (var parseProgramNumber: number = 0; parseProgramNumber < this.parserDebug.length; ++parseProgramNumber) {
                // Stops showing the extra last program
                if (this.parserDebug[parseProgramNumber].length === undefined || this.parserDebug[parseProgramNumber].length === null || this.parserDebug[parseProgramNumber].length === 0) {
                    continue;
                }// if
                let parseHeader: HTMLAnchorElement = document.createElement("a");
                parseHeader.style.margin = "15px 0px 5px 17px";

                parseHeader.className = `parse_program_${parseProgramNumber}`;
                parseHeader.innerHTML = `<span style = "font-size: 1rem; color: white;">Parsing program ${parseProgramNumber + 1}</span>`;
                debugConsoleList.appendChild(parseHeader);

                // Add All tokens consumed in PARSE and their validity
                for (let indexOfMessage: number = 0; indexOfMessage < this.parserDebug[parseProgramNumber].length; ++indexOfMessage) {
                    let listItem: HTMLAnchorElement = document.createElement("a");
                    listItem.className = `parse_message_${indexOfMessage}`;
                    listItem.style.margin = "0px 15px 3px 15px";
                    listItem.className = `parse_message_${indexOfMessage}`;
                    listItem.innerHTML += `<span style = "font-size: 1rem; color: white;">${this.parserDebug[parseProgramNumber][indexOfMessage].message}</span>`;

                    debugConsoleList.appendChild(listItem);
                }// for
            }// for

            // Semantic Analysis
            for (var semanticProgramNumber: number = 0; semanticProgramNumber < this.semanticVerbose.length; ++semanticProgramNumber) {
                // Stops showing the extra last program
                if (this.semanticVerbose[semanticProgramNumber].length === undefined || this.semanticVerbose[semanticProgramNumber].length === null || this.semanticVerbose[semanticProgramNumber].length === 0) {
                    continue;
                }// if

                // Show semantic analysis in batches
                let sematicHeader: HTMLAnchorElement = document.createElement("a");
                sematicHeader.style.margin = "15px 0px 5px 17px";

                sematicHeader.className = `semantic_program_${semanticProgramNumber}`;
                sematicHeader.innerHTML = `<span style = "font-size: 1rem; color: white;">Semantic Analysis ${semanticProgramNumber + 1}</span>`;
                debugConsoleList.appendChild(sematicHeader);

                // Add All tokens consumed in PARSE and their validity
                for (let indexOfMessage: number = 0; indexOfMessage < this.semanticVerbose[semanticProgramNumber].length; ++indexOfMessage) {
                    let listItem: HTMLAnchorElement = document.createElement("a");
                    listItem.className = `semantic_message_${indexOfMessage}`;
                    listItem.style.margin = "0px 15px 3px 15px";
                    listItem.className = `semantic_message_${indexOfMessage}`;
                    listItem.innerHTML += `<span style = "font-size: 1rem; color: white;">${this.semanticVerbose[semanticProgramNumber][indexOfMessage].message}</span>`;

                    debugConsoleList.appendChild(listItem);
                }// for
            }// for

            // Code Generation
            for (var codegenNumber: number = 0; codegenNumber < this.codeGenVerbose.length; ++codegenNumber) {
                // Stops showing the extra last program
                if (this.codeGenVerbose[codegenNumber].length === undefined || this.codeGenVerbose[codegenNumber].length === null || this.codeGenVerbose[codegenNumber].length === 0) {
                    continue;
                }// if

                // Show semantic analysis in batches
                let sematicHeader: HTMLAnchorElement = document.createElement("a");
                sematicHeader.style.margin = "15px 0px 5px 17px";

                sematicHeader.className = `code_gen_program_${codegenNumber}`;
                sematicHeader.innerHTML = `<span style = "font-size: 1rem; color: white;">Code Generation ${codegenNumber + 1}</span>`;
                debugConsoleList.appendChild(sematicHeader);

                // Add All tokens consumed in PARSE and their validity
                for (let indexOfMessage: number = 0; indexOfMessage < this.codeGenVerbose[codegenNumber].length; ++indexOfMessage) {
                    let listItem: HTMLAnchorElement = document.createElement("a");
                    listItem.className = `code_gen_message_${indexOfMessage}`;
                    listItem.style.margin = "0px 15px 3px 15px";
                    listItem.className = `code_gen_message_${indexOfMessage}`;
                    listItem.innerHTML += `<span style = "font-size: 1rem; color: white;">${this.codeGenVerbose[codegenNumber][indexOfMessage].message}</span>`;

                    debugConsoleList.appendChild(listItem);
                }// for
            }// for
            let bottomMargin: HTMLDivElement = document.createElement("div");

            // Avoids the bottom banner from overlapping over the list.
            // Double check the stylesheet to make sure the height is slightly larger than the ".footer" height
            bottomMargin.style.height = "4vh";
            debugConsoleList.appendChild(bottomMargin);
        }// ListemmitedTokens

    }// class: DebugConsoleModel
}// module: NightingaleCompiler