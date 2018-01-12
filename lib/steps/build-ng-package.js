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
const artefacts_1 = require("../ng-package-format/artefacts");
const copy_1 = require("../util/copy");
const log = require("../util/log");
const rimraf_1 = require("../util/rimraf");
const init_1 = require("./init");
const entry_point_transforms_1 = require("./entry-point-transforms");
// XX: should eventually become a BuildStep
function buildNgPackage(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        log.info(`Building Angular Package`);
        let ngPackage;
        try {
            // READ `NgPackage` from either 'package.json', 'ng-package.json', or 'ng-package.js'
            ngPackage = yield init_1.discoverPackages(opts);
            // clean the primary dest folder (should clean all secondary module directories as well)
            yield rimraf_1.rimraf(ngPackage.dest);
            const artefacts = new artefacts_1.NgArtefacts(ngPackage.primary, ngPackage);
            yield entry_point_transforms_1.transformSources({ artefacts, entryPoint: ngPackage.primary, pkg: ngPackage });
            for (const secondary of ngPackage.secondaries) {
                const artefacts = new artefacts_1.NgArtefacts(secondary, ngPackage);
                yield entry_point_transforms_1.transformSources({ artefacts, entryPoint: secondary, pkg: ngPackage });
            }
            yield copy_1.copyFiles(`${ngPackage.src}/README.md`, ngPackage.dest);
            yield copy_1.copyFiles(`${ngPackage.src}/LICENSE`, ngPackage.dest);
            // clean the working directory for a successful build only
            yield rimraf_1.rimraf(ngPackage.workingDirectory);
            log.success(`Built Angular Package!
 - from: ${ngPackage.src}
 - to:   ${ngPackage.dest}
    `);
        }
        catch (error) {
            // Report error messages and throw the error further up
            log.error(error);
            if (ngPackage) {
                log.info(`Build failed. The working directory was not pruned. Files are stored at ${ngPackage.workingDirectory}.`);
            }
            throw error;
        }
    });
}
exports.buildNgPackage = buildNgPackage;
//# sourceMappingURL=build-ng-package.js.map