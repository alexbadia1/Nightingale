/**
 * Boolean Comparison tests
 */
const CODE_GEN_BOOLEAN_VALUE_TEST = `/**
* Ouput: falsetruetruefalsetruefalse
*/
{
	print((true == false))
	print((true != false))
	print((true == true))
	print((true != true))
	print((false == false))
	print((false != false))
}$`;

const CODE_GEN_BOOLEAN_EXPRESSION_TEST = `/**
 * Albeit, we only have 256 bytes, this was impractical to implement as such
 * comparisons take up a lot of memory (given our limited instuction set)... 
 * 
 * Hoewever, it works!
 * 
 * Boolean Expression Tests
 */
{
	/* Declare variables */
	int a
	string b
	string c
	boolean z
    c = "hmm"
	z = (((a!=9) == ("a" != "b")) == ((5==5) != (b == c)))

	/* Boolean Hell should print true */
	print(z)
}$

/**
 * Advanced Boolean Expression Test
 * (5 + 2 + 3 == 9 + 1) --> true
 * (wow != wow) --> false
 * 
 * true == false --> false
 * 
 * (3 == 5) --> false
 * (d == e) --> (false == false) --> true
 * 
 * false != true --> true
 * 
 * Answer: false == true --> false
 * 
 * Should output false
 */
{
	/**
	 * This is laughably impractical, as this barely fits in memory 
	 * 
	 * There are a few more optimizations I could made to save a few more bytes,
	 * but given the time and brain damage it took to implement this, I'm fine...
	 */
	print((((5 + 2 + 3 == 9 + 1) == ("wow" != "wow")) == ((3==5) != (true == true))))
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

const CODE_GEN_STRING_VALUE_TEST = `/**
 * Output: true false true false
 */
{
	/* Test two new entries against each other */
	print(("hi" != "hola"))

	/* Test two existing entries against each other */
	print(("hi" == "hola"))

	/* Testing a new and existing entry against each other */
	print(("bye" == "bye"))
	print(("adios" != "adios"))
}$`;

const CODE_GEN_IDENTIFIER_BOOLEAN_TEST = `
/* Int Test Output: 20 equals 18 is false while 20 not equals 18 is true */
{
	int a
	int b

	a = 9 + 7 + 4
	b = 3 + 3 + 3 + 9
    
    print(a)
	print (" equals ")
    print(b)
    print(" is ")
	print((a == b))
    print(" while ")
    print(a)
	print (" not equals ")
    print(b)
    print(" is ")
	print((a != b))
}$

/* Boolean Test Output: false equals true is false while true not equals false is true */
{
	
	boolean a
	boolean b

	a = true

	print(b)
	print (" equals ")
    print(a)
    print(" is ")
	print((b == a))
    print(" while ")
    print(a)
	print (" not equals ")
    print(b)
    print(" is ")
	print((a != b))
}$

/* String Test: aatrueaafalseaatruecafalse*/
{
	string x
	string y
    
    /* Musical chairs with the string pointers */
	x = "a"
    y = "a"
    {
    	x = "a"
    	x = "c"
        
        /* This is true */
        string x
        x = "a"

		/* True: "a" == "a" */
		print(x)
		print(y)
		print((x == y))
        
        {
        	string y
            y = "a"
            
        	/* True: "a" != "a" */
			print(x)
			print(y)
			print((x != y))

			{
				/* False: "a" == "a" */
				print(x)
				print(y)
				print((x == y))
			}
        }
    }

	/* False: "c" == "a" */
	print(x)
	print(y)
	print((x == y))
}$`;

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

/**
 * Core Tests:
 *   - Scope
 *   - Variable Declarations
 *   - Print Statements
 *   - Assignment Statements
 *   - Heap pointer
 *   - if
 *   - while
 *   - etc.
 */
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

const CODE_GEN_IF_TEST = `{
	/* Output: a equals b showing a 4 a not equals b showing b 5 */
	int a
	a = 3
	int b
	b = 4
	a = b

	if (a== b) {
		print("a equals b showing a ")
		print(a)
	}

	b = 1 + a

	if (a != b) {
		print(" a not equals b showing b ")
		print(b)
	}
}$

/**
 * Another Code Generation Example
 * 
 * Output: 2 alan
 */
{
	int a
	a = 1
	{
		int a
		a = 2
		print(a)
	}
		string b
		b = "alan"
	if (a == 1) {
		print(" ")
		print(b)
	}
}$

/**
 * Now let’s make it more complicated by
 *   - adding another string 
 *   - changing the value of an existing string
 * 
 * Ouput: 2 alan null blackstone james
 */
{
	int a
	a = 1

	{
		int a
		a = 2
		print(a)
	}

	string b
	b = "alan"

	if(a == 1) {
		print(" ")
		print(b)
	}

	string c

	/* Show null pointer */
	print(" ")
	print(c)

	c = "james"

	b = "blackstone"

	print(" ")
	print(b)
	print(" ")
	print(c)
}$`;

const CODE_GEN_WHILE_TEST = `/**
 * Integer expression test 
 *
 * Output: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 done 
 */
{
	int a
	int b

	b = 1
	while (8 + 9 + b != 1 + a) {
		a = 1 + a
		print(a)
		print(" ")
	}

	print("done")
}$

/**
 * Integer Value test
 */
{
	int a
	a = a

	while(a != 5) {
		a = 1 + a
		print(" ")
		print(a)
	}
}$

/* String expression test */
{
	int a
	string b

	while (b == "null") {
		while (a != 9 + 1) {
			a = 2 + a

			if (a == 9 + 1) {
				b = "hello world"
			}
		}
	}

	/* Ouput "hello world" */
	print(b)
}$`;

/**
 * Edge cases
 */
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

{print("hello world")}$

{
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

{print("hello world")}$`;

const CODE_GEN_BOOLEAN_HELL_TEST = `/* Should print out... */
/* 0done */
{
	int a

	if(((a!=9) == true) == ((5==5) != (false == true))) {
		print(a)
	}
	print("done")
}$

/* 12345678done */
{
	int a

	while(((a!=9) == false) == ((5==5) != (false != true))) {
		print(a)
		a = 1 + a
	}

	print("done")
}$

/* wow */
{
	int a
	int b
	string c

	while((( a != 3 + b) == true) == (c == "null")) {
		a = 1 + a
	}

	if (a == 3) {
		print("wow")
	}
}$`;