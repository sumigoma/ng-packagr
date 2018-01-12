import * as ts from 'typescript';
export declare const isComponentDecorator: (node: ts.Node) => node is ts.Decorator;
export declare const isPropertyAssignmentFor: (node: ts.Node, name: string) => node is ts.PropertyAssignment;
export declare const isTemplateUrl: (node: ts.Node) => node is ts.PropertyAssignment;
export declare const isStyleUrls: (node: ts.Node) => node is ts.PropertyAssignment;
export declare type StylesheetProcessor = (sourceFile: string, styleUrl: string, styleFilePath: string) => string | undefined | void;
export declare type TemplateProcessor = (sourceFile: string, templateUrl: string, templateFilePath: string) => string | undefined | void;
export declare type ComponentTransformer = ({}: {
    templateProcessor: TemplateProcessor;
    stylesheetProcessor: StylesheetProcessor;
    sourceFileWriter?: any;
}) => ts.TransformerFactory<ts.SourceFile>;
export declare const componentTransformer: ComponentTransformer;
