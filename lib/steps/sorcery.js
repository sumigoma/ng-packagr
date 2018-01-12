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
const sorcery = require("sorcery");
const json_1 = require("../util/json");
const log_1 = require("../util/log");
/**
 * Re-maps the source `.map` file for the given `sourceFile`. This keeps source maps intact over
 * a series of transpilations!
 *
 * @param sourceFile Source file
 */
function remapSourceMap(sourceFile) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.debug(`re-mapping sources for ${sourceFile}`);
        const opts = {
            inline: false,
            includeContent: true,
        };
        // Once sorcery loads the chain of sourcemaps, the new sourcemap will be written asynchronously.
        const chain = yield sorcery.load(sourceFile);
        if (!chain) {
            throw new Error('Failed to load sourceMap chain for ' + sourceFile);
        }
        yield chain.write(opts);
    });
}
exports.remapSourceMap = remapSourceMap;
/**
 * Relocates pathes of the `sources` file array in `*.js.map` files.
 *
 * Simply said, because `sourcesContent` are inlined in the source maps, it's possible to pass an
 * arbitrary file name and path in the `sources` property. By setting the value to a common prefix,
 * i.e. `ng://@org/package/secondary`,
 * the source map p `.map` file's relative root file paths to the module's name.
 *
 * @param pkg Angular package
 */
function relocateSourceMapSources({ artefacts, entryPoint }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield json_1.modifyJsonFiles(`${artefacts.stageDir}/+(bundles|esm2015|esm5)/**/*.js.map`, (sourceMap) => {
            sourceMap.sources = sourceMap.sources
                .map((path) => {
                let trimmedPath = path;
                // Trim leading '../' path separators
                while (trimmedPath.startsWith('../')) {
                    trimmedPath = trimmedPath.substring(3);
                }
                return `ng://${entryPoint.moduleId}/${trimmedPath}`;
            });
            return sourceMap;
        });
    });
}
exports.relocateSourceMapSources = relocateSourceMapSources;
//# sourceMappingURL=sorcery.js.map