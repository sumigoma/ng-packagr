import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
import { DirectoryPath, SourceFilePath } from './shared';
/**
 * An entry point - quoting Angular Package Format - is:
 *
 * > a module intended to be imported by the user. It is referenced by a unique module ID and
 * > exports the public API referenced by that module ID. An example is `@angular/core` or
 * > `@angular/core/testing`. Both entry points exist in the `@angular/core` package, but they
 * > export different symbols. A package can have many entry points.
 *
 * #### Public API, source file tree and build output
 *
 * An entry point serves as the root of a source tree.
 * The entry point's public API references one TypeScript source file (`*.ts`).
 * That source file, e.g. `public_api.ts`, references other source files who in turn may reference
 * other source files, thus creating a tree of source code files.
 * The source files may be TypeScript (`*.ts`), Templates (`.html`) or Stylesheets
 * (`.css`, `.scss`, ..), or other formats.
 *
 * The compilation process for an entry point is a series of transformations applied to the source
 * files, e.g. TypeScript compilation, Inlining of Stylesheets and Templates, and so on.
 * As a result of the compilation process, an entry point is transpiled to a set of artefacts
 * (the build output) which include a FESM'15 Bundle, a FESM'5 Bundle, AoT metadata, TypeScript
 * type definitions, and so on.
 *
 * #### Representation in the domain
 *
 * The set of artefacts is reflected by `NgArtefacts`;
 * one `NgEntryPoint` relates to one `NgArtefacts`.
 * The parent package of an entry point is reflected by `NgPackage`.
 */
export declare class NgEntryPoint {
    readonly packageJson: any;
    readonly ngPackageJson: NgPackageConfig;
    private readonly $schema;
    private basePath;
    private readonly secondaryData;
    constructor(packageJson: any, ngPackageJson: NgPackageConfig, $schema: SchemaClass<NgPackageConfig>, basePath: string, secondaryData?: {
        [key: string]: any;
    });
    /** Absolute file path of the entry point's source code entry file. */
    readonly entryFilePath: SourceFilePath;
    /** Absolute directory path of the entry point's 'package.json'. */
    readonly destinationPath: DirectoryPath;
    $get(key: string): any;
    readonly entryFile: SourceFilePath;
    readonly cssUrl: CssUrl;
    readonly umdModuleIds: {
        [key: string]: string;
    };
    readonly embedded: string[];
    readonly jsxConfig: string;
    readonly flatModuleFile: string;
    /**
     * The module ID is an "identifier of a module used in the import statements, e.g.
     * '@angular/core'. The ID often maps directly to a path on the filesystem, but this
     * is not always the case due to various module resolution strategies."
     */
    readonly moduleId: string;
    /**
     * The UMD module ID is a string value used for registering the module on the old-fashioned
     * JavaScript global scope.
     * Example: `@my/foo/bar` registers as `global['my']['foo']['bar']`.
     */
    readonly umdModuleId: string;
    private flattenModuleId(separator?);
}
export declare enum CssUrl {
    inline = "inline",
    none = "none",
}
