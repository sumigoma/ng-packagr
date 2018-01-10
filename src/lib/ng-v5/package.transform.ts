import { InjectionToken, FactoryProvider, ValueProvider } from 'injection-js';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap } from 'rxjs/operators';
import { BuildGraph } from '../brocc/build-graph';
import { Node } from '../brocc/node';
import { discoverPackages } from '../steps/init';
import { rimraf } from '../util/rimraf';

export const PROJECT_TOKEN = new InjectionToken<string>(`ng.v5.project`);

export const provideProject = (project: string): ValueProvider => ({
  provide: PROJECT_TOKEN,
  useValue: project
});

export const projectTransformFactory = (project: string) =>
  (source$: Observable<BuildGraph>): Observable<BuildGraph> => {

    return source$.pipe(
      switchMap(graph => {
        const pkg = discoverPackages({ project });

        return fromPromise(pkg).pipe(
          switchMap((value) => {

            return fromPromise(
              // clean the primary dest folder (should clean all secondary module directories as well)
              rimraf(value.dest)
            ).pipe(
              map(() => value)
            );
          }),
          map((value) => {
            const ngPkg = new Node(`pkg://${project}`);
            ngPkg.type = 'application/ng-package';
            ngPkg.data = value;

            return graph.set(ngPkg);
          })
        );
      })
    );
  };

export const PACKAGE_TRANSFORM_TOKEN = new InjectionToken<any>(`ng.v5.packageTransform`);

export const PACKAGE_TRANSFORM_PROVIDER: FactoryProvider = {
  provide: PACKAGE_TRANSFORM_TOKEN,
  deps: [ PROJECT_TOKEN ],
  useFactory: projectTransformFactory
};
