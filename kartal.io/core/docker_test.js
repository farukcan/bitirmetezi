console.log("TESTING");
eval(require("fs").readFileSync("app.js", 'utf8'));
setTimeout(process.exit,5000);
console.log("TEST PASSED");
