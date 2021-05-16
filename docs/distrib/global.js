/* ------------
   Globals.ts

   Author: Alex Badia
   Global CONSTANTS and _Variables.
   (Global over the compiler.)
   ------------ */
const APP_NAME = "NightingaleCompiler";
const APP_VERSION = "0.01";
const CODE_EDITOR_TAB_LENGTH = 4;
// Output console mesages' sources
const LEXER = "LEXER";
const PARSER = "PARSER";
const SEMANTIC_ANALYSIS = "SEMANTIC ANALYSIS";
const CODE_GENERATION = "CODE GENERATION";
// Output console mesages' types
const ERROR = "ERROR";
const WARNING = "WARNING";
const INFO = "INFO";
/**
 * Lexical Tokens
 */
// Keyword loops
const KEYWORD_WHILE = "KEYWORD_WHILE";
// Keyword branches
const KEYWORD_IF = "KEYWORD_IF";
// Keyword standard output
const KEYWORD_PRINT = "KEYWORD_PRINT";
// Keyword types
const KEYWORD_INT = "KEYWORD_INT";
const KEYWORD_STRING = "KEYWORD_STRING";
const KEYWORD_BOOLEAN = "KEYWORD_BOOLEAN";
// Keyword booleans
const KEYWORD_TRUE = "KEYWORD_TRUE";
const KEYWORD_FALSE = "KEYWORD_FALSE";
// Identifiers (Single character variables)
const IDENTIFIER = "IDENTIFIER";
/**
 * Yes, there are tokens for comments...
 *
 * Many languages will lex comments as tokens, which are useful
 * for say creating javadoc, or even adding tags like "@override".
 */
const START_BLOCK_COMMENT = "START_BLOCK_COMMENT";
const END_BLOCK_COMMENT = "END_BLOCK_COMMENT";
// String quotations (")
const STRING_EXPRESSION_BOUNDARY = "STRING_EXPRESSION_BOUNDARY";
// Symbol 
const SYMBOL = "SYMBOL";
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
// Characters
const CHARACTER = "CHARACTER";
/**
 * Yes, there are tokens for spaces...
 *
 * Some languages give white space meaning, like Python.
 * Where indents signify code blocks, instead of a say Java
 * like language where brackets {}, indicate code blocks.
 */
const SPACE_SINGLE = "SPACE_SINGLE";
const SPACE_TAB = "SPACE_TAB";
const SPACE_END_OF_LINE = "SPACE_END_OF_LINE";
// End of Program
const END_OF_PROGRAM = "END_OF_PROGRAM";
/**
 * Token Types
 *
 * Lex will provide errors such as invalid characters, warnings, and missing
 * tokens for mistakes involving, for example, missing end of program tokens.
 */
const INVALID_TOKEN = "INVALID_TOKEN";
const WARNING_TOKEN = "WARNING_TOKEN";
const MISSING_TOKEN = "MISSING_TOKEN";
/**
 * Language types
 *
 * Identifiers are preceded by 1 of 3 types in our grammar.
 *   - int
 *   - string
 *   - boolean
 * Note: During parser, the type inserted into the CST is based on the lex token
 */
const INT = "int";
const STRING = "string";
const BOOLEAN = "boolean";
const UNDEFINED = "undefined";
// Syntax Trees Types of Nodes
const NODE_TYPE_BRANCH = "BRANCH";
const NODE_TYPE_LEAF = "LEAF";
// Syntax Tree Names of Nodes
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
const AST_NODE_NAME_IF = "if";
const AST_NODE_NAME_WHILE = "while";
const NODE_NAME_TRUE = "true";
const NODE_NAME_FALSE = "false";
const AST_NODE_NAME_INT_OP = "+";
// Scope Tree Node Names
const NODE_NAME_SCOPE = "Scope";
// Code Generation
const MAX_MEMORY_SIZE = 256;
//# sourceMappingURL=global.js.map