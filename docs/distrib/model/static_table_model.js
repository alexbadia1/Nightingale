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
        constructor(temp_address_leading_hex, temp_address_trailing_hex, logical_stack_address) {
            this.temp_address_leading_hex = temp_address_leading_hex;
            this.temp_address_trailing_hex = temp_address_trailing_hex;
            this.logical_stack_address = logical_stack_address;
            this.isUsable = false;
        }
    } // class
    NightingaleCompiler.StaticDataMetadata = StaticDataMetadata;
    class Jump {
        constructor(distance) {
            this.distance = distance;
        }
    } // class
    NightingaleCompiler.Jump = Jump;
    class StaticTableModel {
        constructor() {
            this._map = new Map();
            this._anonymous_address = new Array();
            this._strings_in_heap = new Map();
            this._jump_table = new Map();
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
        values() {
            return Array.from(this._map.values());
        } // values
        has(identifier, scope) {
            let primary_key = identifier + scope.toString();
            return this._map.has(primary_key);
        } // has
        isEmpty() {
            return this._map.size === 0;
        } // isEmpty
        size() {
            return this._map.size + this._anonymous_address.length;
        } // size
        get_number_of_anonymous_address() {
            return this._anonymous_address.length;
        } // get_anonymous_address_size
        add_anonymous_address(meta_data) {
            this._anonymous_address.push(meta_data);
        } // add_anonymous_address
        get_anonymous_addresses() {
            return this._anonymous_address;
        } // get_anonymous_address
        put_new_string(new_string, address) {
            if (!this._strings_in_heap.has(new_string)) {
                this._strings_in_heap.set(new_string, address);
            } // if
        } // put_new_string
        get_string_in_heap(string_in_heap) {
            if (this._strings_in_heap.has(string_in_heap)) {
                return this._strings_in_heap.get(string_in_heap);
            } // if
            return null;
        } // get_string_in_heap
        get_jump_table_size() {
            return this._jump_table.size;
        } // get_jump_table_size
        put_jump(new_jump, distance) {
            if (!this._jump_table.has(new_jump)) {
                this._jump_table.set(new_jump, distance);
            } // if
        } // put_jump
        get_jump(jump) {
            if (this._jump_table.has(jump)) {
                return this._jump_table.get(jump);
            } // if
            return null;
        } // get_jump
        get_jump_entries() {
            return Array.from(this._jump_table.entries());
        } // get_jump_entries
    } // class
    NightingaleCompiler.StaticTableModel = StaticTableModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=static_table_model.js.map