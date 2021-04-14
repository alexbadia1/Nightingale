/**
 * default_tests.js
 * 
 * This is a solid test to make sure your lexer is correctly generating tokens for boolean operations.
 */

 const RANDOM_BOOL_OPS_TEST = "== = = =!==!=!=!= == !== = != == ===!=!===!== =!===!=== ==!== !==!=!= !==!=!=!==!==";

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

const ALANS_PROJECT_ONE_TEST = 
   "{}$\n" + "{{{{{{}}}}}}$\n" 
   + "{{{{{{}}} /* comments are ignored */}}}}$\n" 
   +  "{/*comments are still ignored */ int @}$\n";

const SYMBOL_SALAD = "/* I will be very suprised if this doesn't break my lexer.\nThe illegal symbols detected should be: !, [, #, &, *, #, @, !, @, &, *, #, @, ! */\n{{}+{}{=!{}{!=[}}{=)()*}{+#&*#@}{!@&*#@}+!";

const LETTER_SOUP = 
"/* A mix of keywords, ids, symbols and illegal characters.\nThere Should be 3 errors*/\n" 
+ " int#aintb+intwh\tile{printfortrue==intift/*Did you make it this far? */true!ifi(fwhile=!false}print)stringa b c!=efg\"string\"while$";

const BROKEN_STRINGS = 
"/* Strings can accept [a-z] single_space, maybe a tab, but nothing else...\n"
+ "\t Thus we reject: commas (,), parenthesi? (), uppercase!, etc.*/\n"
+ "{\n"
+ "\tprint(\n"
+"\t\t\"The common nightingale, rufous nightingale or simply nightingale (Lusciniea megarhynchose),\n"
+ "\t\tis a small passerine bird best known for its powerful and beautiful song.\"\n"
+ "\t)\n"
+ "}\n"
+ "$\n\n"
+ "/* This ones unterminated! */\n"
+ "print(\"Common nightingales are so named because they...);$";

const BROKEN_COMMENTS = 
"/* These comments are broken, except for one of them... */\n\n"
+ "/* /* /* \"Nightingale\" is derived from \"night\", and the Old English galan,\n"
+ "\"to sing\". The genus name Luscinia isLatin for \"nightingale\" and megarhynchos\n" 
+ "is from Ancient Greek megas,\"great\" and rhunkhos \"bill\" */ */ */\n\n"
+ "/* The common nightingale is slightly larger than the European robin, at 15–16.5 cm (5.9–6.5 in) length.\n" 
+ "It is plain brown above except for the reddish tail. It is buff to white below. The sexes are similar. The eastern\n"
+ "subspecies (L. m. golzi) and the Caucasian subspecies (L. m. africana) have paler upperparts and a stronger face-pattern,\n"
+ "including a pale supercilium. The song of the nightingale[6] has been described as one of the most beautiful\n"
+"sounds in nature, inspiring songs, fairy tales, opera, books, and a great deal of poetry.\n"

// Parser Tests
const INCOMPLETE_EXPRESSIONS= 
`/* Incomplete Expressions */\n` 
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

// Parser Tests
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

// Parser Tests

const ALANS_PROJECT_TWO_TEST = `
/* You’re expecting anything that could start a statement or SYMBOL_CLOSE_BLOCK. */
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

const CRAZY_BOOLEAN_EXPRESSION = 
`/* This is theoretically correct.. I'll be damned if my computer doesn't blow up from this. */\n` 
+ `{\n`
+ `\tif( (((true != false) == (false == true)) == false) != true ){\n`
+ `\t\t print("wow")\n`
+ `\t}\n`
+ `}$\n\n`
+ `/* Broken program for more chaos */\n`
+ `}$\n\n`;

const SONARS_STRING_DECLARATION = 
`/* SONARS TEST CASE: This will fail because an identifier is expected but not provided */
{
	/* 1 is not a valid identifier */
	string 1
}$`;

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

const JUICE_COMPILER_CRAZY_ONE_LINER = 
"/* JUICES TEST CASE Test case for crazy one liner */\n"
+ "${hellotruefalse!======trueprinta=3b=0print(\"false true\")whi33leiftruefalsestring!= stringintbooleanaa truewhileif{hi+++==!==}}/*aaahaha*/hahahahaha/*awao*/$"