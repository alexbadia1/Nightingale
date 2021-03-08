/**
 * footer_model.ts
 * 
 * Author: Alex Badia
 * 
 * The logical model of the footer.
 * 
 * Stores warning and error counts and current line position.
 * 
 * TODO: Override some of the Bootstrap styling.
 */

module NightingaleCompiler {
    export class FooterModel{
        constructor(
            private _error_count: number,
            private _warning_count: number,
            private _user_line_number: number = 0,
            private _user_line_position: number = 0,
            private _encoding_type: string = "UTF-8",
            private _language_mode: string = "Alan's Language",
        ){
            this.set_error_count(this._error_count);
            this.set_warning_count(this._warning_count);
        }// constuctor

        public set_error_count(newErrorCount: number): void {
            this._error_count = newErrorCount;
            document.getElementById("footer-errors").innerHTML = newErrorCount.toString();
        }// set_error_count

        public set_warning_count(newWarningCount: number): void {
            this._warning_count = newWarningCount;
            document.getElementById("footer-warnings").innerHTML = newWarningCount.toString();
        }// set_warning_count
    }// class FooterModel
}// module: NightingaleCompiler