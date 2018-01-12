"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injection_js_1 = require("injection-js");
const build_ng_package_1 = require("../steps/build-ng-package");
class NgPackagr {
    constructor(providers) {
        this.providers = providers;
    }
    withProviders(providers) {
        this.providers = [
            ...this.providers,
            ...providers
        ];
        return this;
    }
    build() {
        const injector = injection_js_1.ReflectiveInjector.resolveAndCreate(this.providers);
        const project = injector.get(exports.PROJECT_TOKEN);
        return build_ng_package_1.buildNgPackage({ project });
    }
}
exports.NgPackagr = NgPackagr;
exports.ngPackagr = () => new NgPackagr([]);
exports.PROJECT_TOKEN = new injection_js_1.InjectionToken('ng.v5.project');
exports.provideProject = (project) => ({
    provide: exports.PROJECT_TOKEN,
    useValue: project
});
//# sourceMappingURL=packagr.js.map