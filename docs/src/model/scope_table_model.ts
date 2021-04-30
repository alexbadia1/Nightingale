/**
 * scope_table.ts
 * 
 * The logical model of a Scope Table.
 * 
 * Utilizes the javascript Map() to simulate a hash table.
 * 
 */

module NightingaleCompiler {
    export class VariableMetaData{
        constructor(
            public type: string,
            public isUsed: boolean,
        ){}
    }// class

    export class ScopeTableModel {
        private _map: Map<string, VariableMetaData>;

        constructor(){
            this._map = new Map();
        }// constructor

        /**
         * Simulate a hash tables "put" method
         * 
         * @param key unique key value for hash table
         * @param value variable metadata object indicating type and usage
         * @returns false if there was a collision
         */
        public put(key: string, value: VariableMetaData): boolean {
            if (!this._map.has(key)) {
                this._map.set(key, value);
                return true;
            }// if

            return false;
        }// put

        /**
         * Simulate a hash tables "get" method
         * 
         * @param key unique key value for hash table
         * @returns Variable etadata object, null if not
         */
         public get(key: string): VariableMetaData {
            if (this._map.has(key)) {
                return this._map.get(key);
            }// if

            return null;
        }// put
    }// class
}// module