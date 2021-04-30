module NightingaleCompiler {
    export class Node {
        private _scope_table: ScopeTable = null;
        public _isValid: boolean = true;

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


        public setData(new_scope_table: ScopeTable): void {
            this._scope_table = new_scope_table;
        }// setData

        public getData(): ScopeTable {
            return this._scope_table;
        }// getData
    }//class
}// module