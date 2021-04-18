/**
 * semantic.ts
 *
 * Author: Alex Badia
 *
 * This is the Semantic Analysis stage of compilation.
 *
 * Converts the Concrete Synstax Tree to an Abstract Syntax Tree.
 *
 * Depending on the grammar and rules of the language, there is no
 * general procedure for converting a Concrete Syntax Tree to an Abstract Syntax Tree.
 *
 * Key elements of the grammar must be identified and used in developing AST subtree patterns
 * for them. Specificallly, for our language, there are four key elements (a.k.a "good stuff"):
 *  - Block
 *  - Variable Declarations
 *  - Assignment Statements
 *  - Print Statements
 */
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class SemanticAnalysis {
        constructor(
        /**
         * Valid Concrete Syntax Trees passed from the parser.
         */
        concrete_syntax_trees, abstract_syntax_trees = Array(), _current_ast = null) {
            this.concrete_syntax_trees = concrete_syntax_trees;
            this.abstract_syntax_trees = abstract_syntax_trees;
            this._current_ast = _current_ast;
            this.main();
        } // constructor 
        main() {
            for (var cstIndex = 0; cstIndex < this.concrete_syntax_trees.length; ++cstIndex) {
                this.generate_abstract_syntax_tree(this.concrete_syntax_trees[cstIndex]);
                this.abstract_syntax_trees.push(this._current_ast);
            } // for
        } // main
        /**
         * All valid concrete syntax trees can be turned into an abstract syntax tree.
         *
         * Therefore, there should be a 1 to 1 ratio of CST and AST, meaning no CST should
         * be skipped for any reason when generating an AST... Theoretically?
         *
         */
        generate_abstract_syntax_tree(cst) {
            // Make new ast
            this._current_ast = new NightingaleCompiler.AbstractSyntaxTree();
            // Get program number from CST
            this._current_ast.program = cst.program;
            console.log("Program: " + cst.program);
            console.log("Root: " + cst.root.children_nodes[0].name);
            // Begin adding nodes to the ast from the cst, filtering for the key elements
            this.add_node_to_ast(cst.root.children_nodes[0]);
        } // generate_abstract_syntax_trees
        add_node_to_ast(cst_current_node) {
            switch (cst_current_node.name) {
                case NODE_NAME_BLOCK:
                    this._add_block_subtree_to_ast(cst_current_node);
                    break;
                // case NODE_NAME_STATEMENT_LIST:
                //     this._skip_statement_list(cst_current_node);
                //     break;
                // case NODE_NAME_STATEMENT:
                //     this._skip_statement(cst_current_node);
                //     break;
                case NODE_NAME_VARIABLE_DECLARATION:
                    this._add_variable_declaration_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_ASSIGNMENT_STATEMENT:
                    this._add_assignment_statement_subtree_to_ast(cst_current_node);
                    break;
                default:
                    break;
            } // switch
        } // add_node_to_ast
        _skip_node_for_ast(cst_current_node) {
            switch (cst_current_node.name) {
                case NODE_NAME_STATEMENT_LIST:
                    this._skip_statement_list(cst_current_node);
                    break;
                case NODE_NAME_STATEMENT:
                    this._skip_statement(cst_current_node);
                    break;
                default:
                    break;
            } // switch
        } // skip_node_for_ast
        _add_block_subtree_to_ast(cst_current_node) {
            // Add new BLOCK node
            this._current_ast.add_node(cst_current_node.name, NODE_TYPE_BRANCH);
            // Remember, if you built your tree correctly..
            //
            //   Node(Block).children[0] --> Open Block Lexem [{]
            //   Node(Block).children[1] --> Node(Statement List)
            //   Node(Block).children[2] --> Close Block Lexeme [}]
            //
            // Get child node, which should be a statement list
            let statement_list_node = cst_current_node.children_nodes[1];
            // Skip the statement list node
            this._skip_node_for_ast(statement_list_node);
        } // _add_block_subtree_to_ast
        _skip_statement_list(cst_current_node) {
            // Remember, if you built your tree correctly..
            //
            //   Node(Statement List).children[0] --> Node(Statement)
            //   Node(Statement List).children[1] --> Node(Statement List)
            //
            // Get statement node
            let statement_node = cst_current_node.children_nodes[0];
            // Skip over statement node
            this._skip_node_for_ast(statement_node);
            // If statement list follows, traverse and skip over it
            if (cst_current_node.children_nodes.length > 1) {
                // Get statement list node
                let statement_list_node = cst_current_node.children_nodes[1];
                // Skip statement list node
                this._skip_node_for_ast(statement_list_node);
            } // if
        } // _skip_statement_list
        _skip_statement(cst_current_node) {
            // Remember, if you built your tree correctly..
            //
            //   Node(Statement).children[0] --> Node(Print Statement)
            //                               --> Node(Assignment Statement)
            //                               --> Node(Variable Declaration)
            //                               --> Node(While Statement)
            //                               --> Node(If Statement)
            //                               --> Node(Block)
            //
            // Get statement value
            let statement_val = cst_current_node.children_nodes[0];
            // Add the statements (right-hand) value
            this.add_node_to_ast(statement_val);
        } // _skip_statement_list
        /**
         * Constructs a subtree in the abstract syntax tree
         * rooted with variable declaration and add two children:
         *  - type
         *  - id.
         *
         * @param cst_current_node current node in the cst
         */
        _add_variable_declaration_subtree_to_ast(cst_current_node) {
            // Add root node for variable declaration subtree
            this._current_ast.add_node(cst_current_node.name, NODE_TYPE_BRANCH);
            // Remember, if you built your tree correctly..
            //
            //   Node(Variable Declaration).children[0] --> Node(Type)
            //   Node(Variable Declaration).children[1] --> Node(Identifier)
            //
            //   AND
            //
            //   Node(Type).children[0] --> Type Lexeme
            //   Node(Identifier).children[0] --> Identifier Lexeme
            let type_node = cst_current_node.children_nodes[0].children_nodes[0];
            let identifier_node = cst_current_node.children_nodes[1].children_nodes[0];
            // Add children to ast subtree at the SAME LEVEL
            //
            // Meaning, climb up the tree ONE level after each insertion 
            // (since tree.addNode() inserts a new node at a new, increased, depth)
            this._current_ast.add_node(type_node.name, NODE_TYPE_BRANCH);
            this._climb_ast_one_level();
            this._current_ast.add_node(identifier_node.name, NODE_TYPE_BRANCH);
            this._climb_ast_one_level();
            // Point back to the root node of the variable declaration subtree
            this._climb_ast_one_level();
        } // _add_variable_declaration_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Assignment Statement and add two children:
         *   - id
         *   - results of the expression being assigned.
         * @param cst_current_node
         */
        _add_assignment_statement_subtree_to_ast(cst_current_node) {
            // Add root node for asignment statement subtree
            this._current_ast.add_node(cst_current_node.name, NODE_TYPE_BRANCH);
            // Remember, if you built your tree correctly..
            //
            //   Node(Assignment Statement).children[0] --> Node(Identifier)
            //   Node(Assignment Statement).children[1] --> Node(Assignment Operator)
            //   Node(Assignment Statement).children[2] --> Node(Expression)
            //
            //   AND
            //
            //   Node(Identifier).children[0] --> Identifier Lexeme
            //   Node(Expression).children[0] --> Node(Integer Expression)
            //                                --> Node(String Expression)
            //                                --> Node(Boolean Expression)
            //                                --> Node(Id)
            let identifier_node = cst_current_node.children_nodes[0].children_nodes[0];
            let expression_node = cst_current_node.children_nodes[2];
            // Add children to assignment_statement subtree at the SAME LEVEL
            this._current_ast.add_node(identifier_node.name, NODE_TYPE_BRANCH);
            this._climb_ast_one_level();
            // Add expression to assignment statement subtree
            this._add_expression_to_assignment_statement_subtree(cst_current_node, expression_node.children_nodes[0]);
        } // _add_assignment_statement_subtree_to_ast
        _add_expression_to_assignment_statement_subtree(cst_current_node, expression_node) {
            let result = "";
            switch (expression_node.children_nodes[0].name) {
                case NODE_NAME_INT_EXPRESSION:
                    // Add integer expression to assignment_statement subtree at the SAME Level
                    result = this._add_integer_expression_subtree_to_ast(cst_current_node, expression_node.children_nodes[0]);
                    break;
                case NODE_NAME_STRING_EXPRESSION:
                    // Add string expression to assignment_statement subtree at the SAME Level
                    result = this._add_string_expression_subtree_to_ast(cst_current_node, expression_node.children_nodes[0]);
                    break;
                case NODE_NAME_BOOLEAN_EXPRESSION:
                    // Add boolean expression to assignment_statement subtree at the SAME Level
                    break;
                case NODE_NAME_IDENTIFIER:
                    // Add identifier to ast subtree at the SAME Level
                    this._current_ast.add_node(expression_node.children_nodes[0].name, NODE_TYPE_LEAF);
                    this._climb_ast_one_level();
                    result = "id";
                    break;
                default:
                    // This should never happen, given a valid CST...
                    throw Error("Well, it happened... Semantic Analysis failed at _add_assignment_statement_subtree_to_ast() switch statement :(");
            } // switch
            return result;
        } // add_expression_to_assignment_statement_subtree
        _add_integer_expression_subtree_to_ast(cst_current_node, integer_expression_node) {
            // Integer Expression is just a DIGIT
            if (integer_expression_node.children_nodes.length === 1) {
                // Add identifier to ast subtree at the SAME Level
                this._current_ast.add_node(integer_expression_node.children_nodes[0].children_nodes[0].name, NODE_TYPE_LEAF);
                this._climb_ast_one_level();
                return NODE_NAME_INT_EXPRESSION;
            } // if
            // Integer expression is DIGIT INTOP EXPRESSION
            else if (integer_expression_node.children_nodes.length > 1) {
                // Remember, if you built your tree correctly...
                //
                //   Node(Integer Expression).children[0] --> Node(Digit)
                //   Node(Integer Expression).children[1] --> Node(Integer Operation)
                //   Node(Integer Expression).children[2] --> Node(Expression)
                //
                //   AND
                //
                //   Node(Digit).children[0] --> Digit Lexeme [0-9]
                //   Node(Integer Operation).children[0] --> Integer Operation Lexeme [+]
                //   
                //   Check this recurisvely:
                //     Node(Expression)
                // Add DIGIT to the assignment statement subtree at SAME LEVEL
                this._current_ast.add_node(integer_expression_node.children_nodes[0].children_nodes[0].name, NODE_TYPE_LEAF);
                this._climb_ast_one_level();
                // Add INT_OP to the assignment statement subtree at SAME LEVEL
                this._current_ast.add_node(integer_expression_node.children_nodes[1].children_nodes[0].name, NODE_TYPE_LEAF);
                this._climb_ast_one_level();
                // Add Expression to the assignment statement subtree
                this._add_expression_to_assignment_statement_subtree(cst_current_node, integer_expression_node.children_nodes[2]);
                this._climb_ast_one_level();
            } // else if
            else {
                // This should never happen, given a valid CST...
                throw Error("Semantic Analysis failed at add_integer_expression_subtree_to_ast()! IntExpr did not have DIGIT or DIGIT-INTOP-EXPR");
            } // else
        } // add_integer_expression_subtree_to_ast
        _add_string_expression_subtree_to_ast(cst_current_node, string_expression_node) {
            // Remember, if you built your tree correctly...
            //
            //   Node(String Expression).children[0] --> Open String Expression boundary ["]
            //   Node(String Expression).children[1] --> Node(Character List)
            //   Node(String Expression).children[2] --> Close String Expression boundary ["]
            //
            //   AND...
            //
            //   Node(Character List).children[0] --> Node(Character)
            //   Node(Character List).children[1] --> Node(Character List)
            //   
            //   AND...
            //   
            //   Node(Character) --> Character Lexeme
            //   
            //   Check recurisvely:
            //     Node(Character List)
            let string = "";
            let curr_node = string_expression_node.children_nodes[2];
            // Get entire string
            while (curr_node != null) {
                // Apeend each character to string
                string += curr_node.children_nodes[0].children_nodes[0].name;
                // Ran out of characters
                if (curr_node.children_nodes[1] === undefined || curr_node.children_nodes[1] === null) {
                    break;
                } // if
                // Get next character list
                else {
                    curr_node = curr_node.children_nodes[1];
                } // else
            } // while
            this._current_ast.add_node(string, NODE_TYPE_LEAF);
            this._climb_ast_one_level();
            return NODE_NAME_STRING_EXPRESSION;
        } // add_string_expression_subtree_to_ast
        _add_boolean_expression_subtree_to_ast() {
        } // add_boolean_expression_subtree_to_ast
        /**
         * Moves the AST's current node pointer up one level in the tree (to the parent node)
         */
        _climb_ast_one_level() {
            if (this._current_ast.current_node !== undefined || this._current_ast.current_node !== null) {
                this._current_ast.climb_one_level();
            } // if
        } // climb_ast_one
    } // class
    NightingaleCompiler.SemanticAnalysis = SemanticAnalysis;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=semantic_analysis.js.map