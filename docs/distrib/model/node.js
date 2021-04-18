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
        } // constructor
    } //class
    NightingaleCompiler.Node = Node;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=node.js.map