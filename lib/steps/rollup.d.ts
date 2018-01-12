import * as __rollup from 'rollup';
import { BuildStep } from '../deprecations';
export declare type BundleFormat = __rollup.Format;
export interface RollupOptions {
    moduleName: string;
    entry: string;
    format: BundleFormat;
    dest: string;
    umdModuleIds?: {
        [key: string]: string;
    };
    embedded?: string[];
}
export declare const externalModuleIdStrategy: (moduleId: string, embedded?: string[]) => boolean;
export declare const umdModuleIdStrategy: (moduleId: string, umdModuleIds?: {
    [key: string]: string;
}) => string;
export declare const flattenToFesm15: BuildStep;
export declare const flattenToUmd: BuildStep;
