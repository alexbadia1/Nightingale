const CODE_GEN_SCOPE_TEST = `
/**
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

const CODE_GEN_BIG_INT_TEST = `
{
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
$`

const CODE_GEN_BACK_PATCHING_TEST = `/* Backpatching Test */
{
	
}
$`