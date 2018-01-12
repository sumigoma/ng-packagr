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
const copy_1 = require("../util/copy");
const path = require("path");
/**
 * Copies compiled source files from the intermediate working directory to the final locations
 * in the npm package's destination directory.
 */
exports.copySourceFilesToDestination = ({ artefacts, entryPoint, pkg }) => __awaiter(this, void 0, void 0, function* () {
    yield copy_1.copyFiles(`${artefacts.stageDir}/bundles/**/*.{js,js.map}`, path.resolve(pkg.dest, 'bundles'));
    yield copy_1.copyFiles(`${artefacts.stageDir}/esm5/**/*.{js,js.map}`, path.resolve(pkg.dest, 'esm5'));
    yield copy_1.copyFiles(`${artefacts.stageDir}/esm2015/**/*.{js,js.map}`, path.resolve(pkg.dest, 'esm2015'));
    yield copy_1.copyFiles(`${artefacts.outDir}/**/*.{d.ts,metadata.json}`, entryPoint.destinationPath);
});
//# sourceMappingURL=transfer.js.map