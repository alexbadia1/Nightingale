/**
 * static_table.ts
 * 
 * The logical model of a Scope Table.
 * 
 * Utilizes the javascript Map() to simulate a hash table.
 * 
 */

 module NightingaleCompiler {
    export class StaticDataMetadata{
        constructor(
            public temp_address_leading_hex: string,
            public temp_address_trailing_hex: string,
            public logical_stack_address: number,
        ){}
    }// class

    export class StaticTableModel {
        private _map: Map<string, StaticDataMetadata>;

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
        public put(identifier: string, scope: number, static_data_metadata: StaticDataMetadata): boolean {
            let primary_key: string = identifier + scope.toString();
            let value: StaticDataMetadata = static_data_metadata;

            if (!this._map.has(primary_key)) {
                this._map.set(primary_key, value);
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
         public get(identifier: string, scope: number,): StaticDataMetadata {
            let primary_key: string = identifier + scope.toString();

            if (this._map.has(primary_key)) {
                return this._map.get(primary_key);
            }// if

            return null;
        }// get

        public entries(): Array<Array<any>> {
            return Array.from(this._map.entries());
        }// entries

        public has(identifier: string, scope: number,): boolean{
            let primary_key: string = identifier + scope.toString();

            return this._map.has(primary_key);
        }// has
        
        public isEmpty(): boolean {
            return this._map.size === 0;
        }// isEmpty

        public size(): number {
            return this._map.size;
        }// size
    }// class
}// module