const CODE_GEN_SCOPE_TEST = `/**
 * Code generation scope checking, be sure you traverse the scop tree depth first in order!
 * 
 * Standard output should be:
 *   - 9
 *   - true
 *   - hello world
 *   - 0
 *   - 12
 *   - false
 * */
{
	/* Int Declaration */
	int a
	boolean b
	string c
	a = 9
	b = true

	/* New scope */
	{
		print(a)
        print(b)
		b = false
		c = "hello world"
		int b
		b = 0
		{
			print(c)
			a = 1 + 2 + a

			{
				print(b)
			}
		}
		b = a
		print(b)
	}
	print(b)
}
$`;

const CODE_GEN_VARRIABLE_DECLARATIONS_TEST = `/**
 * Testing variable declarations. 
 * Semantic Analysis should warn that these are 
 * declared and unused, but code generation should 
 * be fine (there's just no output for this program)
 */
{
	/* Int Declaration */
	int a
    boolean c
    string d
    
    {
    	{}
    	{int a}
    	{boolean c}
    	string d
    }
    
    string x
    int y
    boolean z
}
$`;

const CODE_GEN_PRINT_TEST = `/** 
* Sadly we're only working with 256 byte of memory so these tests are limited...
* 
* First, declare variables first to pass semantic analysis 
*/
{
    int a
    boolean b
    string c

	/* Basic print statements */
    print(true)
    print(false)
    print("hello world")
	print(9)

	/* Print identifiers */    
    print(a)
    print(b)
    print(c)

	/* Int expressions */
	print(1 + 2 + 3 + 2 + 1)

	/* Int Expressions With Identifiers */
	a = 9
	print(1 + 2 + 3 + 4 + 5 + a) 
}
$`;

const CODE_GEN_STRING_POINTERS_TEST = `/* Sadly we're only working with 256 byte of memory so these tests are limited... */
{
	/* Strings are initialized to null by default */
    string a
    string b
    string c

	/* Requires a new heap entry */
    a = "two"

	/* Also requires a new heap entry */
	a = "one"

	/* Make sure pointer updated */
	print(a)

	/* Already exists in the heap, NO new heap entry */
	print("two")

	/* Requires new heap entry */
	print("three")

	/**
	 * These already exists in the heap, no new entries required
	 * 
	 * Really just pointer musical chairs at this point...
	 */
	b = "one"
	print(b)
	b = "two"
	print(b)
	b = "three"
	print(b)
	b = "true"
	print(b)
	b = "false"
	print(b)
	b = "null"
	print(b)

	/* Strings string should be initialized to null in the heap */    
	print(c)
}
$`;

const CODE_GEN_STRING_SCOPE_TEST = `/* Sadly we're only working with 256 byte of memory so these tests are limited... */
{
	/* Strings are initialized to null by default */
    string a
    string b
    string c

	/* Requires a new heap entry */
    a = "two"
    
    {
		/* Also requires a new heap entry */
		a = "one"
    }
    
	{
    	/* Make sure pointer updated */
		print(a)
    }
    
	/* Already exists in the heap, NO new heap entry */
	print("two")

	/* Requires new heap entry */
	print("three")

	/**
	 * These already exists in the heap, no new entries required
	 * 
	 * Really just pointer musical chairs at this point...
	 */
	b = "one"
	print(b)
    {
    	
		b = "two"
		print(b)
		b = "three"
		{
        	print(b)
			b = "true"
			print(b)
			b = "false"
        }
        
		print(b)
    
    }
	b = "null"
	print(b)

	{
    	{
    		/* Strings string should be initialized to null in the heap */    
			print(c)
        }
    }
}
$`;

const CODE_GEN_BIG_INT_TEST = `{
	/**
	 * Big Integer Test:
	 * 
	 * 29 * 9 = 261
	 * 
	 * The operating systems were only designed to hold a 1 byte number:
	 *   - Some Operating Systems will print 261.
	 *   - Others will wrap past 261, resulting in 261 mod 256 = 5.
	 *   - And finally, maybe some might explode...!
	 * */
	print(9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9)
}
$`;

const CODE_GEN_STATIC_AREA_OVERFLOW_TEST = `{
	string a 
    a = "static area should collide into heap filling up the heap with more data tp cause a collision at z"
	string b
	string c
	string d
	string e
    
	string f
	string g
	string h
	string i
    string j
    
    string k
    string l
    string m
    string n
    string o
    
    string p
    string q
    string r 
    string s
    string t
    
    string u
    string v
    string w
    string x
    string y
    
    string z
}$
`;

/**
 * Boolean Comparison tests
 */
const CODE_GEN_BOOLEAN_VALUE_TEST = `/**
* Ouput: false true true false true false
*/
{
	print((true == false))
	print(" ")
	print((true != false))
	print(" ")
	print((true == true))
	print(" ")
	print((true != true))
	print(" ")
	print((false == false))
	print(" ")
	print((false != false))
}$`;

const CODE_GEN_BOOLEAN_INTEGER_EXPRESSION_TEST = `/**
 * Ouput: t true f false
 * 
 * Sadly, we only have 256 bytes of memory to work with.
 * Given our current instruction set, boolean comparisons of 
 * integer expression are extremely costly. Use sparingly!
 */
{
	/* Integer Expression Comparisons */
    print("t ")
	print((1 + 2 + 3 == 3 + 2 + 1))
    print(" f ")
	print((1 + 2 + 3 != 3 + 2 + 1))
}$`;


const CODE_GEN_BOOLEAN_INTEGER_VALUE_TEST = `/**
 * Output: false true false true
 */
{
	print((1 != 1))
	print((1 == 1))
	print((2 == 3))
	print((3 != 4))
}$`;

const CODE_GEN_IDENTIFIER_BOOLEAN_TEST = `/* Output: int test false true bool test true false string test false true */
{
	int a
	int b

	a = 1 + 2 + 3
	b = 5

	print("int test ")
	print(a == b)
	print(" ")
	print(a != b)

	boolean c
	boolean d

	print("bool test ")
	print(c == d)
	print(" ")
	print(c != d)

	string e
	string f

	e = "hello"
	e = "world"

	print("string test ")
	print(e == f)
	print(" ")
	print(e != f)
}$`;

const CODE_GEN_BOOLEAN_HELL_TEST = `/* Should print out... */
{
	/* Declare variables */
	int a
	string b
	string c

	c = "hmm"

	/* Boolean Hell */
	print((((a!=9) == ("test" != "alan")) == ((5==5) != (b == c))))

	/* More Tests */
	boolean d
	boolean e

	d = true
	e = true
	print((((1 + 2 + 3 != 9) == ("wow" != "wow")) == ((5==5) != (d == e))))
}$`;