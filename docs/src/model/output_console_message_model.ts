/**
 * output_console_message_model.ts
 * 
 * Author: Alex Badia
 * 
 * The logical model of the message in the Ouput Console.
 * 
 * TODO: Override some of the Bootstrap styling.
 */

module NightingaleCompiler {
    export class OutputConsoleMessage {
        constructor(
            /**
             * The stage of compilation this message originated from
             */
            public source: string,

            /**
             * Type of console message: info, warning, error
             */
            public type: string,

            /**
             * The details of the message
             */
            public message: string = "",
        ) {}// constructor
    }// class
}// module