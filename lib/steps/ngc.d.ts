import * as ng from '@angular/compiler-cli';
import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { BuildStep } from '../deprecations';
/** TypeScript configuration used internally (marker typer). */
export declare type TsConfig = ng.ParsedConfiguration;
/** Prepares TypeScript Compiler and Angular Compiler option. */
export declare const prepareTsConfig: BuildStep;
/** Extracts templateUrl and styleUrls from `@Component({..})` decorators. */
export declare const collectTemplateAndStylesheetFiles: BuildStep;
/** Transforms templateUrl and styleUrls in `@Component({..})` decorators. */
export declare const inlineTemplatesAndStyles: BuildStep;
/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param entryPoint Angular package data
 * @returns Promise<{}> Pathes of the flatModuleOutFile
 */
export declare function ngc(entryPoint: NgEntryPoint, artefacts: NgArtefacts): Promise<{
    js: string;
    metadata: string;
    typings: string;
}>;
