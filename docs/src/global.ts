/* ------------
   Globals.ts

   Author: Alex Badia
   Global CONSTANTS and _Variables.
   (Global over the compiler.)
   ------------ */

const APP_NAME: string = "NightingaleCompiler";
const APP_VERSION: string = "0.01";

const CODE_EDITOR_TAB_LENGTH: number = 4;

// Output console mesages' sources
const LEXER: string = "LEXER";
const PARSER: string = "PARSER";
const SEMANTIC_ANALYSIS: string = "SEMANTIC ANALYSIS";
const CODE_GENERATION: string = "CODE GENERATION";

// Output console mesages' types
const ERROR: string = "ERROR";
const WARNING: string = "WARNING";
const INFO: string = "INFO";

/**
 * Lexical Tokens
 */

// Keyword loops
const KEYWORD_WHILE: string = "KEYWORD_WHILE";

// Keyword branches
const KEYWORD_IF: string = "KEYWORD_IF";

// Keyword standard output
const KEYWORD_PRINT: string = "KEYWORD_PRINT";

// Keyword types
const KEYWORD_INT: string = "KEYWORD_INT";
const KEYWORD_STRING: string = "KEYWORD_STRING";
const KEYWORD_BOOLEAN: string = "KEYWORD_BOOLEAN";

// Keyword booleans
const KEYWORD_TRUE: string = "KEYWORD_TRUE";
const KEYWORD_FALSE: string = "KEYWORD_FALSE";

// Identifiers (Single character variables)
const IDENTIFIER: string = "IDENTIFIER";

/**
 * Yes, there are tokens for comments...
 * 
 * Many languages will lex comments as tokens, which are useful
 * for say creating javadoc, or even adding tags like "@override".
 */
const START_BLOCK_COMMENT: string = "START_BLOCK_COMMENT";
const END_BLOCK_COMMENT: string = "END_BLOCK_COMMENT";

// String quotations (")
const STRING_EXPRESSION_BOUNDARY: string = "STRING_EXPRESSION_BOUNDARY";

// Symbol 
const SYMBOL: string = "SYMBOL";

// Open/Close blocks
const SYMBOL_OPEN_BLOCK: string = "SYMBOL_OPEN_BLOCK";
const SYMBOL_CLOSE_BLOCK: string = "SYMBOL_CLOSE_BLOCK";

// Open/Close arguments
const SYMBOL_OPEN_ARGUMENT: string = "SYMBOL_OPEN_ARGUMENT";
const SYMBOL_CLOSE_ARGUMENT: string = "SYMBOL_CLOSE_ARGUMENT";

// Operands
const SYMBOL_INT_OP: string = "SYMBOL_INT_OP";
const SYMBOL_BOOL_OP_EQUALS: string = "SYMBOL_BOOL_OP_EQUALS";
const SYMBOL_BOOL_OP_NOT_EQUALS: string = "SYMBOL_BOOL_OP_NOT_EQUALS";

// Assignments
const SYMBOL_ASSIGNMENT_OP: string = "SYMBOL_ASSIGNMENT_OP";

// Digits
const DIGIT: string = "DIGIT";

// Characters
const CHARACTER: string = "CHARACTER";
/**
 * Yes, there are tokens for spaces...
 * 
 * Some languages give white space meaning, like Python.
 * Where indents signify code blocks, instead of a say Java 
 * like language where brackets {}, indicate code blocks.
 */
const SPACE_SINGLE: string = "SPACE_SINGLE";
const SPACE_TAB: string = "SPACE_TAB";
const SPACE_END_OF_LINE: string = "SPACE_END_OF_LINE";

// End of Program
const END_OF_PROGRAM: string = "END_OF_PROGRAM";

/**
 * Token Types
 * 
 * Lex will provide errors such as invalid characters, warnings, and missing 
 * tokens for mistakes involving, for example, missing end of program tokens.
 */
const INVALID_TOKEN: string = "INVALID_TOKEN";
const WARNING_TOKEN: string = "WARNING_TOKEN";
const MISSING_TOKEN: string = "MISSING_TOKEN";

/**
 * Language types
 * 
 * Identifiers are preceded by 1 of 3 types in our grammar.
 *   - int
 *   - string
 *   - boolean
 * Note: During parser, the type inserted into the CST is based on the lex token
 */
const INT: string = "int";
const STRING: string = "string";
const BOOLEAN: string = "boolean";
const UNDEFINED: string = "undefined";

// Syntax Trees Types of Nodes
const NODE_TYPE_BRANCH: string = "BRANCH";
const NODE_TYPE_LEAF: string = "LEAF";

// Syntax Tree Names of Nodes
const NODE_NAME_PROGRAM: string = "Program";
const NODE_NAME_BLOCK: string = "Block";
const NODE_NAME_STATEMENT_LIST: string = "Statement List";
const NODE_NAME_STATEMENT: string = "Statement";
const NODE_NAME_PRINT_STATEMENT: string = "Print Statement";
const NODE_NAME_ASSIGNMENT_STATEMENT: string = "Assignment Statement";
const NODE_NAME_VARIABLE_DECLARATION: string = "Variable Declaration";
const NODE_NAME_WHILE_STATEMENT: string = "While Statement";
const NODE_NAME_IF_STATEMENT: string = "If Statement";
const NODE_NAME_EXPRESSION: string = "Expression";
const NODE_NAME_INT_EXPRESSION: string = "Int Expression";
const NODE_NAME_STRING_EXPRESSION: string = "String Expression";
const NODE_NAME_BOOLEAN_EXPRESSION: string = "Boolean Expression";
const NODE_NAME_IDENTIFIER: string = "Identifier";
const NODE_NAME_TYPE: string = "Type";
const NODE_NAME_CHARACTER_LIST: string = "Character List";
const NODE_NAME_CHARACTER: string = "Character";
const NODE_NAME_SPACE: string = "Space";
const NODE_NAME_DIGIT: string = "Digit";
const NODE_NAME_BOOLEAN_OPERATION: string = "Boolean Operation";
const NODE_NAME_BOOLEAN_VALUE: string = "Boolean Value";
const NODE_NAME_INT_OPERATION: string = "Int Operation";
const AST_NODE_NAME_IF: string = "if";
const AST_NODE_NAME_WHILE: string = "while";
const NODE_NAME_TRUE: string = "true";
const NODE_NAME_FALSE: string = "false";
const AST_NODE_NAME_INT_OP: string = "+";
const AST_NODE_NAME_BOOLEAN_EQUALS: string = "==";
const AST_NODE_NAME_BOOLEAN_NOT_EQUALS: string = "!=";

// Scope Tree Node Names
const NODE_NAME_SCOPE: string = "Scope";

// Code Generation
const MAX_MEMORY_SIZE: number = 256;
