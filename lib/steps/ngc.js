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
const ng = require("@angular/compiler-cli");
const ts = require("typescript");
const log = require("../util/log");
// XX: internal in ngc's `main()`, a tsickle emit callback is passed to the tsc compiler
// ... blatanlty copy-paste the emit callback here. it's not a public api.
// ... @link https://github.com/angular/angular/blob/24bf3e2a251634811096b939e61d63297934579e/packages/compiler-cli/src/main.ts#L36-L38
const ngc_patches_1 = require("../util/ngc-patches");
const ts_transformers_1 = require("../util/ts-transformers");
/** Prepares TypeScript Compiler and Angular Compiler option. */
exports.prepareTsConfig = ({ artefacts, entryPoint, pkg }) => {
    const basePath = path.dirname(entryPoint.entryFilePath);
    // Read the default configuration and overwrite package-specific options
    const tsConfig = ng.readConfiguration(path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json'));
    tsConfig.rootNames = [entryPoint.entryFilePath];
    tsConfig.options.flatModuleId = entryPoint.moduleId;
    tsConfig.options.flatModuleOutFile = `${entryPoint.flatModuleFile}.js`;
    tsConfig.options.basePath = basePath;
    tsConfig.options.baseUrl = basePath;
    tsConfig.options.rootDir = basePath;
    tsConfig.options.outDir = artefacts.outDir;
    tsConfig.options.genDir = artefacts.outDir;
    switch (entryPoint.jsxConfig) {
        case 'preserve':
            tsConfig.options.jsx = ts.JsxEmit.Preserve;
            break;
        case 'react':
            tsConfig.options.jsx = ts.JsxEmit.React;
            break;
        case 'react-native':
            tsConfig.options.jsx = ts.JsxEmit.ReactNative;
            break;
        default:
            break;
    }
    artefacts.tsConfig = tsConfig;
};
/** Transforms TypeScript AST */
const transformSources = (tsConfig, transformers) => {
    const compilerHost = ng.createCompilerHost({
        options: tsConfig.options
    });
    const program = ng.createProgram({
        rootNames: [...tsConfig.rootNames],
        options: tsConfig.options,
        host: compilerHost
    });
    const sourceFiles = program.getTsProgram().getSourceFiles();
    const transformationResult = ts.transform(
    // XX: circumvent tsc compile error in 2.6
    Array.from(sourceFiles), transformers, tsConfig.options);
    return transformationResult;
};
//const compilerHostFromTransformation =
//  ({transformation, options}: {transformation: ts.TransformationResult<ts.SourceFile>, options: ts.CompilerOptions}): ts.CompilerHost => {
const compilerHostFromArtefacts = (artefacts) => {
    const wrapped = ts.createCompilerHost(artefacts.tsConfig.options);
    return Object.assign({}, wrapped, { getSourceFile: (fileName, version) => {
            const inTransformation = artefacts.tsSources.transformed
                .find((file) => file.fileName === fileName);
            if (inTransformation) {
                // FIX see https://github.com/Microsoft/TypeScript/issues/19950
                if (!inTransformation['ambientModuleNames']) {
                    inTransformation['ambientModuleNames'] = inTransformation['original']['ambientModuleNames'];
                }
                // FIX synthesized source files cause ngc/tsc/tsickle to chock
                if ((inTransformation.flags & 8) !== 0) {
                    const sourceText = artefacts.extras(`ts:${inTransformation.fileName}`).writeSourceText();
                    return ts.createSourceFile(inTransformation.fileName, sourceText, inTransformation.languageVersion, true, ts.ScriptKind.TS);
                }
                return inTransformation;
            }
            else {
                return wrapped.getSourceFile(fileName, version);
            }
        }, getSourceFileByPath: (fileName, path, languageVersion) => {
            console.warn("getSourceFileByPath");
            return wrapped.getSourceFileByPath(fileName, path, languageVersion);
        } });
};
/** Extracts templateUrl and styleUrls from `@Component({..})` decorators. */
exports.collectTemplateAndStylesheetFiles = ({ artefacts, entryPoint, pkg }) => {
    const tsConfig = artefacts.tsConfig;
    const collector = ts_transformers_1.componentTransformer({
        templateProcessor: (a, b, templateFilePath) => {
            artefacts.template(templateFilePath, null);
        },
        stylesheetProcessor: (a, b, styleFilePath) => {
            artefacts.stylesheet(styleFilePath, null);
        }
    });
    artefacts.tsSources = transformSources(tsConfig, [collector]);
};
class SynthesizedSourceFile {
    constructor(original) {
        this.original = original;
        this.replacemenets = [];
    }
    addReplacement(replacement) {
        this.replacemenets.push(replacement);
    }
    writeSourceText() {
        const originalSource = this.original.getFullText();
        let newSource = '';
        let position = 0;
        for (let replacement of this.replacemenets) {
            newSource = newSource.concat(originalSource.substring(position, replacement.from))
                .concat(replacement.text);
            position = replacement.to;
        }
        newSource = newSource.concat(originalSource.substring(position));
        return newSource;
    }
}
/** Transforms templateUrl and styleUrls in `@Component({..})` decorators. */
exports.inlineTemplatesAndStyles = ({ artefacts, entryPoint, pkg }) => {
    const tsConfig = artefacts.tsConfig;
    // inline contents from artefacts set (generated in a previous step)
    const transformer = ts_transformers_1.componentTransformer({
        templateProcessor: (a, b, templateFilePath) => artefacts.template(templateFilePath) || '',
        stylesheetProcessor: (a, b, styleFilePath) => artefacts.stylesheet(styleFilePath) || '',
        sourceFileWriter: (sourceFile, node, synthesizedSourceText) => {
            const key = `ts:${sourceFile.fileName}`;
            const synthesizedSourceFile = artefacts.extras(key) || new SynthesizedSourceFile(sourceFile);
            synthesizedSourceFile.addReplacement({
                from: node.getStart(),
                to: node.getEnd(),
                text: synthesizedSourceText
            });
            artefacts.extras(key, synthesizedSourceFile);
        }
    });
    artefacts.tsSources = ts.transform(artefacts.tsSources.transformed, [transformer]);
};
/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param entryPoint Angular package data
 * @returns Promise<{}> Pathes of the flatModuleOutFile
 */
function ngc(entryPoint, artefacts) {
    return __awaiter(this, void 0, void 0, function* () {
        log.debug(`ngc (v${ng.VERSION.full}): ${entryPoint.entryFile}`);
        // ng.CompilerHost
        const tsConfig = artefacts.tsConfig;
        const ngCompilerHost = ng.createCompilerHost({
            options: tsConfig.options,
            tsHost: compilerHostFromArtefacts(artefacts)
        });
        // ng.Program
        const ngProgram = ng.createProgram({
            rootNames: [...tsConfig.rootNames],
            options: tsConfig.options,
            host: ngCompilerHost
        });
        // ngc
        const result = ng.performCompilation({
            rootNames: [...tsConfig.rootNames],
            options: tsConfig.options,
            emitFlags: tsConfig.emitFlags,
            emitCallback: ngc_patches_1.createEmitCallback(tsConfig.options),
            host: ngCompilerHost,
            oldProgram: ngProgram
        });
        const exitCode = ng.exitCodeFromResult(result.diagnostics);
        if (exitCode === 0) {
            const outDir = tsConfig.options.outDir;
            const outFile = tsConfig.options.flatModuleOutFile;
            const extName = path.extname(outFile);
            artefacts.tsSources.dispose();
            return Promise.resolve({
                js: path.resolve(outDir, outFile),
                metadata: path.resolve(outDir, outFile.replace(extName, '.metadata.json')),
                typings: path.resolve(outDir, outFile.replace(extName, '.d.ts'))
            });
        }
        else {
            return Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
        }
    });
}
exports.ngc = ngc;
//# sourceMappingURL=ngc.js.map