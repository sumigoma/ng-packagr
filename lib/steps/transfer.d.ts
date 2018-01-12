import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { NgPackage } from '../ng-package-format/package';
/**
 * Copies compiled source files from the intermediate working directory to the final locations
 * in the npm package's destination directory.
 */
export declare const copySourceFilesToDestination: ({artefacts, entryPoint, pkg}: {
    artefacts: NgArtefacts;
    entryPoint: NgEntryPoint;
    pkg: NgPackage;
}) => Promise<void>;
