/**
 * parser_tests.js
 * 
 * Parser tests are loaded on the html page and visible to the user.
 * 
 * This test file specifically tests the Recursive Descent LL(1) Parse Algorithm in the compiler.
 */

/**
 * Parser should catch an incomplete expression and fail
 */
const INCOMPLETE_EXPRESSIONS= 
`/* Incomplete Expressions, Parse should throw error(s)*/\n` 
+ `{\n`
+ `\twhile (a != ) {\n`
+ `\t\tprint("this should not work")\n`
+ `\t}\n`
+ `}$\n\n`
+`/* Incomplete Assignment Operation */\n` 
+ `{\n`
+ `\t{\n`
+ `\t\ta = 0 + 1\n`
+ `\t\tb = 1 + 2\n`
+ `\t\tc = 2 +\n`
+ `\t}\n`
+ `}$\n\n`;

/**
 * Parser should catch invalid decalarations and fail, but pass on valid declarations
 */
const TRICKY_DECLARATIONS= 
`/* Tricky Declarations */\n` 
+ `{\n`
+ `\tint x\n`
+ `\tint y = x\n`
+ `\tz = x + y\n`
+ `}$\n\n`
+ `/* Bool Declaration */\n` 
+ `{\n`
+ `\tboolean x\n`
+ `\tboolean y\n`
+ `\t while (x != y){}\n`
+ `\t if (true != false)\n`
+ `}$\n\n`
+ `/* This should fail */\n` 
+ `{\n`
+ `\tboolean x\n`
+ `\tboolean y\n`
+ `\t while (x != y){}\n`
+ `\t if ((true != false))\n`
+ `}$\n\n`;

/**
 * Parser should pass, even though semantically incorrect
 */
const TRICKY_ASSIGNMENT_STATEMENTS = `
/* This is a valid parse... hmm... */
{
	a = 1 + (true == false)
}$

/* This is a valid parse as well..
{
    a = 1 + "hmmmmmmmm"
}$
`;

/**
 * Parser should pass, even though semantically incorrect
 */
const CRAZY_BOOLEAN_EXPRESSION = 
`/* This is theoretically correct.. I'll be damned if my computer doesn't blow up from this. */\n` 
+ `{\n`
+ `\tif( (((true != false) == (false == true)) == false) != true ){\n`
+ `\t\t print("wow")\n`
+ `\t}\n`
+ `}$\n\n`
+ `/* Broken program for more chaos */\n`
+ `}$\n\n`;

/**
 * A test from the SONARS Compiler
 */
const SONARS_STRING_DECLARATION = 
`/* SONARS TEST CASE: This will fail because an identifier is expected but not provided */
{
	/* 1 is not a valid identifier */
	string 1
}$`;

/**
 * A test from the SVEGLIATOR compiler
 */
const SVEGLIATOR_INVALID_PROGRAM = 
`
/* SVEGLIATOR TEST CASE: Should pass lex, parse, but fail at semantic analysis...*/
{
   int a
   a = 1
   print(a)

   {
       int a
       a = 2
       print(a)
   }

   {
       int a
       a = 3
       print(a)
   }

   string s
   s = "stra"
   print(s)

   s = "strb"
   print((s == "str"))

   if (a != 5) {
       print((true == (s == s)))
   }

   if (a == 5) {
       print("false")
   }

   s = "meowa"
   s = "meowb"
   s = "meowc"
   s = "meowd"
   s = "meowe"
   s = "meowf"

   int z
   z = 5
} $`;

/**
 * A test from the Juice Compiler
 */
const JUICE_COMPILER_CRAZY_ONE_LINER = 
"/* JUICES TEST CASE Test case for crazy one liner */\n"
+ "${hellotruefalse!======trueprinta=3b=0print(\"false true\")whi33leiftruefalsestring!= stringintbooleanaa truewhileif{hi+++==!==}}/*aaahaha*/hahahahaha/*awao*/$";

