const CODE_GEN_SCOPE_TEST = `/* Code generation scope checking, be sure you traverse the scop tree depth first in order */
{
	/* Int Declaration */
	int a
	int b
	a = 0
	b=0
	/* While Loop */
	while (a != 3) {
		print(a)
        if(a == a) {
        	int z
        }
		while (b != 3) {
			print(b)
			b = 1 + b
			if (b == 2) {
				/* Print Statement */
				print("there is no spoon" /* This will do nothing */ )
			}
		}
		b = 0
		a = 1+a
        
        {
        	boolean z
        }
	}
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