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
const __rollup = require("rollup");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonJs = require("rollup-plugin-commonjs");
const path = require("path");
const log = require("../util/log");
exports.externalModuleIdStrategy = (moduleId, embedded = []) => {
    // more information about why we don't check for 'node_modules' path
    // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
    if (path.isAbsolute(moduleId) ||
        moduleId.startsWith(".") ||
        moduleId.startsWith("/") ||
        moduleId.indexOf("commonjsHelpers") >= 0 || // in case we are embedding a commonjs module we need to include it's helpers also
        embedded.some(x => x === moduleId)) {
        // if it's either 'absolute', marked to embed, starts with a '.' or '/' it's not external
        return false;
    }
    return true;
};
exports.umdModuleIdStrategy = (moduleId, umdModuleIds = {}) => {
    let nameProvided;
    if (nameProvided = umdModuleIds[moduleId]) {
        return nameProvided;
    }
    let regMatch;
    if (regMatch = /^\@angular\/platform-browser-dynamic(\/?.*)/.exec(moduleId)) {
        return `ng.platformBrowserDynamic${regMatch[1]}`.replace("/", ".");
    }
    if (regMatch = /^\@angular\/platform-browser(\/?.*)/.exec(moduleId)) {
        return `ng.platformBrowser${regMatch[1]}`.replace("/", ".");
    }
    if (regMatch = /^\@angular\/(.+)/.exec(moduleId)) {
        return `ng.${regMatch[1]}`.replace("/", ".");
    }
    if (/^rxjs\/(add\/)?observable/.test(moduleId)) {
        return "Rx.Observable";
    }
    if (/^rxjs\/scheduler/.test(moduleId)) {
        return "Rx.Scheduler";
    }
    if (/^rxjs\/symbol/.test(moduleId)) {
        return "Rx.Symbol";
    }
    if (/^rxjs\/(add\/)?operator/.test(moduleId)) {
        return "Rx.Observable.prototype";
    }
    if (/^rxjs\/[^\/]+$/.test(moduleId)) {
        return "Rx";
    }
    return ''; // leave it up to rollup to guess the global name
};
/** Runs rollup over the given entry file, writes a bundle file. */
function rollup(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        log.debug(`rollup (v${__rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);
        // Create the bundle
        const bundle = yield __rollup.rollup({
            context: 'this',
            external: moduleId => exports.externalModuleIdStrategy(moduleId, opts.embedded || []),
            input: opts.entry,
            plugins: [
                nodeResolve({ jsnext: true, module: true }),
                commonJs(),
            ],
            onwarn: (warning) => {
                if (warning.code === 'THIS_IS_UNDEFINED') {
                    return;
                }
                log.warn(warning.message);
            }
        });
        // Output the bundle to disk
        yield bundle.write({
            name: `${opts.moduleName}`,
            file: opts.dest,
            format: opts.format,
            banner: '',
            globals: moduleId => exports.umdModuleIdStrategy(moduleId, opts.umdModuleIds || {}),
            sourcemap: true
        });
    });
}
exports.flattenToFesm15 = ({ artefacts, entryPoint, pkg }) => __awaiter(this, void 0, void 0, function* () {
    const fesm15File = path.resolve(artefacts.stageDir, 'esm2015', entryPoint.flatModuleFile + '.js');
    yield rollup({
        moduleName: entryPoint.moduleId,
        entry: artefacts.es2015EntryFile,
        format: 'es',
        dest: fesm15File,
        embedded: entryPoint.embedded
    });
    artefacts.fesm15BundleFile = fesm15File;
});
exports.flattenToUmd = ({ artefacts, entryPoint, pkg }) => __awaiter(this, void 0, void 0, function* () {
    const umdFile = path.resolve(artefacts.stageDir, 'bundles', entryPoint.flatModuleFile + '.umd.js');
    yield rollup({
        moduleName: entryPoint.umdModuleId,
        entry: artefacts.fesm5BundleFile,
        format: 'umd',
        dest: umdFile,
        umdModuleIds: Object.assign({}, entryPoint.umdModuleIds),
        embedded: entryPoint.embedded
    });
    artefacts.umdBundleFile = umdFile;
});
//# sourceMappingURL=rollup.js.map