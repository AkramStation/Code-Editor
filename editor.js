function runCode() {
  var code = editor.getValue();
  var consoleOutput = document.getElementById("console");
  consoleOutput.innerHTML = "";
  console.log = function(msg) {
    consoleOutput.innerHTML += msg + "\n";
  };
  eval(code);
}

