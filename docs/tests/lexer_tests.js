/**
 * lexer_tests.js
 * 
 * Lexer tests are loaded on the html page and visible to the user.
 * 
 * This test file specifically tests the "tokenziabilty" of the Lexer in the compiler.
 */

/**
 * Lexer should determine the difference between Assingment Op [=], Boolean Equals [==] and Boolean Not Equals [!=]
 * based on a longest match algorithm. If your lexer outputs the first token as Assingment Op [=]... Something is very wrong...
 */
const RANDOM_BOOL_OPS_TEST = `== = = =!==!=!=!= == !== = != == ===!=!===!== =!===!=== ==!== !==!=!= !==!=!=!==!==`;

/**
 * Can your lexer determine illegal symbols...
 * For example how does your lexer know that != is legal but ! alone is illegal?
 */
const SYMBOL_SALAD = `/* I will be very suprised if this doesn't break my lexer.
The illegal symbols detected should be: !, [, #, &, *, #, @, !, @, &, *, #, @, ! */
{{}+{}{=!{}{!=[}}{=)()*}{+#&*#@}{!@&*#@}+!`;

/**
 * Really good way to test the longest matching principle... Also tests priority differences between keywords, id's and spaces
 */
const LETTER_SOUP = 
`/* A mix of keywords, ids, symbols and illegal characters.
There should be 3 errors*/ 
int#aintb+intwh\tile{printfortrue==intift/*Did you make it this far? */true!ifi(fwhile=!false}print)stringa b c!=efg\"string\"while$`;

/**
 * Read Alan's language carefully, and carefully reject terminals not part of the "Charlist" non-terminal.
 */
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

/**
 * Make sure comments are ignored...
 * What happens if your lexer is missing a close comment? What about nested comments? You decide.
 * 
 * Really, you can catch them now in Lex, or make more work for yourself in Parse... your choice...
 */
const BROKEN_COMMENTS = 
"/* These comments are broken, except for one of them... */\n\n"
+ "/* /* /* \"Nightingale\" is derived from \"night\", and the Old English galan,\n"
+ "\"to sing\". The genus name Luscinia isLatin for \"nightingale\" and megarhynchos\n" 
+ "is from Ancient Greek megas,\"great\" and rhunkhos \"bill\" */ */ */\n\n"
+ "/* The common nightingale is slightly larger than the European robin, at 15–16.5 cm (5.9–6.5 in) length.\n" 
+ "It is plain brown above except for the reddish tail. It is buff to white below. The sexes are similar. The eastern\n"
+ "subspecies (L. m. golzi) and the Caucasian subspecies (L. m. africana) have paler upperparts and a stronger face-pattern,\n"
+ "including a pale supercilium. The song of the nightingale[6] has been described as one of the most beautiful\n"
+"sounds in nature, inspiring songs, fairy tales, opera, books, and a great deal of poetry.\n";