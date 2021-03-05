/* ------------
   Globals.ts

   Author: Alex Badia
   Global CONSTANTS and _Variables.
   (Global over the compiler.)
   ------------ */

const APP_NAME: string = "NightingaleCompiler";
const APP_VERSION: string = "0.01";

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