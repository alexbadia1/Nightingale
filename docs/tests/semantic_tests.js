/**
 * semantic_tests.js
 * 
 * Semantic Analysis tests are loaded on the html page and visible to the user.
 * 
 * This test file specifically tests the Depth First In Order Traversal Semantic Analysis Algorithm in the compiler.
 */

/**
 * Should create an INVALID AST, visible to the user and should pass.
 */
const INTEGER_ASSIGNMENTS = `/* Obviously missing varible decalarations, but still a good test for your tree */
{
	{
    	x = 1 + 2 + 3
        y = 6 + 7
        p = 1 
        o = 9 + 8 
        w = 4 + 5 + 0
    }
    
	a = 1
	b = 1 + 2
    c = 3 + 4 + 5
    d = 5 + 6 + 7
    e = 7 + 8
    f = 9
    
    {
    	z = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 9
    }
}$`;

/**
 * Should create an INVALID AST, visible to the user and should pass.
 */
const STRING_ASSIGNMENTS = `/* Obviously missing varible decalarations, but still a good test for your tree */
{
	{
    	x = "abc"
        y = "e"
        p = "fghijklm" 
        o = "nop" 
        w = "qrstuvwxyz"
    }
    
	a = "qrstuvwxyz"
	b = "nop" 
    c = "e"
    d = "fghijklm"
    e = "abc"
    f = "z"

    {
    	z = "abcdefghijklmnopqrstuvwxyz"
    }
}$`;

/**
 * Should create an INVALID AST, visible to the user and should pass.
 */
const ULTIMATE_ASSIGNMENT_TEST = `/* Semantically incorrect, but make sure your AST structure is correct */
{
    /* This is technically syntactically correct, though semantically is full of issues */
    r = 1 + (true == (1 != "hi"))

    /* Testing scopes as well... */
	{
    	x = "abc"
        y = "e"
        p = 1 + true
        w = "qrstuvwxyz"

        /* How 'bout another scope? */
        {
            x = 1 + 2 + 3
            y = 6 + 7
            p = 1 
    
            /* Tricky, but syntactically valid */
            o = 9 + (false != ("a" == "a"))
            w = 4 + 5 + 0
        }
    }
    
    a = 1
	b = 1 + 2
	a = "qrstuvwxyz"
    d = "fghijklm"
    e = "abc"
    f = "z"
    d = 5 + 6 + 7
    e = 7 + 8

    /* Has your computer blown up yet? */
    {
        /* Some easy tests now */
    	z = "abcdefghijklmnopqrstuvwxyz"
        z = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 9
        z = (true == (false == ("a" != "b")))
    }
}$`;

/**
 * Should create an INVALID AST, visible to the user and should pass.
 */
const PRINT_STATEMENTS_TESTS = `/* Here's a bunch of print statements */
{
	print("i")
    print("think")
    
    {
    	print("i")
    	print("can")
        
        print("i")
    	print("think")
        print("i")
        
        {
			 print("can")       
        }
    }
    
	print("i")
	print("think")
    print("")
    print("i")
    print("")
    print("can")
}$`;

/**
 * Should create an INVALID AST, visible to the user and should pass.
 */
const WHILE_STATEMENTS_TEST = `/* Here's a bunch of while loops, should create a AST...
whether it's valid or not is a different story... */
{
	while true {
		while true {
        	print("hello world")
		}
        while true {
        	print("hello world")
            
            while (1 != 3) {
        		print("hello world")
            }
		}
        
        while (1 != 3) {
        	print("hello world")
		}
	}
}
$
`;

/**
 * Should create an INVALID AST, visible to the user and should pass.
 */
 const IF_STATEMENTS_TEST = `/* Here's a bunch of If statements, should create a AST...
 whether it's valid or not is a different story... */
 {
     if true {
         if true {
             print("hello world")

             if true {
                print("hello world")
            }
         }

         if (1 != 3) {
             print("hello world")
             
             if true {
                 print("hello world")
             }

             if (1 != 3) {
                print("hello world")
            }
         }
         
         if (1 != 3) {
             print("hello world")
         }

         if true {
            print("hello world")
        }
     }
 }
 $
 `;

const SCOPE_TREE_TEST = `/*
Scope tree test.
    (Scope)
    * a | Type: int Used: true, Line: 4, Pos:5
    * d | Type: int Used: false, Line: 7, Pos:5
    * z | Type: int Used: true, Line: 9, Pos:5
    - (Scope)
    -- [Scope]
    - (Scope)
    -- (Scope)
    --- [Scope]
    **** b | Type: int Used: false, Line: 5, Pos:8
    - [Scope]
    ** c | Type: int Used: false, Line: 6, Pos:6
    - (Scope)
    ** e | Type: int Used: false, Line: 8, Pos:6
    -- [Scope]
    *** f | Type: int Used: false, Line: 8, Pos:13
    - [Scope]
*/
{
    {
        {

        }
    }
    
    int a
    
    {
        {
            {
                int b
            }
        }
    }

    {
        int c
    }

    int d

    {
        int e 
        {
            int f
        }
    }

    int z

    {
        z = 3 
        a = 3
    }
}$`;

/**
 * Semantic Analysis Tests
 * 
 *   - Type Checking
 *   - Scope checking
 *   - Missing variable declarations
 *   - Unitialized variable warnings
 *   - Unused variable warnings
 *   - et cetera...
 */
const JUICE_COMPILER_BOOLEAN_HELL = `/* Juice Compiler's boolean hell, who they credit "TIEN" for */
{
    int a
    a = 0
    boolean b
    b = false
    boolean c
    c = true
    while(((a!=9) == ("test" != "alan")) == ((5==5) != (b == c))) {
        print("a")
        string d
        d = "yes"
        print(d)
        {
            int a
            a = 5
        }
    }
}$`;