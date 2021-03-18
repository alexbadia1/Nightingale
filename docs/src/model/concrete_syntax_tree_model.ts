/**
 * concrete_syntax_tree_model.ts
 * 
 * The logical model of an Concrete Syntax Tree.
 * 
 * By Alan G. Labouseur, based on the 2009
 * work by Michael Ardizzone and Tim Smith.
 */

module NightingaleCompiler {
    class Node {
        constructor(
            /**
             * Either the name of the non-terminal or terminal.
             */
            public name: string,

            /**
             * Note a child can only have on parent
             */
            public parent_node: Node = null,

            /**
             * Note that a node can have multiple children
             */
            public children_nodes: Array<Node> = [],
        ) { }// constructor
    }// node

    export class ConcreteSyntaxTree {
        constructor(
            /**
             * Root node of the tree.
             */
            public root: any = null,

            /**
             * Current node in the tree
             */
            public current_node: Node = null,
        ) { }//constructor

        // Add a node: kind in {branch, leaf}.
        public add_node(new_name: string, kind: string) {
            // Construct the node object.
            let new_node = new Node(new_name);

            // Check to see if it needs to be the root node.
            if ((this.root == null) || (!this.root)) {
                this.root = new_node;
            }// if

            // Not root node...
            else {
                // We are the children.
                // Make our parent the current node [this.current_node]...
                new_node.parent_node = this.current_node;

                // ... and add ourselves (via the unfrotunately-named
                // "push" function) to the children array of the current node.
                this.current_node.children_nodes.push(new_node);

                console.log(this.current_node.children_nodes);
            }// else

            // If we are an interior/branch node, then...
            if (kind == BRANCH) {
                // ... update the CURrent node pointer to ourselves.
                this.current_node = new_node;
            }// if
        }// add_node

        /**
         * Sets the current node to the parent node
         */
        public climb_one_level() {
            // ... by moving "up" to our parent node (if possible).
            if ((this.current_node.parent_node !== null) && (this.current_node.parent_node.name !== undefined)) {
                this.current_node = this.current_node.parent_node;
            }// if

            else {
                // TODO: Some sort of error logging.
                // This really should not happen, but it will, of course.
            }// else
        }// root_node

        /**
         * 
         * 
         * @param node current node in the treeE
         * @param depth current level of the tree
         * @param traversalResult current state/version of the tree
         * @returns The final recursive tree
         */
        public expand(node: Node, depth: number, traversalResult: string): string {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++) {
                traversalResult += "-";
            }// for

            // If there are no children (i.e., leaf nodes)...
            if (!node.children_nodes || node.children_nodes.length === 0) {
                // ... note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";

                return traversalResult;
            }// if

            else {
                // There are children_nodes, so note these interior/branch nodes and ...
                traversalResult += "<" + node.name + "> \n";

                // .. recursively expand them.
                for (var h = 0; h < node.children_nodes.length; h++) {
                    traversalResult = this.expand(node.children_nodes[h], depth + 1, traversalResult);
                }// for

                return traversalResult;
            }// else
        }// expand

        public toString(): string {
            // Initialize the result string.
            var traversalResult = "";
            console.log(this.root);
            console.log(this.root.children_nodes);

            // Make the initial call to expand from the root.
            return this.expand(this.root, 0, traversalResult);
        }// toString

        // I dunno how I feel about that magic function inside of a function trick that Javascript allows...
        //
        // Return a string representation of the tree.
        // public toString() {
        //     // Initialize the result string.
        //     var traversalResult = "";

        //     // Recursive function to handle the expansion of the nodes.
        //     function expand(node: Node, depth: number) {
        //         // Space out based on the current depth so
        //         // this looks at least a little tree-like.
        //         for (var i = 0; i < depth; i++) {
        //             traversalResult += "-";
        //         }

        //         // If there are no children (i.e., leaf nodes)...
        //         if (!node.children_nodes || node.children_nodes.length == 0) {
        //             // ... note the leaf node.
        //             traversalResult += "[" + node.name + "]";
        //             traversalResult += "\n";
        //         }
        //         else {
        //             // There are children, so note these interior/branch nodes and ...
        //             traversalResult += "<" + node.name + "> \n";
        //             // .. recursively expand them.
        //             for (var i = 0; i < node.children_nodes.length; i++) {
        //                 expand(node.children_nodes[i], depth + 1);
        //             }
        //         }
        //     }
        //     // Make the initial call to expand from the root.
        //     expand(this.root, 0);

        //     // Return the result.
        //     return traversalResult;
        // }
    }// class
}// module