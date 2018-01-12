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
const path = require("path");
const fs_extra_1 = require("fs-extra");
const entry_point_1 = require("../ng-package-format/entry-point");
const log = require("../util/log");
// CSS Tools
const autoprefixer = require("autoprefixer");
const browserslist = require("browserslist");
const postcss = require("postcss");
const sass = require("node-sass");
const nodeSassTildeImporter = require("node-sass-tilde-importer");
const less = require("less");
const stylus = require("stylus");
const postcssUrl = require("postcss-url");
exports.processAssets = ({ artefacts, entryPoint, pkg }) => __awaiter(this, void 0, void 0, function* () {
    // process templates
    const templates = yield Promise.all(artefacts.templates()
        .map((template) => __awaiter(this, void 0, void 0, function* () {
        return {
            name: template,
            content: yield processTemplate(template)
        };
    })));
    templates.forEach((template) => {
        artefacts.template(template.name, template.content);
    });
    // process stylesheets
    const stylesheets = yield Promise.all(artefacts.stylesheets()
        .map((stylesheet) => __awaiter(this, void 0, void 0, function* () {
        return {
            name: stylesheet,
            content: yield processStylesheet(stylesheet, pkg.src, entryPoint.cssUrl)
        };
    })));
    stylesheets.forEach((stylesheet) => {
        artefacts.stylesheet(stylesheet.name, stylesheet.content);
    });
    return Promise.resolve(artefacts);
});
/**
 * Process a component's template.
 *
 * @param templateFilePath Path of the HTML templatefile, e.g. `/Users/foo/Project/bar/bar.component.html`
 * @return Resolved content of HTML template file
 */
const processTemplate = (templateFilePath) => fs_extra_1.readFile(templateFilePath).then((buffer) => buffer.toString());
/**
 * Process a component's stylesheet file. Each stylesheet will be processed individually.
 *
 * @param stylesheetFilePath Path of the stylesheet, e.g. '/Users/foo/Project/bar/bar.component.scss'
 * @param srcFolder Source folder from 'ng-package.json'
 * @return Rendered CSS content of stylesheet file
 */
const processStylesheet = (stylesheetFilePath, srcFolder, cssUrl) => __awaiter(this, void 0, void 0, function* () {
    try {
        log.debug(`Render styles for ${stylesheetFilePath}`);
        const cssStyles = yield renderPreProcessor(stylesheetFilePath, srcFolder);
        log.debug(`determine browserslist for ${stylesheetFilePath}`);
        const browsers = browserslist(undefined, { stylesheetFilePath });
        log.debug(`postcss with autoprefixer for ${stylesheetFilePath}`);
        const postCssPlugins = [autoprefixer({ browsers })];
        if (cssUrl !== entry_point_1.CssUrl.none) {
            log.debug(`postcssUrl: ${cssUrl}`);
            postCssPlugins.push(postcssUrl({ url: cssUrl }));
        }
        const result = yield postcss(postCssPlugins)
            .process(cssStyles, {
            from: stylesheetFilePath,
            to: stylesheetFilePath.replace(path.extname(stylesheetFilePath), '.css')
        });
        // Escape existing backslashes for the final output into a string literal, which would otherwise escape the character after it
        result.css = result.css.replace(/\\/g, '\\\\');
        // Log warnings from postcss
        result.warnings().forEach((msg) => {
            log.warn(msg.toString());
        });
        return Promise.resolve(result.css);
    }
    catch (err) {
        return Promise.reject(new Error(`Cannot inline stylesheet ${stylesheetFilePath}`));
    }
});
function renderPreProcessor(filePath, srcPath) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (path.extname(filePath)) {
            case '.scss':
            case '.sass':
                log.debug(`rendering sass from ${filePath}`);
                return yield renderSass({ file: filePath, importer: nodeSassTildeImporter });
            case '.less':
                log.debug(`rendering less from ${filePath}`);
                return yield renderLess({ filename: filePath });
            case '.styl':
            case '.stylus':
                log.debug(`rendering styl from ${filePath}`);
                return yield renderStylus({ filename: filePath, root: srcPath });
            case '.css':
            default:
                log.debug(`reading css from ${filePath}`);
                return fs_extra_1.readFile(filePath).then((buffer) => buffer.toString());
        }
    });
}
const renderSass = (sassOpts) => {
    return new Promise((resolve, reject) => {
        sass.render(sassOpts, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.css.toString());
            }
        });
    });
};
const renderLess = (lessOpts) => {
    return fs_extra_1.readFile(lessOpts.filename)
        .then(buffer => buffer.toString())
        .then((lessData) => new Promise((resolve, reject) => {
        less.render(lessData || '', lessOpts, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.css.toString());
            }
        });
    }));
};
/**
 * filename - absolute path to file
 * root - root folder of project (where ng-package.json is located)
 */
const renderStylus = ({ filename, root }) => {
    return fs_extra_1.readFile(filename)
        .then(buffer => buffer.toString())
        .then((stylusData) => new Promise((resolve, reject) => {
        stylus(stylusData)
            .include(root)
            .include('.')
            .include('node_modules')
            .set('filename', filename)
            .set('resolve url', true)
            .define('url', stylus.resolver())
            .render((err, css) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(css);
            }
        });
    }));
};
//# sourceMappingURL=assets.js.map