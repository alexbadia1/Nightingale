/**
 * scope_table.ts
 *
 * The logical model of a Scope Table.
 *
 * Utilizes the javascript Map() to simulate a hash table.
 *
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class VariableMetaData {
        constructor(type, isUsed, lineNumber, linePosition) {
            this.type = type;
            this.isUsed = isUsed;
            this.lineNumber = lineNumber;
            this.linePosition = linePosition;
        }
    } // class
    NightingaleCompiler.VariableMetaData = VariableMetaData;
    class ScopeTableModel {
        constructor() {
            this._map = new Map();
        } // constructor
        /**
         * Simulate a hash tables "put" method
         *
         * @param key unique key value for hash table
         * @param value variable metadata object indicating type and usage
         * @returns false if there was a collision
         */
        put(key, value) {
            if (!this._map.has(key)) {
                this._map.set(key, value);
                return true;
            } // if
            return false;
        } // put
        /**
         * Simulate a hash tables "get" method
         *
         * @param key unique key value for hash table
         * @returns Variable etadata object, null if not
         */
        get(key) {
            if (this._map.has(key)) {
                return this._map.get(key);
            } // if
            return null;
        } // get
        entries() {
            return Array.from(this._map.entries());
        } // entries
        isEmpty() {
            return this._map.size === 0;
        } // isEmpty
    } // class
    NightingaleCompiler.ScopeTableModel = ScopeTableModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=scope_table_model.js.map