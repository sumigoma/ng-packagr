"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
/**
 * Build artefacts generated for an entry point (Angular library).
 *
 * The artefacts include distribution-ready 'binaries' as well as temporary files and
 * intermediate build output.
 */
class NgArtefacts {
    constructor(entryPoint, pkg) {
        this._extras = new Map();
        this.stageDir = path.resolve(pkg.workingDirectory, entryPoint.flatModuleFile, 'stage');
        this.outDir = path.resolve(pkg.workingDirectory, entryPoint.flatModuleFile, 'out');
    }
    extras(key, value) {
        if (value !== undefined) {
            // write
            this._extras.set(key, value);
        }
        else {
            // read
            return this._extras.get(key);
        }
    }
    get tsConfig() {
        return this.extras('tsConfig');
    }
    set tsConfig(value) {
        this.extras('tsConfig', value);
    }
    get tsSources() {
        return this.extras('tsSources');
    }
    set tsSources(value) {
        this.extras('tsSources', value);
    }
    template(file, content) {
        if (content !== undefined) {
            // write
            this.extras(`template:${file}`, content);
        }
        else {
            // read
            return this.extras(`template:${file}`);
        }
    }
    templates() {
        return Array.from(this._extras.keys())
            .filter((key) => key.startsWith('template:'))
            .map((key) => key.substring('template:'.length));
    }
    stylesheet(file, content) {
        if (content !== undefined) {
            // write
            this.extras(`stylesheet:${file}`, content);
        }
        else {
            // read
            return this.extras(`stylesheet:${file}`);
        }
    }
    stylesheets() {
        return Array.from(this._extras.keys())
            .filter((key) => key.startsWith('stylesheet:'))
            .map((key) => key.substring('stylesheet:'.length));
    }
    get es2015EntryFile() {
        return this.extras('es2015:entryFile');
    }
    set es2015EntryFile(filePath) {
        this.extras('es2015:entryFile', filePath);
    }
    get typingsEntryFile() {
        return this.extras('typings:entryFile');
    }
    set typingsEntryFile(filePath) {
        this.extras('typings:entryFile', filePath);
    }
    get fesm15BundleFile() {
        return this.extras('fesm15:bundleFile');
    }
    set fesm15BundleFile(filePath) {
        this.extras('fesm15:bundleFile', filePath);
    }
    get fesm5BundleFile() {
        return this.extras('fesm5:bundleFile');
    }
    set fesm5BundleFile(filePath) {
        this.extras('fesm5:bundleFile', filePath);
    }
    get umdBundleFile() {
        return this.extras('umd:bundleFile');
    }
    set umdBundleFile(filePath) {
        this.extras('umd:bundleFile', filePath);
    }
    get aotBundleFile() {
        return this.extras('aot:bundleFile');
    }
    set aotBundleFile(filePath) {
        this.extras('aot:bundleFile', filePath);
    }
}
exports.NgArtefacts = NgArtefacts;
//# sourceMappingURL=artefacts.js.map