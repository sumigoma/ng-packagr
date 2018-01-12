"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
exports.error = (err) => {
    if (err instanceof Error) {
        console.log('\n' + chalk.red('BUILD ERROR'));
        console.log(chalk.red(err.message));
        console.log(chalk.red(err.stack) + '\n');
    }
    else {
        console.log(chalk.red(err));
    }
};
exports.warn = (msg) => {
    console.log(chalk.yellow(msg));
};
exports.success = (msg) => {
    console.log(chalk.green(msg));
};
exports.info = (msg) => {
    console.log(chalk.blue(msg));
};
exports.debug = (msg) => {
    if (process.env.DEBUG) {
        console.log(chalk.inverse.cyan(`[debug] ${msg}`));
    }
};
//# sourceMappingURL=log.js.map