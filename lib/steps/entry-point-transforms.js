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
const package_1 = require("../steps/package");
const assets_1 = require("../steps/assets");
const ngc_1 = require("../steps/ngc");
const uglify_1 = require("../steps/uglify");
const sorcery_1 = require("../steps/sorcery");
const rollup_1 = require("../steps/rollup");
const tsc_1 = require("../steps/tsc");
const transfer_1 = require("../steps/transfer");
const log = require("../util/log");
const path_1 = require("../util/path");
const rimraf_1 = require("../util/rimraf");
/**
 * Transforms TypeScript source files to Angular Package Format.
 *
 * @param entryPoint The entry point that will be transpiled to a set of artefacts.
 */
exports.transformSources = (args) => __awaiter(this, void 0, void 0, function* () {
    const { artefacts, entryPoint, pkg } = args;
    log.info(`Building from sources for entry point '${entryPoint.moduleId}'`);
    // 0. CLEAN BUILD DIRECTORY
    log.info('Cleaning build directory');
    yield rimraf_1.rimraf(artefacts.outDir);
    yield rimraf_1.rimraf(artefacts.stageDir);
    // 1. TWO-PASS TSC TRANSFORMATION
    ngc_1.prepareTsConfig(args);
    // First pass: collect templateUrl and styleUrls referencing source files.
    log.info('Extracting templateUrl and styleUrls');
    ngc_1.collectTemplateAndStylesheetFiles(args);
    // Then, process assets keeping transformed contents in memory.
    log.info('Processing assets');
    yield assets_1.processAssets(args);
    // Second pass: inline templateUrl and styleUrls
    log.info('Inlining templateUrl and styleUrls');
    ngc_1.inlineTemplatesAndStyles(args);
    // 2. NGC
    log.info('Compiling with ngc');
    const tsOutput = yield ngc_1.ngc(entryPoint, artefacts);
    artefacts.es2015EntryFile = tsOutput.js;
    artefacts.typingsEntryFile = tsOutput.typings;
    artefacts.aotBundleFile = tsOutput.metadata;
    // 3. FESM15: ROLLUP
    log.info('Bundling to FESM15');
    yield rollup_1.flattenToFesm15(args);
    yield sorcery_1.remapSourceMap(artefacts.fesm15BundleFile);
    // 4. FESM5: TSC
    log.info('Bundling to FESM5');
    const fesm5File = path.resolve(artefacts.stageDir, 'esm5', entryPoint.flatModuleFile + '.js');
    yield tsc_1.downlevelWithTsc(artefacts.fesm15BundleFile, fesm5File);
    artefacts.fesm5BundleFile = fesm5File;
    yield sorcery_1.remapSourceMap(fesm5File);
    // 5. UMD: ROLLUP
    log.info('Bundling to UMD');
    yield rollup_1.flattenToUmd(args);
    yield sorcery_1.remapSourceMap(artefacts.umdBundleFile);
    // 6. UMD: Minify
    log.info('Minifying UMD bundle');
    const minUmdFile = yield uglify_1.minifyJsFile(artefacts.umdBundleFile);
    yield sorcery_1.remapSourceMap(minUmdFile);
    // 7. SOURCEMAPS: RELOCATE ROOT PATHS
    log.info('Remapping source maps');
    yield sorcery_1.relocateSourceMapSources({ artefacts, entryPoint });
    // 8. COPY SOURCE FILES TO DESTINATION
    log.info('Copying staged files');
    // TODO: doesn't work any more
    yield transfer_1.copySourceFilesToDestination({ artefacts, entryPoint, pkg });
    // 9. WRITE PACKAGE.JSON
    log.info('Writing package metadata');
    // TODO: doesn't work any more .... path.relative(secondary.basePath, primary.basePath);
    const relativeDestPath = path.relative(entryPoint.destinationPath, pkg.primary.destinationPath);
    yield package_1.writePackage(entryPoint, {
        main: path_1.ensureUnixPath(path.join(relativeDestPath, 'bundles', entryPoint.flatModuleFile + '.umd.js')),
        module: path_1.ensureUnixPath(path.join(relativeDestPath, 'esm5', entryPoint.flatModuleFile + '.js')),
        es2015: path_1.ensureUnixPath(path.join(relativeDestPath, 'esm2015', entryPoint.flatModuleFile + '.js')),
        typings: path_1.ensureUnixPath(`${entryPoint.flatModuleFile}.d.ts`),
        // XX 'metadata' property in 'package.json' is non-standard. Keep it anyway?
        metadata: path_1.ensureUnixPath(`${entryPoint.flatModuleFile}.metadata.json`)
    });
    log.success(`Built ${entryPoint.moduleId}`);
});
//# sourceMappingURL=entry-point-transforms.js.map