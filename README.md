# Nightingale
Nightingale- a browser based Compiler in Typescript published at: https://alexbadia1.github.io/Nightingale/

Nightingale will compile predefined code grammar to 6502a Op Codes, providing well defined compilation feedback.

## Getting Started

Instructions to run the project on your local machine.

### Prerequisites

I recommend downloading npm with typescript.

Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
Be sure a path variable is set to the npm /bin to make it easier running npm commands from th command line.

### Installing

You can use npm to install TypeScript globally, 
this means you can use the tsc command anywhere in your terminal.

Run `npm install -g typescript` to get the TypeScript Compiler. (You may need root privileges.)

### Compiling Typescipt

I recommend Gitbash!

1. Clone the remote branch to your local machine by typing `git clone [paste url here]`.

The c.bat file and tsconfig.json are already defined in the Nightingale/ folder.
Note: /docs allows this project to be hosted with github.

2. Open a terminal and navigate to the Nightingale /folder.

The `tsc` command will compile all typescript files *only* located in Nightingale/docs/src.
The resulting javascript will be outputted in Nightingale/docs/distrib.

3. Run the command `tsc` to compile typescript to javascript.

Nightingale was designed to run on chrome first, but should work on any browser.

4. Open the index.html file in a browser of your choice.

## Tour

This project uses a pseudo MVP architecture. I don't like the whole "global" architecture from OS.

For those unfamilar with MVP (Model View Controller)...

1. Model --> data representation of application states or business logic. This is where you create your objects (i.e. a user account model, etc.)
2. View --> a "dumb" UI representation of the models. This is literally how you, the user, visually/physically perceives the model.
3. Controller --> where the business logic actually occurs, manipulating both the models and views to make the application responsive.

So, as follows

1. Models >
  - Tokens
  - AST (logical and visual)
  - CST (logical and visual)
  - UI Consoles (yes, I can predefine a model "output console" by giving it data from a controller)
  - etc.
2. Views > 
  - index.html
  - css
  - javascript (UI dynamic scripts, like doing something after hitting a button)
  - jquery (UI dynamic scripts, like doing something after hitting a button)
  - etc.
3. Controllers >
  - compiler
  - lexer (creates and shows token, and output console models)
  - parser (created and shows CST)
  - semantic analysis (creates and shows AST)
  - etc.

## Tests

All tests are located in the Nightingale/docs/test/ and are added in index.html from javascript test files.

Since this is a compiler, all tests are strings, that will be lexed, parsed and semantically analyzed. 
If the string is valid 6502a op codes are generated for it.

TBD

## Built With

- IDE: Visual Code Studio.
- Languages: Typescript, javascript, html, css.

## Authors
- Alex Badia (me)
- Alan Labouseur -teacher, mentor, enemy-

## Oh and yeah, grading...

  Each branch will be for each specific iProject1, iProject2, iProject3, etc.

  As you can see, I've been creating pull requests and merging the specific branches into the main branch.
  The main branch should be up to date with the latest branch, but if there are any glaring issues it probably means I forgot to merge the branch.
