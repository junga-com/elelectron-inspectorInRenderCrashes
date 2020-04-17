
// this block is fine in the main process but crashes the renderer. I has the same error when its in renderer.js
const inspector = require('inspector');
const session = new inspector.Session();
//session.connect();  //!!! crash: ... assert: '(client_) != nullptr'
// ../../third_party/electron_node/src/inspector_agent.cc:824:std::unique_ptr<InspectorSession> node::inspector::Agent::Connect(std::unique_ptr<InspectorSessionDelegate>, bool): Assertion `(client_) != nullptr' failed.


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The following block goes on to show the practical example of this bug. The REPL module uses inspector. If useGlobal is false,
// it will crash in repl.start when it tries to create a new context without access to the globals. If useGlobal is true, it crashes
// when the user presses <tab> while completing the first word because it uses inspector to get a list of lexical scoped variables 
// to complete.

for (const arg of process.argv) {
  if (/^--repl=/.test(arg))
    ttyDev = arg.split('=')[1];
}

const tty = require('tty');
const fs = require('fs');
const repl = require('repl');

ttyFD = fs.openSync(ttyDev, 'as+');
ttyRead = new tty.ReadStream(ttyFD, {});
ttyWrite = new tty.WriteStream(ttyFD);


const { Console } = require('console');
console = new Console(ttyWrite, ttyWrite);

repl.start({
  prompt: 'renderRepl> ',
  input:  ttyRead,
  output: ttyWrite,
  useGlobal: true
});

// end of the new code (below is the original electron-quick-start code)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
