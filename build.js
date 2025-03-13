const Compiler = require("google-closure-compiler").compiler;

const BUILD_DIR = "./build";
const appCompiler = new Compiler({
    js: "app.js",
    compilation_level: "ADVANCED",
    js_output_file: BUILD_DIR + "/app.js"
});

appCompiler.run((_exitCode, _stdout, stderr) => {
    if (stderr) {
        console.error(stderr);
        return;
    }
});

const popupCompiler = new Compiler({
    js: "popup/popup.js",
    compilation_level: "ADVANCED",
    js_output_file: BUILD_DIR + "/popup/popup.js"
});

popupCompiler.run((_exitCode, _stdout, stderr) => {
    if (stderr) {
        console.error(stderr);
        return;
    }
});
