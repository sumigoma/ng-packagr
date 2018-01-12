import { InjectionToken, Provider, ValueProvider } from 'injection-js';
export declare class NgPackagr {
    private providers;
    constructor(providers: Provider[]);
    withProviders(providers: Provider[]): NgPackagr;
    build(): Promise<void>;
}
export declare const ngPackagr: () => NgPackagr;
export declare const PROJECT_TOKEN: InjectionToken<string>;
export declare const provideProject: (project: string) => ValueProvider;
