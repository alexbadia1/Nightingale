/**
 * abstract_syntax_tree_model.ts
 * 
 * Author: Alex Badia
 * 
 * The logical model of a Abstract Syntax Tree.
 * 
 * By Alan G. Labouseur, based on the 2009
 * work by Michael Ardizzone and Tim Smith.
 * 
 * Enhanced by Alex Badia
 * 
 * TODO: Learn how inheritance and polymorphism work in typescript and
 *       refactor the cst, ast, and scope tree using them...
 */

 module NightingaleCompiler {
    export class AbstractSyntaxTree {
        public scope_tree: ScopeTreeModel;
        
        constructor(
            /**
             * Root node of the tree.
             */
            public root: any = null,

            /**
             * Current node in the tree
             */
            public current_node: Node = null,

            /**
             * Program this tree belongs to
             */
            public program: number = -1,
            
            /**
             * Number of nodes in the tree
             */
            private _node_count: number = -1,
        ) { }//constructor

        /**
         * 
         * Adds a node to the n-array tree. 
         * Updates the current node to the newly added node.
         *
         * @param new_name Name of the node, could be a string or lexeme
         * @param kind Root, Branch, or Leaf Node?
         */
        public add_node(new_name: string, kind: string, hasError: boolean = false, hasWarning: boolean = false, lex_token: LexicalToken = null, scope_table: ScopeTableModel = null) {
            this._node_count++

            // Construct the node object.
            let new_node = new Node(new_name, this._node_count, kind);
            new_node.errorFlag = hasError;
            new_node.warningFlag = hasWarning;
            new_node.setToken(lex_token);
            new_node.setScopeTable(scope_table);
            
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
            }// else

            // If we are an interior/branch node, then...
            if (kind == NODE_TYPE_BRANCH) {
                // ... update the CURrent node pointer to ourselves.
                this.current_node = new_node;
            }// if

            return this.current_node;
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
         * Recursively adds dashes "-" to show depth in the tree
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
                traversalResult += " [" + node.name + "]";
                traversalResult += "\n";

                return traversalResult;
            }// if

            else {
                // There are children_nodes, so note these interior/branch nodes and ...
                traversalResult += " (" + node.name + ") \n";

                // .. recursively expand them.
                for (var h = 0; h < node.children_nodes.length; h++) {
                    traversalResult = this.expand(node.children_nodes[h], depth + 1, traversalResult);
                }// for

                return traversalResult;
            }// else
        }// expand

        public toString(): string {
            // Initialize the result string.
            var traversalResult: string = "";

            // Make the initial call to expand from the root.
            return this.expand(this.root, 0, traversalResult);
        }// toString

        public toHtml() {
            // Initialize the result string.
            var cst: HTMLElement = document.getElementById('ast');
            var tree_div: HTMLElement = document.createElement(`div`);
            tree_div.className = `tree`;
            tree_div.id= `ast_p${this.program} `;
            cst.appendChild(tree_div);

            // Make the initial call to expand from the root
            // Create root first
            let ul: HTMLUListElement = document.createElement("ul");
            ul.id = `ast_p${this.program}_ul_node_id_0`;
            let li: HTMLLIElement = document.createElement("li");
            li.id = `ast_p${this.program}_li_node_id_0`;
            li.innerHTML = `<a onclick="NightingaleCompiler.CompilerController.compilerControllerBtnLightUpTree_click(${this.program}, 0, 'AST');" name = "node-anchor-tag">${this.root.name}</a>`;
            ul.appendChild(li);
            tree_div.appendChild(ul);

            this.traverse_tree(this.root);
        }// toHtml


        /**
         * Depth first traversal, to translate the tree into a series of <ul> and <li>.
         * 
         * Yes, this is a lot of brain damage.
         * 
         * @param root root node of the n-array tree
         */
        public traverse_tree(root: Node) {
            // Stack to store the nodes
            let nodes: Array<Node> = [];

            // push the current node onto the stack
            nodes.push(root);

            // Loop while the stack is not empty
            while (nodes.length !== 0) {

                // Store the current node and pop
                // it from the stack
                let curr: Node = nodes.pop();

                // Current node has been travarsed
                if (curr != null) {
                    // Root node
                    if (curr.parent_node == null) {
                        // Root node already created
                        ///console.log(`Current: ${curr.name} | ${curr.id}, Parent: ${curr.parent_node.id}`);
                    }// if

                    // Node is the first node of the parent
                    else if (curr.parent_node.children_nodes[0] == curr) {
                        let ul: HTMLUListElement = document.createElement("ul");
                        ul.id = `ast_p${this.program}_ul_node_id_${curr.id}`;
                        let li: HTMLLIElement= document.createElement("li");
                        li.id = `ast_p${this.program}_li_node_id_${curr.id}`;

                        ul.appendChild(li);

                        let innerHtml = `<a onclick="NightingaleCompiler.CompilerController.compilerControllerBtnLightUpTree_click(${this.program}, ${curr.id}, 'AST');" name = "node-anchor-tag" >${curr.name}</a>`;
                        li.innerHTML = innerHtml;
                        // Single characters alignment are off... Add padding to the left.
                        if (curr.name.length  >= 1 || curr.name.length  <= 3) {
                            li.style.paddingLeft = "1.5rem";
                        }// if

                        // Yellow for warnings, overriden with red for errors
                        if (curr.warningFlag) {
                            li.style.color = "yellow";
                        }// if
                        if (curr.errorFlag) {
                            li.style.color = "red";
                        }// if

                        document.getElementById(`ast_p${this.program}_li_node_id_${curr.parent_node.id}`).appendChild(ul);
                    }// if

                    // Node is 2nd or 3rd or nth child of parent
                    else {
                        let li: HTMLLIElement = document.createElement("li");
                        li.id = `ast_p${this.program}_li_node_id_${curr.id}`;

                        let innerHtml = `<a onclick="NightingaleCompiler.CompilerController.compilerControllerBtnLightUpTree_click(${this.program}, ${curr.id}, 'AST');" name = "node-anchor-tag">${curr.name}</a>`;
                        li.innerHTML = innerHtml;

                        // Single characters alignment are off... Add padding to the left.
                        if (curr.name.length  >= 1 || curr.name.length  <= 3) {
                            li.style.paddingLeft = "1.5rem";
                        }// if

                        // Yellow for warnings, overriden with red for errors
                        if (curr.warningFlag) {
                            li.style.color = "yellow";
                        }// if
                        if (curr.errorFlag) {
                            li.style.color = "red";
                        }// if
                        document.getElementById(`ast_p${this.program}_ul_node_id_${curr.parent_node.children_nodes[0].id}`).appendChild(li);
                    }// else

                    // Store all the children of 
                    // current node from right to left.
                    for (let i: number = curr.children_nodes.length - 1; i >= 0; --i) {
                        nodes.push(curr.children_nodes[i]);
                    }// for
                }// if
            }// while
        }// traverse tree
    }// class
}// module