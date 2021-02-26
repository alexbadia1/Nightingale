function Test() {

    this.version = 2112;

    // Greet the user
    //
    // This init() function is called immediately on start up as this test is called in index.html
    // and describes what this test actually, well, tests.
    this.init = function () {
        alert('[Insert your message here. Try to make this message describe what the test is doing]')
    }// init


    // Tests are performed here
    this.afterStartup = function () { }// afterstartup
}// Test