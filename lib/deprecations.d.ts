import { NgArtefacts } from './ng-package-format/artefacts';
import { NgEntryPoint } from './ng-package-format/entry-point';
import { NgPackage } from './ng-package-format/package';
import { CliArguments } from './commands/build.command';
export declare function createNgPackage(opts: CliArguments): Promise<void>;
/**
 * XX: to be renamed to `BuildTask`, `BuildStep`, `Task`, ... ??!??
 *
 * Call signature for a build step.
 *
 * @experimental Might change in the future!
 */
export interface BuildStep {
    ({}: {
        artefacts: NgArtefacts;
        entryPoint: NgEntryPoint;
        pkg: NgPackage;
    }): void | any | Promise<void | any>;
}
