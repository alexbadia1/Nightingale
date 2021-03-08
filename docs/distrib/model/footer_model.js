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
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class FooterModel {
        constructor(_error_count, _warning_count, _user_line_number = 0, _user_line_position = 0, _encoding_type = "UTF-8", _language_mode = "Alan's Language") {
            this._error_count = _error_count;
            this._warning_count = _warning_count;
            this._user_line_number = _user_line_number;
            this._user_line_position = _user_line_position;
            this._encoding_type = _encoding_type;
            this._language_mode = _language_mode;
            this.set_error_count(this._error_count);
            this.set_warning_count(this._warning_count);
        } // constuctor
        set_error_count(newErrorCount) {
            this._error_count = newErrorCount;
            document.getElementById("footer-errors").innerHTML = newErrorCount.toString();
        } // set_error_count
        set_warning_count(newWarningCount) {
            this._warning_count = newWarningCount;
            document.getElementById("footer-warnings").innerHTML = newWarningCount.toString();
        } // set_warning_count
    } // class FooterModel
    NightingaleCompiler.FooterModel = FooterModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module: NightingaleCompiler
//# sourceMappingURL=footer_model.js.map