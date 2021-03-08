/**
 * lexical_token.ts
 *
 * Author: Alex Badia
 *
 * The logical model of a Token generated during Lexical Analysis of compilation.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class LexicalToken {
        constructor(
        // Name of the token.
        name, 
        // Regular expression that qualifies what can generate this token.
        definition = null, 
        // The value that generated this token.
        lexeme = null, 
        // Location of the value that generated this token.
        // Values cannot span multiple lines since line-wrap is disabled.
        lineNumber = -1, 
        // Note that the start and end position will be equal for single character ancestors.
        linePosition = -1) {
            this.name = name;
            this.definition = definition;
            this.lexeme = lexeme;
            this.lineNumber = lineNumber;
            this.linePosition = linePosition;
        } // constructor
        copyWith(newLexeme = this.lexeme, newLineNumber = this.lineNumber, newLineStartPosition = this.linePosition) {
            return new LexicalToken(this.name, this.definition, newLexeme, newLineNumber, newLineStartPosition);
        }
    } // class
    NightingaleCompiler.LexicalToken = LexicalToken;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=lexical_token_model.js.map