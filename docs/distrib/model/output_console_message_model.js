/**
 * output_console_message_model.ts
 *
 * Author: Alex Badia
 *
 * The logical model of the message in the Ouput Console.
 *
 * TODO: Override some of the Bootstrap styling.
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class OutputConsoleMessage {
        constructor(
        /**
         * The stage of compilation this message originated from
         */
        source, 
        /**
         * Type of console message: info, warning, error
         */
        type, 
        /**
         * The details of the message
         */
        message = "") {
            this.source = source;
            this.type = type;
            this.message = message;
        } // constructor
    } // class
    NightingaleCompiler.OutputConsoleMessage = OutputConsoleMessage;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=output_console_message_model.js.map