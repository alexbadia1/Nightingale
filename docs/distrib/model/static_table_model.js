/**
 * static_table.ts
 *
 * The logical model of a Scope Table.
 *
 * Utilizes the javascript Map() to simulate a hash table.
 *
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class StaticDataMetadata {
        constructor(temp_address, logical_address) {
            this.temp_address = temp_address;
            this.logical_address = logical_address;
        }
    } // class
    NightingaleCompiler.StaticDataMetadata = StaticDataMetadata;
    class StaticTableModel {
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
        put(identifier, scope, static_data_metadata) {
            let primary_key = identifier + scope.toString();
            let value = static_data_metadata;
            if (!this._map.has(primary_key)) {
                this._map.set(primary_key, value);
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
        get(identifier, scope) {
            let primary_key = identifier + scope.toString();
            if (this._map.has(primary_key)) {
                return this._map.get(primary_key);
            } // if
            return null;
        } // get
        entries() {
            return Array.from(this._map.entries());
        } // entries
        has(identifier, scope) {
            let primary_key = identifier + scope.toString();
            return this._map.has(primary_key);
        } // has
        isEmpty() {
            return this._map.size === 0;
        } // isEmpty
        size() {
            return this._map.size;
        } // size
    } // class
    NightingaleCompiler.StaticTableModel = StaticTableModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=static_table_model.js.map