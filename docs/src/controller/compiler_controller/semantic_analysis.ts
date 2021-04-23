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
 * for them. Specificallly, for our language, there are six key elements (a.k.a "good stuff"):
 *  - Block
 *  - Variable Declarations
 *  - Assignment Statements
 *  - Print Statements
 *  - While Statements
 *  - If Statements
 */

module NightingaleCompiler {
    export class SemanticAnalysis {
        constructor(
            /**
             * Valid Concrete Syntax Trees passed from the parser.
             */
            public concrete_syntax_trees: Array<ConcreteSyntaxTree>,

            public invalid_parsed_programs: Array<number>,

            public abstract_syntax_trees: Array<AbstractSyntaxTree> = Array<AbstractSyntaxTree>(),

            private _current_ast: AbstractSyntaxTree = null,
        ) {
            this.main();
        }// constructor 

        private main(): void {
            for (var cstIndex: number = 0; cstIndex < this.concrete_syntax_trees.length; ++cstIndex) {
                // Skip invalid parsed programs... 
                // Probably shouldn't be passing invalid parse trees around, though
                // It's be cool to show visually, where exactly the parse tree messed up
                if (!this.invalid_parsed_programs.includes(this.concrete_syntax_trees[cstIndex].program)) {
                    this.generate_abstract_syntax_tree(this.concrete_syntax_trees[cstIndex]);
                    this.abstract_syntax_trees.push(this._current_ast);
                }// if
            }// for
        }// main

        /**
         * All valid concrete syntax trees can be turned into an abstract syntax tree.
         * 
         * Therefore, there should be a 1 to 1 ratio of CST and AST, meaning no CST should
         * be skipped for any reason when generating an AST... Theoretically?
         * 
         */
        private generate_abstract_syntax_tree(cst: ConcreteSyntaxTree): void {
            // Make new ast
            this._current_ast = new AbstractSyntaxTree();

            // Get program number from CST
            this._current_ast.program = cst.program;

            console.log("Program: " + cst.program);
            console.log("Root: " + cst.root.children_nodes[0].name);

            // Begin adding nodes to the ast from the cst, filtering for the key elements
            this.add_subtree_to_ast(cst.root.children_nodes[0]);
        }// generate_abstract_syntax_trees

        private add_subtree_to_ast(cst_current_node: Node): void {
            switch (cst_current_node.name) {
                case NODE_NAME_BLOCK:
                    this._add_block_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_VARIABLE_DECLARATION:
                    this._add_variable_declaration_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_ASSIGNMENT_STATEMENT:
                    this._add_assignment_statement_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_PRINT_STATEMENT:
                    this._add_print_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_WHILE_STATEMENT:
                    this._add_while_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_IF_STATEMENT:
                    this._add_if_subtree_to_ast(cst_current_node);
                    break;
                default:
                    break;
            }// switch
            this._climb_ast_to_block();
        }// add_subtree_to_ast

        private _skip_node_for_ast(cst_current_node: Node): void {
            switch (cst_current_node.name) {
                case NODE_NAME_STATEMENT:
                    this._skip_statement(cst_current_node);
                    break;
                case NODE_NAME_STATEMENT_LIST:
                    this._skip_statement_list(cst_current_node);
                    break;
                default:
                    break;
            }// switch
        }// skip_node_for_ast

        /**
         * Constructs a subtree in the abstract syntax tree 
         * rooted with Block and adds the child:
         *  - statement list
         * 
         * @param cst_current_node current node in the cst
         */
        private _add_block_subtree_to_ast(cst_current_node: Node): void {
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
        }// _add_block_subtree_to_ast

        private _skip_statement_list(cst_current_node: Node): void {
            // Remember, if you built your tree correctly..
            //
            //   Node(Statement List).children[0] --> Node(Statement)
            //   Node(Statement List).children[1] --> Node(Statement List)
            //
            // Get statement node
            let statement_node: Node = cst_current_node.children_nodes[0];

            // Skip over statement node
            this._skip_node_for_ast(statement_node);

            // If statement list follows, traverse and skip over it
            if (cst_current_node.children_nodes.length > 1) {
                // Get statement list node
                let statement_list_node: Node = cst_current_node.children_nodes[1];

                // Skip statement list node
                this._skip_node_for_ast(statement_list_node);
            }// if
        }// _skip_statement_list

        private _skip_statement(cst_current_node: Node): void {
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
            let statement_val: Node = cst_current_node.children_nodes[0];

            // Add the statements (right-hand) value
            this.add_subtree_to_ast(statement_val);
        }// _skip_statement_list

        /**
         * Constructs a subtree in the abstract syntax tree 
         * rooted with variable declaration and add two children:
         *  - type
         *  - id.
         * 
         * @param cst_current_node current node in the cst
         */
        private _add_variable_declaration_subtree_to_ast(cst_current_node: Node): void {
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
            let type_node: Node = cst_current_node.children_nodes[0].children_nodes[0];
            let identifier_node: Node = cst_current_node.children_nodes[1].children_nodes[0];

            // Add children to ast subtree at the SAME LEVEL
            //
            // Meaning, climb up the tree ONE level after each insertion 
            // (since tree.addNode() inserts a new node at a new, increased, depth)
            this._current_ast.add_node(type_node.name, NODE_TYPE_BRANCH);
            this._climb_ast_one_level();
            this._current_ast.add_node(identifier_node.name, NODE_TYPE_BRANCH);
            this._climb_ast_one_level();

            // Point back to the parent of root node of the variable declaration subtree
            this._climb_ast_one_level();
        }// _add_variable_declaration_subtree_to_ast

        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Assignment Statement and add two children:
         *   - id 
         *   - results of the expression being assigned.
         * 
         * @param cst_current_node current node in the cst
         */
        private _add_assignment_statement_subtree_to_ast(cst_current_node: Node): void {
            // Add root Node(Assignment Statement) for asignment statement subtree
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
            //
            // Add the identifier to assignment statement subtree
            let identifier_node: Node = cst_current_node.children_nodes[0].children_nodes[0];
            this._current_ast.add_node(identifier_node.name, NODE_TYPE_LEAF);

            // Ignore the assignment operator: Node(=)
            // let assignment_op = cst_current_node.children_nodes[1]

            // Add the expression node to assignment statement subtree at the SAME LEVEL
            let expression_node: Node = cst_current_node.children_nodes[2];
            this._add_expression_subtree(expression_node);
        }// _add_assignment_statement_subtree_to_ast

        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Expression and add one of the following children:
         *   - Integer Expression 
         *   - String Expression
         *   - Boolean Expression
         *   - Identifier
         */
        private _add_expression_subtree(expression_node: Node): string {
            let result = "";
            console.log(expression_node.name);
            switch (expression_node.children_nodes[0].name) {
                case NODE_NAME_INT_EXPRESSION:
                    this._add_integer_expression_subtree_to_ast(expression_node.children_nodes[0])
                    break;

                case NODE_NAME_STRING_EXPRESSION:
                    this._add_string_expression_subtree_to_ast(expression_node.children_nodes[0]);
                    break;

                case NODE_NAME_BOOLEAN_EXPRESSION:
                    this._add_boolean_expression_subtree_to_ast(expression_node.children_nodes[0]);
                    break;

                case NODE_NAME_IDENTIFIER:
                    // Add identifier to ast subtree at the SAME Level
                    this._current_ast.add_node(expression_node.children_nodes[0].name, NODE_TYPE_LEAF)
                    break;

                default:
                    // This should never happen, given a valid CST...
                    throw Error("Well, it happened... Semantic Analysis failed at _add_assignment_statement_subtree_to_ast() switch statement :(");
            }// switch

            return result;
        }// add_expression_to_assignment_statement_subtree

        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Integer Expression adds either:
         *   - Digit--IntOp--Expression
         *  OR...
         *   - Digit
         */
        private _add_integer_expression_subtree_to_ast(integer_expression_node: Node) {
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

            // Integer expression is DIGIT--INTOP--EXPRESSION
            if (integer_expression_node.children_nodes.length > 1) {
                let integer_operation_lexeme_node: Node = integer_expression_node.children_nodes[1].children_nodes[0];
                let expression_node: Node = integer_expression_node.children_nodes[2];

                // Add INT_OP to the assignment statement subtree at SAME LEVEL as identifier
                this._current_ast.add_node(integer_operation_lexeme_node.name, NODE_TYPE_BRANCH);

                // Add DIGIT to ast subtree
                this._current_ast.add_node(integer_expression_node.children_nodes[0].children_nodes[0].name, NODE_TYPE_LEAF);

                // Add Expression to the assignment statement subtree
                this._add_expression_subtree(expression_node);
            }// if

            else if (integer_expression_node.children_nodes.length === 1) {
                // Add DIGIT to ast subtree
                this._current_ast.add_node(integer_expression_node.children_nodes[0].children_nodes[0].name, NODE_TYPE_LEAF);
            }// else if 

            else {
                // This should never happen based on our language
                throw ("AST failed to find children for CST Integer Expression Node!");
            }// else
        }// add_integer_expression_subtree_to_ast

        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an String Expression adds:
         *   - " CharList "
         */
        private _add_string_expression_subtree_to_ast(string_expression_node: Node) {
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

            let string: string = "\"";

            // Not an empty string, iteratively add each character.
            if (string_expression_node.children_nodes.length > 2) {
                let curr_char_list_node: Node = string_expression_node.children_nodes[1];
                console.log(curr_char_list_node.name);

                // Get entire string
                while (curr_char_list_node !== undefined && curr_char_list_node !== null) {
                    // Get Character Node
                    let char_node: Node = curr_char_list_node.children_nodes[0];

                    // Get Character Lexeme Node
                    let char_lexeme_node: Node = char_node.children_nodes[0];

                    // Append the string value
                    string += char_lexeme_node.name;

                    // Get next charlist, if it exists
                    if (curr_char_list_node.children_nodes.length > 1) {
                        curr_char_list_node = curr_char_list_node.children_nodes[1];
                    }// if

                    // Ran out of charlists, so return current string
                    else {
                        break;
                    }// else
                }// while
            }// else

            string += "\"";
            this._current_ast.add_node(string, NODE_TYPE_LEAF);
        }// add_string_expression_subtree_to_ast

        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Boolean Expression adds:
         *   - (Expression BoolOp Expression)
         * OR...
         *   - Boolean Value [true | false]
         */
        private _add_boolean_expression_subtree_to_ast(boolean_expression_node: Node): void {
            // Remember, if you built your tree correctly...
            //
            //   Node(Boolean Expression).children[0] --> Open String Expression boundary [(]
            //   Node(Boolean Expression).children[1] --> Node(Expression)
            //   Node(Boolean Expression).children[2] --> Node(Boolean Operator)
            //   Node(Boolean Expression).children[3] --> Node(Expression)
            //   Node(Boolean Expression).children[4] --> Close String Expression boundary [)]
            //
            //   OR...
            //
            //   Node(Boolean Expression).children[0] --> Node(Boolean Value)
            //
            // Boolean expression is: ( Expr BoolOp Expr )
            if (boolean_expression_node.children_nodes.length > 1) {
                // Ignore Open Parenthesis
                // let open_parenthisis_node = boolean_expression_node.children_nodes[0];

                // Add the Boolean Operator First
                let boolean_operator_node: Node = boolean_expression_node.children_nodes[2];
                let boolean_operator_value_node: Node = boolean_operator_node.children_nodes[0];
                this._current_ast.add_node(boolean_operator_value_node.name, NODE_TYPE_BRANCH);

                // Add Expressions as children of the Boolean Operator
                let left_expression_node: Node = boolean_expression_node.children_nodes[1];
                console.log("Left: " + left_expression_node.name);
                this._add_expression_subtree(left_expression_node);
                let right_expression_node: Node = boolean_expression_node.children_nodes[3];
                console.log("Right: " + right_expression_node.name);
                this._add_expression_subtree(right_expression_node);
                // Ignore End Parenthesis
                // let open_parenthisis_node = boolean_expression_node.children_nodes[4];
            }// if

            // Boolean expression is just a boolean value...
            else if (boolean_expression_node.children_nodes.length === 1) {
                let boolean_value_node: Node = boolean_expression_node.children_nodes[0];
                let boolean_node: Node = boolean_value_node.children_nodes[0];
                this._current_ast.add_node(boolean_node.name, NODE_TYPE_LEAF);
            }// else if

            // This should never happen...
            else {
                throw Error("You messed up Parse: Boolean expression has no children, or negative children.");
            }// else 
        }// add_boolean_expression_subtree_to_ast

        private _add_print_subtree_to_ast(print_node: Node) {
            // Remember, if you built your tree correctly...
            //
            //   Node(Print).children[0] --> Keyword Print [print]
            //   Node(Print).children[1] --> Open Parenthesis [(]
            //   Node(Print).children[2] --> Node(Expression)
            //   Node(Print).children[3] --> Open Parenthesis [)]
            //
            // Add Print Statment
            this._current_ast.add_node(print_node.name, NODE_TYPE_BRANCH);

            // Ignore: 
            //   - let keyword_print_node = print_node.children_nodes[0]
            //   - let open_argument_node = print_node.children_nodes[1]
            //   - let close_argument_node = print_node.children_nodes[3]
            //
            // Add Expression Node
            let expression_node = print_node.children_nodes[2];
            this._add_expression_subtree(expression_node);
        }// _add_print_subtree_to_ast

        private _add_while_subtree_to_ast(while_node: Node) {
            throw Error("Unimplemented Error: While Statement Subtree Pattern");
        }// _add_while_subtree_to_ast

        private _add_if_subtree_to_ast(if_node: Node) {
            throw Error("Unimplemented Error: If Statement Subtree Pattern");
        }// _add_if_subtree_to_ast

        /**
         * Moves the AST's current node pointer up one level in the tree (to the parent node)
         */
        private _climb_ast_one_level(): void {
            if (this._current_ast.current_node !== undefined || this._current_ast.current_node !== null) {
                this._current_ast.climb_one_level();
            }// if
        }// climb_ast_one

        /**
         * Moves the AST's current node pointer up one level
         * at a time and stops on a Node(Block) when reached.
         */
        private _climb_ast_to_block(): void {
            // If already at a block, try to climb one node higher...
            if (this._current_ast.current_node.name === NODE_NAME_BLOCK) {
                this._climb_ast_one_level();
            }// if

            // Climbs to the nearest parent Node(Block)
            while (
                (this._current_ast.current_node !== undefined || this._current_ast.current_node !== null)
                && this._current_ast.current_node.name !== NODE_NAME_BLOCK) {
                if (this._current_ast.current_node.name !== NODE_NAME_BLOCK) {
                    this._current_ast.climb_one_level();
                }// if
            }// while
        }// _climb_ast_to_block
    }// class
}// module