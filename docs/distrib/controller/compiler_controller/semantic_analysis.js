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
var NightingaleCompiler;
(function (NightingaleCompiler) {
    class SemanticAnalysis {
        constructor(concrete_syntax_trees, invalid_parsed_programs) {
            this.concrete_syntax_trees = concrete_syntax_trees;
            this.invalid_parsed_programs = invalid_parsed_programs;
            this.abstract_syntax_trees = Array();
            this.invalid_semantic_programs = [];
            this._current_ast = null;
            this._current_scope_tree = null;
            this.scope_trees = Array();
            this.output = [];
            this.verbose = [];
            this.errors = 0;
            this.warnings = 0;
            this.main();
        } // constructor 
        main() {
            for (var cstIndex = 0; cstIndex < this.concrete_syntax_trees.length; ++cstIndex) {
                // Capture messages from lexer for each program
                this.output.push(new Array());
                this.verbose.push(new Array());
                // Skips invalid parsed programs
                //
                // Probably shouldn't be passing invalid parse trees around, though
                // It'd be cool to show visually, where exactly the parse tree messed up
                if (!this.invalid_parsed_programs.includes(this.concrete_syntax_trees[cstIndex].program)) {
                    this.output[cstIndex].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Perfomring Semantic Analysis on program ${this.concrete_syntax_trees[cstIndex].program + 1}...`) // OutputConsoleMessage
                    ); // this.output[cstIndex].push
                    // Create a scope tree
                    this._current_scope_tree = new NightingaleCompiler.ScopeTreeModel();
                    this._current_scope_tree.program = this.concrete_syntax_trees[cstIndex].program;
                    this.scope_trees.push(this._current_scope_tree);
                    // Traverse the CST and create the AST while also doing type and scope checking
                    this.generate_abstract_syntax_tree(this.concrete_syntax_trees[cstIndex]);
                    this.abstract_syntax_trees.push(this._current_ast);
                    this.output[cstIndex].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Semantic Analysis on program ${this.concrete_syntax_trees[cstIndex].program + 1} completed with ${this.warnings} warning(s) and ${this.errors} error(s)`) // OutputConsoleMessage
                    ); // this.output[cstIndex].push
                    this.verbose[cstIndex].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Semantic Analysis on program ${this.concrete_syntax_trees[cstIndex].program + 1} completed with ${this.warnings} warning(s) and ${this.errors} error(s)`) // OutputConsoleMessage
                    ); // this.verbose[cstIndex].push
                    this.warnings = 0;
                    this.errors = 0;
                } // if
                // Tell user, skipped the program
                else {
                    this.output[cstIndex].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Skipping program ${this.concrete_syntax_trees[cstIndex].program + 1} due to parse errors.`));
                    this.verbose[cstIndex].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Skipping program ${this.concrete_syntax_trees[cstIndex].program + 1} due to parse errors.`));
                }
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
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Generating Abstract Syntax Tree...`));
            // Make new ast
            this._current_ast = new NightingaleCompiler.AbstractSyntaxTree();
            // Get program number from CST
            this._current_ast.program = cst.program;
            // Begin adding nodes to the ast from the cst, filtering for the key elements
            this.add_subtree_to_ast(cst.root.children_nodes[0]);
        } // generate_abstract_syntax_trees
        add_subtree_to_ast(cst_current_node, current_scope_table = null) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Attempting to add ${cst_current_node.name} subtree to abstract syntax tree.`));
            switch (cst_current_node.name) {
                case NODE_NAME_BLOCK:
                    this._add_block_subtree_to_ast(cst_current_node);
                    break;
                case NODE_NAME_VARIABLE_DECLARATION:
                    this._add_variable_declaration_subtree_to_ast(cst_current_node, current_scope_table);
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
                    throw Error(`Semantic Analysis Failed: [${cst_current_node.name}] does not have a valid child [BLOCK, VARIABLE DECLARATION< ASSIGNMENT STATEMENT, PRINT STATEMENT, WHILE STATEMENT, IF STATEMENT]`);
            } // switch
            this._climb_ast_to_block();
        } // add_subtree_to_ast
        _skip_node_for_ast(cst_current_node, current_scope_table) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Traversing over ${cst_current_node.name} concrete syntax tree node.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            switch (cst_current_node.name) {
                case NODE_NAME_STATEMENT:
                    this._skip_statement(cst_current_node, current_scope_table);
                    break;
                case NODE_NAME_STATEMENT_LIST:
                    this._skip_statement_list(cst_current_node, current_scope_table);
                    break;
                default:
                    throw Error(`Semantic Analysis Failed: [${cst_current_node.name}] does not have a valid child [STATEMENT, STATEMENT_LIST]`);
            } // switch
        } // skip_node_for_ast
        /**
         * Constructs a subtree in the abstract syntax tree
         * rooted with Block and adds the child:
         *  - statement list
         *
         * @param cst_current_node current node in the cst
         */
        _add_block_subtree_to_ast(cst_current_node) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Adding ${cst_current_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            // Add new BLOCK node
            // SYMBOL_OPEN_BLOCK Token
            this._current_ast.add_node(cst_current_node.name, NODE_TYPE_BRANCH, true, cst_current_node.getToken());
            // Remember, if you built your tree correctly..
            //
            //   Node(Block).children[0] --> Open Block Lexem [{]
            //   Node(Block).children[1] --> Node(Statement List)
            //   Node(Block).children[2] --> Close Block Lexeme [}]
            //
            // Get child node, which should be a statement list
            let statement_list_node = cst_current_node.children_nodes[1];
            // Add a new scope node to the scope tree
            let scope_table = new NightingaleCompiler.ScopeTableModel();
            this._current_scope_tree.add_node(NODE_NAME_SCOPE, NODE_TYPE_BRANCH, scope_table);
            // Skip the statement list node
            if (cst_current_node.children_nodes.length === 3) {
                this._skip_node_for_ast(statement_list_node, scope_table);
                this._current_scope_tree.climb_one_level();
            } // if
            else {
                // Do nothing, it's an empty block
                this._current_scope_tree.climb_one_level();
            } // else
        } // _add_block_subtree_to_ast
        _skip_statement_list(cst_current_node, current_scope_table) {
            // Remember, if you built your tree correctly..
            //
            //   Node(Statement List).children[0] --> Node(Statement)
            //   Node(Statement List).children[1] --> Node(Statement List)
            //
            // Get statement node
            let statement_node = cst_current_node.children_nodes[0];
            // Skip over statement node
            this._skip_node_for_ast(statement_node, current_scope_table);
            // If statement list follows, traverse and skip over it
            if (cst_current_node.children_nodes.length > 1) {
                // Get statement list node
                let statement_list_node = cst_current_node.children_nodes[1];
                // Skip statement list node
                this._skip_node_for_ast(statement_list_node, current_scope_table);
            } // if
        } // _skip_statement_list
        _skip_statement(cst_current_node, current_scope_table) {
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
            this.add_subtree_to_ast(statement_val, current_scope_table);
        } // _skip_statement_list
        /**
         * Constructs a subtree in the abstract syntax tree
         * rooted with variable declaration and add two children:
         *  - type
         *  - id.
         *
         * @param cst_current_node current node in the cst
         */
        _add_variable_declaration_subtree_to_ast(cst_current_node, current_scope_table) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding variable declaration subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
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
            // Check current scope table
            let noCollision = current_scope_table.put(identifier_node.name, new NightingaleCompiler.VariableMetaData(type_node.name, false, cst_current_node.getToken().lineNumber, cst_current_node.getToken().linePosition) // VariableMetaData
            ); // current_scope_table.put
            // Mark as invalid if collison
            if (!noCollision) {
                if (!this.invalid_semantic_programs.includes(this._current_ast.program)) {
                    this.invalid_semantic_programs.push(this._current_ast.program);
                } // if
                this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, ERROR, `Duplicate variable declaration at ${cst_current_node.getToken().lineNumber}:${cst_current_node.getToken().linePosition}`));
                this.errors += 1;
            } // if
            // Add root node for variable declaration subtree
            // Token is: KEYWORD_INT, KEYWORD_BOOLEAN or KEYWORD_STRING
            this._current_ast.add_node(cst_current_node.name, NODE_TYPE_BRANCH, noCollision, cst_current_node.getToken());
            // Add children to ast subtree at the SAME LEVEL
            //
            // Meaning, climb up the tree ONE level after each insertion 
            // (since tree.addNode() inserts a new node at a new, increased, depth)
            this._current_ast.add_node(type_node.name, NODE_TYPE_BRANCH, noCollision, cst_current_node.getToken());
            this._climb_ast_one_level();
            this._current_ast.add_node(identifier_node.name, NODE_TYPE_BRANCH, noCollision, cst_current_node.getToken());
            this._climb_ast_one_level();
        } // _add_variable_declaration_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Assignment Statement and add two children:
         *   - id
         *   - results of the expression being assigned.
         *
         * @param cst_current_node current node in the cst
         */
        _add_assignment_statement_subtree_to_ast(cst_current_node) {
            var _a;
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding assignment statement subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
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
            // Check scope tree if the variable exists and get its type
            let var_matadata = this.is_variable_declared(identifier_node);
            // Add root Node(Assignment Statement) for asignment statement subtree
            this._current_ast.add_node(cst_current_node.name, NODE_TYPE_BRANCH, (var_matadata !== null));
            // Add the identifier to assignment statement subtree
            this._current_ast.add_node(identifier_node.name, NODE_TYPE_LEAF, (var_matadata !== null), cst_current_node.getToken());
            // Ignore the assignment operator: Node(=)
            // let assignment_op = cst_current_node.children_nodes[1]
            // Add the expression node to assignment statement subtree at the SAME LEVEL
            let expression_node = cst_current_node.children_nodes[2];
            // I've used null-aware operators in Dart, apparently Typescript has them too, damn...
            this._add_expression_subtree(expression_node, (_a = var_matadata === null || var_matadata === void 0 ? void 0 : var_matadata.type) !== null && _a !== void 0 ? _a : UNDEFINED);
        } // _add_assignment_statement_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Expression and add one of the following children:
         *   - Integer Expression
         *   - String Expression
         *   - Boolean Expression
         *   - Identifier
         */
        _add_expression_subtree(expression_node, parent_var_type) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, INFO, `Attempting to add ${expression_node.children_nodes[0].name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            switch (expression_node.children_nodes[0].name) {
                case NODE_NAME_INT_EXPRESSION:
                    this._add_integer_expression_subtree_to_ast(expression_node.children_nodes[0], parent_var_type);
                    return INT;
                case NODE_NAME_STRING_EXPRESSION:
                    this._add_string_expression_subtree_to_ast(expression_node.children_nodes[0], parent_var_type);
                    return STRING;
                case NODE_NAME_BOOLEAN_EXPRESSION:
                    this._add_boolean_expression_subtree_to_ast(expression_node.children_nodes[0], parent_var_type);
                    return BOOLEAN;
                case NODE_NAME_IDENTIFIER:
                    // Make sure identifier was declared
                    let var_metadata = this.is_variable_declared(expression_node.children_nodes[0].children_nodes[0]);
                    let curr_var_type = UNDEFINED;
                    if (var_metadata !== null) {
                        curr_var_type = var_metadata.type;
                        // If parent data type wasn't specified make it equal to the current datatype
                        if (parent_var_type === UNDEFINED) {
                            parent_var_type = curr_var_type;
                        } // if
                        this.check_type(parent_var_type, expression_node.children_nodes[0], curr_var_type);
                    } // if
                    // Add identifier to ast subtree at the SAME Level
                    this._current_ast.add_node(expression_node.children_nodes[0].children_nodes[0].name, NODE_TYPE_LEAF, (var_metadata !== null), expression_node.children_nodes[0].children_nodes[0].getToken());
                    return curr_var_type;
                default:
                    throw Error(`Semantic Analysis Failed: [${expression_node.name}] does not have a valid child [INT EXPRESSION, STRING EXPRESSION, BOOLEAN EXPRESSION, IDENTIFIER]`);
            } // switch
        } // add_expression_to_assignment_statement_subtree
        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Integer Expression adds either:
         *   - Digit--IntOp--Expression
         *  OR...
         *   - Digit
         */
        _add_integer_expression_subtree_to_ast(integer_expression_node, parent_var_type) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding ${integer_expression_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
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
            //
            // Integer expression is DIGIT--INTOP--EXPRESSION
            let digit_value_node = integer_expression_node.children_nodes[0].children_nodes[0];
            // If there's no parent variable type to compare to, make the type an int
            let valid_type = true;
            if (parent_var_type === UNDEFINED) {
                parent_var_type = INT;
            } // if
            else {
                valid_type = this.check_type(parent_var_type, digit_value_node, INT);
            } // else
            if (integer_expression_node.children_nodes.length > 1) {
                let integer_operation_lexeme_node = integer_expression_node.children_nodes[1].children_nodes[0];
                let expression_node = integer_expression_node.children_nodes[2];
                // Add INT_OP to the assignment statement subtree at SAME LEVEL as identifier
                this._current_ast.add_node(integer_operation_lexeme_node.name, NODE_TYPE_BRANCH, valid_type, integer_operation_lexeme_node.getToken());
                // Add DIGIT to ast subtree
                this._current_ast.add_node(digit_value_node.name, NODE_TYPE_LEAF, valid_type, digit_value_node.getToken());
                // Add Expression to the assignment statement subtree
                this._add_expression_subtree(expression_node, parent_var_type);
            } // if
            else if (integer_expression_node.children_nodes.length === 1) {
                // Add DIGIT to ast subtree
                this._current_ast.add_node(digit_value_node.name, NODE_TYPE_LEAF, valid_type, digit_value_node.getToken());
            } // else if 
            else {
                // This should never happen based on our language
                throw ("AST failed to find children for CST Integer Expression Node!");
            } // else
        } // add_integer_expression_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an String Expression adds:
         *   - " CharList "
         */
        _add_string_expression_subtree_to_ast(string_expression_node, parent_var_type) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding ${string_expression_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
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
            let open_string_expression_node = string_expression_node.children_nodes[0];
            // Check current string type to parent type
            let valid_type = true;
            if (parent_var_type === UNDEFINED) {
                parent_var_type = STRING;
            } // if
            else {
                valid_type = this.check_type(parent_var_type, open_string_expression_node, STRING);
            } // else
            let string = "\"";
            // Not an empty string, iteratively add each character.
            if (string_expression_node.children_nodes.length > 2) {
                let curr_char_list_node = string_expression_node.children_nodes[1];
                // Get entire string
                while (curr_char_list_node !== undefined && curr_char_list_node !== null) {
                    // Get Character Node
                    let char_node = curr_char_list_node.children_nodes[0];
                    // Get Character Lexeme Node
                    let char_lexeme_node = char_node.children_nodes[0];
                    // Append the string value
                    string += char_lexeme_node.name;
                    // Get next charlist, if it exists
                    if (curr_char_list_node.children_nodes.length > 1) {
                        curr_char_list_node = curr_char_list_node.children_nodes[1];
                    } // if
                    // Ran out of charlists, so return current string
                    else {
                        break;
                    } // else
                } // while
            } // else
            string += "\"";
            this._current_ast.add_node(string, NODE_TYPE_LEAF, valid_type);
        } // add_string_expression_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree
         * rooted with an Boolean Expression adds:
         *   - (Expression BoolOp Expression)
         * OR...
         *   - Boolean Value [true | false]
         */
        _add_boolean_expression_subtree_to_ast(boolean_expression_node, parent_var_type) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding ${boolean_expression_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
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
            let boolean_value_node = boolean_expression_node.children_nodes[0];
            let boolean_node = boolean_value_node.children_nodes[0];
            // Check type
            let valid_type = true;
            if (parent_var_type === UNDEFINED) {
                parent_var_type = BOOLEAN;
            } // if
            else {
                valid_type = this.check_type(parent_var_type, boolean_node, BOOLEAN);
            } // else
            if (boolean_expression_node.children_nodes.length > 1) {
                // Ignore Open Parenthesis
                // let open_parenthisis_node = boolean_expression_node.children_nodes[0];
                let boolean_operator_node = boolean_expression_node.children_nodes[2];
                let boolean_operator_value_node = boolean_operator_node.children_nodes[0];
                let left_expression_node = boolean_expression_node.children_nodes[1];
                let right_expression_node = boolean_expression_node.children_nodes[3];
                // Add the Boolean Operator First
                this._current_ast.add_node(boolean_operator_value_node.name, NODE_TYPE_BRANCH, valid_type, boolean_operator_value_node.getToken());
                // Make sure left and right expression are of the same type
                // Add Expressions as children of the Boolean Operator
                let left_expression_type = this._add_expression_subtree(left_expression_node, UNDEFINED);
                if (left_expression_node.children_nodes[0].children_nodes[0].name == "(") {
                    this._climb_ast_one_level();
                } // if
                let right_expression_type = this._add_expression_subtree(right_expression_node, left_expression_type);
                // Ignore End Parenthesis
                // let open_parenthisis_node = boolean_expression_node.children_nodes[4];
                return NODE_NAME_BOOLEAN_EXPRESSION;
            } // if
            // Boolean expression is just a boolean value...
            else if (boolean_expression_node.children_nodes.length === 1) {
                this._current_ast.add_node(boolean_node.name, NODE_TYPE_LEAF, valid_type);
                return NODE_NAME_BOOLEAN_VALUE;
            } // else if
            // This should never happen...
            else {
                throw Error("You messed up Parse: Boolean expression has no children, or negative children.");
            } // else 
        } // add_boolean_expression_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree rooted with the Keyword Print and adds:
         *   - Expression
         */
        _add_print_subtree_to_ast(print_node) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding ${print_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            // Remember, if you built your tree correctly...
            //
            //   Node(Print).children[0] --> Keyword Print [print]
            //   Node(Print).children[1] --> Open Parenthesis [(]
            //   Node(Print).children[2] --> Node(Expression)
            //   Node(Print).children[3] --> Open Parenthesis [)]
            //
            // Add Print Statment
            this._current_ast.add_node(print_node.name, NODE_TYPE_BRANCH, true, print_node.getToken());
            // Ignore: 
            //   - let keyword_print_node = print_node.children_nodes[0]
            //   - let open_argument_node = print_node.children_nodes[1]
            //   - let close_argument_node = print_node.children_nodes[3]
            //
            // Add Expression Node
            let expression_node = print_node.children_nodes[2];
            this._add_expression_subtree(expression_node, UNDEFINED);
        } // _add_print_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree rooted with the Keyword While and adds:
         *   - Boolean Expression
         *   - Block
         */
        _add_while_subtree_to_ast(while_node) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding ${while_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            // Remember, if you built your tree correctly...
            //
            //   Node(While).children[0] --> Keyword While [while]
            //   Node(While).children[1] --> Node(Boolean Expression)
            //   Node(While).children[2] --> Node(Block)
            //
            // Add While Statment
            this._current_ast.add_node(while_node.children_nodes[0].name, NODE_TYPE_BRANCH, true, while_node.children_nodes[0].getToken());
            // Add boolean expression node to subtree
            let node_name = this._add_boolean_expression_subtree_to_ast(while_node.children_nodes[1], BOOLEAN);
            // Add the Block subtree directly under the While Statement Keyword
            if (node_name === NODE_NAME_BOOLEAN_EXPRESSION) {
                this._climb_ast_one_level();
            } // if
            this._add_block_subtree_to_ast(while_node.children_nodes[2]);
        } // _add_while_subtree_to_ast
        /**
         * Construct a subtree in the abstract syntax tree rooted with the Keyword If and adds:
         *   - Boolean Expression
         *   - Block
         */
        _add_if_subtree_to_ast(if_node) {
            this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, WARNING, `Adding ${if_node.name} subtree to abstract syntax tree.`) // OutputConsoleMessage
            ); // this.verbose[this.verbose.length - 1].push
            // Remember, if you built your tree correctly...
            //
            //   Node(If).children[0] --> Keyword If [If]
            //   Node(If).children[1] --> Node(Boolean Expression)
            //   Node(If).children[2] --> Node(Block)
            //
            // Add If Statment
            this._current_ast.add_node(if_node.children_nodes[0].name, NODE_TYPE_BRANCH, true, if_node.children_nodes[0].getToken());
            // Add boolean expression node to subtree
            let node_name = this._add_boolean_expression_subtree_to_ast(if_node.children_nodes[1], BOOLEAN);
            // Add the Block subtree directly under the While Statement Keyword
            if (node_name === NODE_NAME_BOOLEAN_EXPRESSION) {
                this._climb_ast_one_level();
            } // if
            this._add_block_subtree_to_ast(if_node.children_nodes[2]);
        } // _add_if_subtree_to_ast
        is_variable_declared(identifier_node) {
            console.log(`Searching for ${identifier_node.name}`);
            let isDeclared = false;
            let var_metadata = null;
            let curr_scope_table_node = this._current_scope_tree.current_node;
            while (curr_scope_table_node !== undefined && curr_scope_table_node !== null && !isDeclared) {
                let scope_table = curr_scope_table_node.getScopeTable();
                isDeclared = scope_table.has(identifier_node.name);
                // Variable exists in current scope table
                if (isDeclared) {
                    var_metadata = scope_table.get(identifier_node.name);
                    var_metadata.isUsed = true;
                } // if
                // Check parent
                else {
                    curr_scope_table_node = curr_scope_table_node.parent_node;
                } // else
            } // while
            if (!isDeclared) {
                this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, ERROR, `Missing variable declaration [${identifier_node.name}] at ${identifier_node.getToken().lineNumber}:${identifier_node.getToken().linePosition}`) // OutputConsoleMessage
                ); // this.output[this.verbose.length - 1].push
                return null;
            } // if
            return var_metadata;
        } // is_variable_declared
        check_type(parent_var_type, node, curr_type) {
            if (parent_var_type !== curr_type) {
                this.output[this.output.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, ERROR, `Type mismatch error: tried to perform an operation on [${curr_type}] with [${parent_var_type}] at ${node.getToken().lineNumber}:${node.getToken().linePosition}`) // OutputConsoleMessage
                ); // this.verbose[this.verbose.length - 1].push
                this.verbose[this.verbose.length - 1].push(new NightingaleCompiler.OutputConsoleMessage(SEMANTIC_ANALYSIS, ERROR, `Type mismatch error: tried to perform an operation on [${curr_type}] with [${parent_var_type}] at ${node.getToken().lineNumber}:${node.getToken().linePosition}`) // OutputConsoleMessage
                ); // this.verbose[this.verbose.length - 1].push
                return false;
            } // if
            return true;
        } // check_type
        /**
         * Moves the AST's current node pointer up one level in the tree (to the parent node)
         */
        _climb_ast_one_level() {
            if (this._current_ast.current_node !== undefined || this._current_ast.current_node !== null) {
                this._current_ast.climb_one_level();
            } // if
        } // climb_ast_one
        /**
         * Moves the AST's current node pointer up one level
         * at a time and stops on a Node(Block) when reached.
         */
        _climb_ast_to_block() {
            // If already at a block, try to climb one node higher...
            if (this._current_ast.current_node.name === NODE_NAME_BLOCK) {
                this._climb_ast_one_level();
            } // if
            // Climbs to the nearest parent Node(Block)
            while ((this._current_ast.current_node !== undefined || this._current_ast.current_node !== null)
                && this._current_ast.current_node.name !== NODE_NAME_BLOCK) {
                if (this._current_ast.current_node.name !== NODE_NAME_BLOCK) {
                    this._current_ast.climb_one_level();
                } // if
            } // while
        } // _climb_ast_to_block
    } // class
    NightingaleCompiler.SemanticAnalysis = SemanticAnalysis;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=semantic_analysis.js.map