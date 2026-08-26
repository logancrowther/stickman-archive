// Deploy-time only — turns the plain, readable js/*.js in this repo into an
// obfuscated build in dist/js/. The repo's own source stays untouched; only
// the Docker image ships the obfuscated output. Run via `npm run build`.
//
// Settings are deliberately conservative: this game runs a real-time canvas
// loop, and heavy transforms (control-flow flattening, dead-code injection,
// self-defending) can tank frame rate or break timing-sensitive code for
// little extra deterrence. renameGlobals stays false because data.js,
// appearance.js, and game.js are plain <script> tags sharing one global
// scope (no bundler, no modules) — renaming top-level declarations would
// break the cross-file references between them.
const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

const SRC_DIR = path.join(__dirname, "..", "js");
const OUT_DIR = path.join(__dirname, "..", "dist", "js");

const OPTIONS = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.75,
  transformObjectKeys: false,
  unicodeEscapeSequence: false
};

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const file of fs.readdirSync(SRC_DIR)) {
  if (!file.endsWith(".js")) continue;
  const srcPath = path.join(SRC_DIR, file);
  const code = fs.readFileSync(srcPath, "utf8");
  const result = JavaScriptObfuscator.obfuscate(code, OPTIONS).getObfuscatedCode();
  fs.writeFileSync(path.join(OUT_DIR, file), result);
  console.log(`obfuscated ${file}`);
}
