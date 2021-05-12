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