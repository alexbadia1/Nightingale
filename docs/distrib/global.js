/* ------------
   Globals.ts

   Author: Alex Badia
   Global CONSTANTS and _Variables.
   (Global over the compiler.)
   ------------ */
const APP_NAME = "NightingaleCompiler";
const APP_VERSION = "0.01";
const CODE_EDITOR_TAB_LENGTH = 4;
const LEXER = "LEXER";
const PARSER = "PARSER";
const SEMANTIC_ANALYSIS = "Semantic Analysis";
const ERROR = "ERROR";
const WARNING = "WARNING";
const INFO = "INFO";
/**
 * 1. Keywords
 *
 * Consist of commands and types.
 */
const KEYWORD_PRINT = "KEYWORD_PRINT";
const KEYWORD_WHILE = "KEYWORD_WHILE";
const KEYWORD_IF = "KEYWORD_IF";
// Types
const KEYWORD_INT = "KEYWORD_INT";
const KEYWORD_STRING = "KEYWORD_STRING";
const KEYWORD_BOOLEAN = "KEYWORD_BOOLEAN";
// Boolean keywords
const KEYWORD_TRUE = "KEYWORD_TRUE";
const KEYWORD_FALSE = "KEYWORD_FALSE";
/**
 * 2. Identifiers
 *
 * Can be character of id depending if inside a string or not.
 */
const IDENTIFIER = "IDENTIFIER";
/**
 * 3. Symbols
 */
const SYMBOL = "SYMBOL";
// Comments
const START_BLOCK_COMMENT = "START_BLOCK_COMMENT";
const END_BLOCK_COMMENT = "END_BLOCK_COMMENT";
// Quotation
const STRING_EXPRESSION_BOUNDARY = "STRING_EXPRESSION_BOUNDARY";
// Open/Close blocks
const SYMBOL_OPEN_BLOCK = "SYMBOL_OPEN_BLOCK";
const SYMBOL_CLOSE_BLOCK = "SYMBOL_CLOSE_BLOCK";
// Open/Close arguments
const SYMBOL_OPEN_ARGUMENT = "SYMBOL_OPEN_ARGUMENT";
const SYMBOL_CLOSE_ARGUMENT = "SYMBOL_CLOSE_ARGUMENT";
// Operands
const SYMBOL_INT_OP = "SYMBOL_INT_OP";
const SYMBOL_BOOL_OP_EQUALS = "SYMBOL_BOOL_OP_EQUALS";
const SYMBOL_BOOL_OP_NOT_EQUALS = "SYMBOL_BOOL_OP_NOT_EQUALS";
// Assignments
const SYMBOL_ASSIGNMENT_OP = "SYMBOL_ASSIGNMENT_OP";
// Digits
const DIGIT = "DIGIT";
// Whitespace
const SPACE_SINGLE = "SPACE_SINGLE";
const SPACE_TAB = "SPACE_TAB";
const SPACE_END_OF_LINE = "SPACE_END_OF_LINE";
// End of Program
const END_OF_PROGRAM = "END_OF_PROGRAM";
const CHARACTER = "CHARACTER";
// Invalid Token
const INVALID_TOKEN = "INVALID_TOKEN";
const WARNING_TOKEN = "WARNING_TOKEN";
const MISSING_TOKEN = "MISSING_TOKEN";
/**
 * Syntax Trees Types of Nodes
 */
const NODE_TYPE_BRANCH = "BRANCH";
const NODE_TYPE_LEAF = "LEAF";
/**
 * Syntax Tree Names of Nodes
 */
const NODE_NAME_PROGRAM = "Program";
const NODE_NAME_BLOCK = "Block";
const NODE_NAME_STATEMENT_LIST = "Statement List";
const NODE_NAME_STATEMENT = "Statement";
const NODE_NAME_PRINT_STATEMENT = "Print Statement";
const NODE_NAME_ASSIGNMENT_STATEMENT = "Assignment Statement";
const NODE_NAME_VARIABLE_DECLARATION = "Variable Declaration";
const NODE_NAME_WHILE_STATEMENT = "While Statement";
const NODE_NAME_IF_STATEMENT = "If Statement";
const NODE_NAME_EXPRESSION = "Expression";
const NODE_NAME_INT_EXPRESSION = "Int Expression";
const NODE_NAME_STRING_EXPRESSION = "String Expression";
const NODE_NAME_BOOLEAN_EXPRESSION = "Boolean Expression";
const NODE_NAME_IDENTIFIER = "Identifier";
const NODE_NAME_TYPE = "Type";
const NODE_NAME_CHARACTER_LIST = "Character List";
const NODE_NAME_CHARACTER = "Character";
const NODE_NAME_SPACE = "Space";
const NODE_NAME_DIGIT = "Digit";
const NODE_NAME_BOOLEAN_OPERATION = "Boolean Operation";
const NODE_NAME_BOOLEAN_VALUE = "Boolean Value";
const NODE_NAME_INT_OPERATION = "Int Operation";
// Scope Tree Node Names
const NODE_NAME_SCOPE = "Scope";
//# sourceMappingURL=global.js.map