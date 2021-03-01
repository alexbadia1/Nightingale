/**
 * lexer.ts
 * Author: Alex Badia
 * 
 * This is the Lexing stage of compilation.
 */

//  TODO: TEST each regular expression

module NightingaleCompiler {
    export class Lexer {
        constructor(
            /**
             * Tokens
             * 
             * Each token is defined by a Javascript Regular Expression.
             */

            // $ for end Of program
            private _tEndOfProgram: RegExp = new RegExp('\\$$'),
            
            // {} for block or statement list
            private _tOpenBrace: RegExp = new RegExp('{$'),
            private _tCloseBrace: RegExp = new RegExp('}$'),

            // print for print statement
            private tPrint: RegExp = new RegExp('print$'),
            private tOpenParenthesis: RegExp = new RegExp('\($'),
            private tCloseParenthesis: RegExp = new RegExp('\)$'),

            // = for assignment statement
            private tAssignment: RegExp = new RegExp('\=$'),


            /**
             * Expr
             * 
             * IntExpr
             * 
             * String Expr
             * 
             * BooleanExpr
             * 
             * Id
             * 
             * CharList
             */

            // Types
            private tTypeInt: RegExp = new RegExp('int$'),
            private tTypeString: RegExp = new RegExp('string$'),
            private tTypeBoolean: RegExp = new RegExp('boolean$'),

            /**
             * Alphabet Characters 
             * 
             * a | b | c | d | e | f | g | h | i | j | k | l | m 
             * | n | o | p | q | r | s | t | u | v | w | x | y | z
             */
            private tChar: RegExp = new RegExp('[a-z]$'),

            // Space, tab, end of line characters
            private tSpaceCharacter: RegExp = new RegExp(' $'),
            private tTabCharacter: RegExp = new RegExp('\t$'),
            private tEndOfLineCharacter: RegExp = new RegExp('\n$'),

            // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 digits.
            private tDigit: RegExp = new RegExp('[0-9]$'),

            // == | != boolean operations.
            private tBoolOpEqual: RegExp = new RegExp('\=\=$'),
            private tBoolOpNotEqual: RegExp = new RegExp('\\!\=$'),

            // false | true boolean values.
            private tBoolValFalse: RegExp = RegExp('false$'),
            private tBoolValTrue: RegExp = new RegExp('true$'),

            // + for addition.
            private tIntOp: RegExp = new RegExp('\\+$'),

            // /* */ for block comment.
            private tStartBlockComment: RegExp = new RegExp('/\\*$'),
            private tEndBlockComment: RegExp = new RegExp('\\*/$'),
        ) { }
    }// class
}// module