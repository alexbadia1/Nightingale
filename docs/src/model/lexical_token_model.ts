/**
 * lexical_token.ts
 * 
 * Author: Alex Badia
 * 
 * The logical model of a Token generated during Lexical Analysis of compilation.
 */

module NightingaleCompiler {
    export class LexicalToken {
        constructor(
            // Name of the token.
            public name: string,

            // Regular expression that qualifies what can generate this token.
            public definition: RegExp,

            // The value that generated this token.
            public ancestor: string = null,

            // Location of the value that generated this token.
            // Values cannot span multiple lines since line-wrap is disabled.
            public lineNumber: number= -1,

            // Note that the start and end position will be equal for single character ancestors.
            public linePosition: number = -1,
        ) {}// constructor

        public copyWith(
            newAncestor: string = this.ancestor,
            newLineNumber: number= this.lineNumber, 
            newLineStartPosition: number = this.linePosition) {
            return new LexicalToken(this.name, this.definition, newAncestor, newLineNumber, newLineStartPosition);
        }
    }// class
}// module