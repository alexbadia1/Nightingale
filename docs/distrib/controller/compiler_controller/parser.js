/**
 * parser.ts
 *
 * Author: Alex Badia
 *
 * This is the Parsing stage of compilation.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class Parser {
        constructor(
        /**
         * A two-dimensional array of programs and their valid lexical tokens.
         */
        token_stream = [[]]) {
            this.token_stream = token_stream;
        } // constructor
    } // class
    NightingaleCompiler.Parser = Parser;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=parser.js.map