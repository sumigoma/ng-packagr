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
const build_command_1 = require("./commands/build.command");
const command_1 = require("./commands/command");
const log = require("./util/log");
function createNgPackage(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        log.warn(`DEPRECATED: createNgPackage() is becoming deprecated. Invoke the 'build: Command' instead.`);
        return command_1.execute(build_command_1.build, opts);
    });
}
exports.createNgPackage = createNgPackage;
//# sourceMappingURL=deprecations.js.map