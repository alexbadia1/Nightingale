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