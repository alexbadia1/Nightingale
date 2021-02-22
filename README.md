# Nightingale
Nightingale- a browser based Compiler in Typescript.

Nightingale will compile predefined code grammar to 6502a Op Codes, providing well defined compilation feedback.

## Getting Started

Instructions to run the project on your local machine.

### Prerequisites

First you'll need to setup typescript

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
2. Run `npm install -g typescript` to get the TypeScript Compiler. (You may need to do this as root.)

#### IDE SUPPORT

IDE's like Visual Studio Code, IntelliJ and probably others already support TypeScript-to-JavaScript compilation.
Make sure you have the necessary plugins installed for your IDE.

#### NO IDE SUPPORT

You'll need to automate the compilation process with something like Gulp.

- Setup Gulp
1. `npm install -g gulp` to get the Gulp Task Runner.
1. `npm install -g gulp-tsc` to get the Gulp TypeScript plugin.

Run `gulp` at the command line in the root directory of this project.
Edit your TypeScript files in the source/scripts directory.

### Installing

Installing with Gitbash is easy!

1. Clone the remote branch to your local machine by typing `git clone [paste url here]`.

The c.bat file and tsconfig.json are already defined in the Nightingale/ folder.
Note: /docs allows this project to be hosted with github.

2. Open a terminal and navigate to the Nightingale/ floder.

The `tsc` command will compile all typescript files *only* located in Nightingale/docs/src.
The resulting javascript will be outputted in Nightingale/docs/distrib.

3. Run the command `tsc` to compile typescript to javascript.

Nightingale was designed to run on chrome first, but should work on any browser.

4. Open the index.html file in a browser of your choice.

## Running the tests

All tests are located in the Nightingale/docs/test and are implemented in index.html as javascript scripts.

### How to run a test

To enable a test:

### Creating your own test

```
function Test() {
  this.version 2112;

  /// Greet the user
  ///
  /// This init() function is called immediately on start up as this test is called in index.html
  /// and describes what this test actually, well, tests.
  this.init = function () {
  alert('[Insert your message here. Try to make this message describe what the test is doing]')
  }// init


  /// Tests are performed here
  this.afterStartup = function() {}// afterstartup
}// Test

```

### Sample test

TBD

## Built With

- IDE: Visual Code Studio.
- Languages: Typescript, javascript, html, css.

## Authors
- Alex Badia (me)
- Alan Labouseur -teacher, mentor, enemy-

## Oh and yeah, grading...

TBD
