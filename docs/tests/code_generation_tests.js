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

const CODE_GEN_VARRIABLE_DECLARATIONS_TEST = `/* Testing variable declarations. 
Semantic Analysis should warn that these are 
declared and unused, but code generation should 
be fine (there's just no output for this program)*/
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

const CODE_GEN_PRINT_TEST = `{
	/* Basic print statements */
	print(0)
    print(true)
    print(false)
    print("hello world")
	print(9)
    
	/* Printing identifiers */
    int a
    boolean b
    string c
    
    print(a)
    print(b)
    print(c)
}
$`;