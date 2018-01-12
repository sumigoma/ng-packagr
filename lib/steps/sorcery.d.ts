import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgEntryPoint } from '../ng-package-format/entry-point';
/**
 * Re-maps the source `.map` file for the given `sourceFile`. This keeps source maps intact over
 * a series of transpilations!
 *
 * @param sourceFile Source file
 */
export declare function remapSourceMap(sourceFile: string): Promise<void>;
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
export declare function relocateSourceMapSources({artefacts, entryPoint}: {
    artefacts: NgArtefacts;
    entryPoint: NgEntryPoint;
}): Promise<void>;
