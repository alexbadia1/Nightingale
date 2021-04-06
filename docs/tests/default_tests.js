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

const JUICE_COMPILER_CRAZY_ONE_LINER = 
"/* Test case for crazy one liner */\n"
+ "${hellotruefalse!======trueprinta=3b=0print(\"false true\")whi33leiftruefalsestring!= stringintbooleanaa truewhileif{hi+++==!==}}/*aaahaha*/hahahahaha/*awao*/$"