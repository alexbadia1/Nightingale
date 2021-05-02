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
            public isInitialized: boolean,
            public lineNumber: number,
            public linePosition: number,
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
        }// get

        public entries(): Array<Array<any>> {
            return Array.from(this._map.entries());
        }// entries

        public has(key: string): boolean{
            return this._map.has(key);
        }// has
        
        public isEmpty(): boolean {
            return this._map.size === 0;
        }// isEmpty
    }// class
}// module