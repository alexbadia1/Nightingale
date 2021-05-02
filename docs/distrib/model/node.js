var NightingaleCompiler;
(function (NightingaleCompiler) {
    class Node {
        constructor(
        /**
         * Either the name of the non-terminal or terminal.
         */
        name, 
        /**
         * Unique identifier for each node in the tree
         */
        id = -1, 
        /**
         * Root, Branch or Leaf Node?
         */
        type = null, 
        /**
         * Note a child can only have on parent
         */
        parent_node = null, 
        /**
         * Note that a node can have multiple children
         */
        children_nodes = []) {
            this.name = name;
            this.id = id;
            this.type = type;
            this.parent_node = parent_node;
            this.children_nodes = children_nodes;
            this._scope_table = null;
            this._token = null;
            this.isValid = true;
        } // constructor
        setScopeTable(new_scope_table) {
            this._scope_table = new_scope_table;
        } // setData
        getScopeTable() {
            return this._scope_table;
        } // getData
        setToken(new_token) {
            this._token = new_token;
        } // setData
        getToken() {
            if (this._token === null) {
                console.log("Null token!");
            }
            return this._token;
        } // getData
    } //class
    NightingaleCompiler.Node = Node;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=node.js.map