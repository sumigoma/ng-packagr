"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const typescript_1 = require("typescript");
const fs_extra_1 = require("fs-extra");
const log_1 = require("../util/log");
/**
 * Downlevels a .js file from ES2015 to ES5. Internally, uses `tsc`.
 *
 * @param inputFile
 * @param outputFile
 */
function downlevelWithTsc(inputFile, outputFile) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.debug(`tsc ${inputFile} to ${outputFile}`);
        const inputBuffer = yield fs_extra_1.readFile(inputFile);
        const input = inputBuffer.toString();
        const compilerOptions = {
            target: typescript_1.ScriptTarget.ES5,
            module: typescript_1.ModuleKind.ES2015,
            allowJs: true,
            sourceMap: true,
            downlevelIteration: true,
            mapRoot: path.dirname(inputFile)
        };
        const transpiled = typescript_1.transpileModule(trimSourceMap(input.toString()), {
            fileName: path.basename(outputFile),
            moduleName: path.basename(outputFile, '.js'),
            compilerOptions
        });
        const sourceMap = JSON.parse(transpiled.sourceMapText);
        sourceMap['file'] = path.basename(outputFile);
        sourceMap['sources'] = [path.basename(inputFile)];
        yield Promise.all([
            fs_extra_1.outputFile(outputFile, transpiled.outputText),
            fs_extra_1.outputJson(`${outputFile}.map`, sourceMap, { spaces: 2 })
        ]);
    });
}
exports.downlevelWithTsc = downlevelWithTsc;
;
const REGEXP = /\/\/# sourceMappingURL=.*\.js\.map/;
const trimSourceMap = (fileContent) => {
    if (fileContent.match(REGEXP)) {
        return fileContent.replace(/\/\/# sourceMappingURL=.*\.js\.map/, '');
    }
    else {
        return fileContent;
    }
};
//# sourceMappingURL=tsc.js.map