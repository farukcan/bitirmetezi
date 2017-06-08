console.log("TESTING 15sec");
eval(require("fs").readFileSync("app.js", 'utf8'));
setTimeout(process.exit,15000);
console.log("TEST PASSED");
