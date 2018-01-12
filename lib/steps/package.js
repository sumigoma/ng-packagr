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
const fs_extra_1 = require("fs-extra");
const path = require("path");
const log = require("../util/log");
/**
 * Creates and writes a `package.json` file of the entry point used by the `node_module`
 * resolution strategies.
 *
 * #### Example
 *
 * A consumer of the enty point depends on it by `import {..} from '@my/module/id';`.
 * The module id `@my/module/id` will be resolved to the `package.json` file that is written by
 * this build step.
 * The proprties `main`, `module`, `typings` (and so on) in the `package.json` point to the
 * flattened JavaScript bundles, type definitions, (...).
 *
 * @param entryPoint An entry point of an Angular package / library
 * @param binaries Binary artefacts (bundle files) to merge into `package.json`
 */
function writePackage(entryPoint, binaries) {
    return __awaiter(this, void 0, void 0, function* () {
        log.debug('writePackage');
        const packageJson = entryPoint.packageJson;
        // set additional properties
        for (const fieldName in binaries) {
            packageJson[fieldName] = binaries[fieldName];
        }
        packageJson.name = entryPoint.moduleId;
        // keep the dist package.json clean
        // this will not throw if ngPackage field does not exist
        delete packageJson.ngPackage;
        // `outputJson()` creates intermediate directories, if they do not exist
        // -- https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md
        yield fs_extra_1.outputJson(path.resolve(entryPoint.destinationPath, 'package.json'), packageJson, { spaces: 2 });
    });
}
exports.writePackage = writePackage;
//# sourceMappingURL=package.js.map