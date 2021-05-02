module NightingaleCompiler {
    export class Node {
        private _scope_table: ScopeTableModel = null;
        private _token: LexicalToken = null;
        public errorFlag: boolean = false;
        public warningFlag: boolean = false;

        constructor(
            /**
             * Either the name of the non-terminal or terminal.
             */
            public name: string,

            /**
             * Unique identifier for each node in the tree
             */
            public id: number = -1,

            /**
             * Root, Branch or Leaf Node?
             */
            public type: string = null,

            /**
             * Note a child can only have on parent
             */
            public parent_node: Node = null,

            /**
             * Note that a node can have multiple children
             */
            public children_nodes: Array<Node> = [],
        ) { }// constructor


        public setScopeTable(new_scope_table: ScopeTableModel): void {
            this._scope_table = new_scope_table;
        }// setData

        public getScopeTable(): ScopeTableModel {
            return this._scope_table;
        }// getData

        public setToken(new_token: LexicalToken): void {
            this._token = new_token;
        }// setData

        public getToken(): LexicalToken {
            if(this._token === null) {console.log("Null token!");}
            return this._token;
        }// getData
    }//class
}// module