/**
 * default_tests.js
 * 
 */

/**
 * Long Test Case - Everything Except Boolean Declaration
 * 
 * Should pass all the way to code gen.
 */
 const LONG_TEST_CASE = 
 "/*Long Test Case - Everything Except Boolean Declaration */\n"
 + "{\n"
 + "\t/* Int Declaration */\n"
 + "\tint a\n"
 + "\tint b\n"
 + "\ta = 0\n"
 + "\tb=0\n"
 + "\t/* While Loop */\n"
 + "\twhile (a != 3) {\n"
 + "\t\tprint(a)\n"
 + "\t\twhile (b != 3) {\n"
 + "\t\t\tprint(b)\n"
 + "\t\t\tb = 1 + b\n"
 + "\t\t\tif (b == 2) {\n"
 + "\t\t\t\t/* Print Statement */\n"
 + "\t\t\t\tprint(\"there is no spoon\" /* This will do nothing */ )\n"
 + "\t\t\t}\n"
 + "\t\t}\n"
 + "\t\tb = 0\n"
 + "\t\ta = 1+a\n"
 + "\t}\n"
 + "}\n"
 + "$";

 /**
 * Long Test Case - Everything Except Boolean Declaration
 * 
 * Should pass all the way to code gen.
 */
const ALANS_PROJECT_ONE_TEST = `/** 
* Valid program with only one empty block
*   - Should Pass Lex
*   - Should Pass Parse
*   - Should Pass Semantic Analysis?
*     Should I really allow empty programs to go this far, or is removing it an optimization?
*   - Code Generation?
*/
{}$

/** 
* Valid program with one block and five nested blocks.
*   - Should Pass Lex
*   - Should Pass Parse
*   - Should Pass Semantic Analysis?
*     Should I really allow empty programs to go this far, or is removing it an optimization?
*   - Code Generation?
*/
{{{{{{}}}}}}$

/** 
* Invalid program six open block symbols, seven close block symbols.
*   - Should Pass Lex
*   - Should Fail Parse
*   - Should Fail Semantic Analysis (By Default)
*   - Should Fail Code Generation (By Default)
*/
{{{{{{}}} /* comments are ignored */}}}}$

/** 
* Invalid program because of invalid @ symbol.
*   - Should Fail Lex
*   - Should Fail Parse (By Default)
*   - Should Fail Semantic Analysis (By Default)
*   - Should Fail Code Generation (By Default)
*/
{/*comments are still ignored */ int @}$\n`;

const ALANS_PROJECT_TWO_TEST = `/* You’re expecting anything that could start a statement or SYMBOL_CLOSE_BLOCK. */
{a=12}$
{1 = 2}$

/* You’re expecting any Bool_Expression */
{
    while "a" {
        print ( "a" )
    }  
    print ( "done" )
}$

/* Checking to make sure this works */
{
    while (1 == 1) {
        print(true)
    }
}$
`;

const ALANS_PROJECT_THREE_TEST = `/* Valid test case */
{
    int a	
    boolean b

    {	
        string	c	
        a = 5
        b = true /*nocomment*/
        c = "int a" 
        print(c)
    }
    
    print(b)
    print(a)
}$	

/* Should fail due to missing variable declaration for 'b' */
{
    int a
    {
        boolean b
        a = 1
    }
    print(b)
}$`;