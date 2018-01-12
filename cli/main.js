#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const path = require("path");
const command_1 = require("../lib/commands/command");
const build_command_1 = require("../lib/commands/build.command");
const version_command_1 = require("../lib/commands/version.command");
const DEFAULT_PROJECT_PATH = path.resolve(process.cwd(), 'ng-package.json');
function parseProjectPath(parsed) {
    return parsed || DEFAULT_PROJECT_PATH;
}
program
    .name('ng-packagr')
    .option('-V, --version', 'Prints version info')
    .option('-p, --project [path]', 'Path to the \'ng-package.json\' or \'package.json\' file.', parseProjectPath, DEFAULT_PROJECT_PATH);
program.on('option:version', () => {
    version_command_1.version();
    process.exit(0);
});
program
    .parse(process.argv);
command_1.execute(build_command_1.build, { project: program.opts().project })
    .catch((err) => process.exit(111));
//# sourceMappingURL=main.js.map