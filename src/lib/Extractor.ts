
import _ from 'lodash';
import * as ts from 'typescript';

import Type from './typescript/Type';
import Check from './typescript/Check';

import Session from './utils/Session';

import { ITypeDescription } from './types/ITypeDescription';
import { TNodeRefMap } from './types/NodeRef';


class Extractor {

    private allNodeRefsMap: TNodeRefMap = {};

    private mainEntityNames: Array<string> = [];

    public getSchemaDescription(): Array<ITypeDescription> {
        this.extractTypesAndEntityNames();

        return _.map(this.mainEntityNames,
            mainEntity => _.assign(
                { name: mainEntity },
                Type.getTypeDescription(this.allNodeRefsMap[mainEntity])
            )
        );
    }

    private extractTypesAndEntityNames() {
        const sourceFiles = Session.getProgram().getSourceFiles();

        for (const sourceFile of sourceFiles) {
            this.extractNode(sourceFile, sourceFile);
        }
    }

    private extractNode(node: ts.Node, sourceFile: ts.SourceFile) {
        if (Check.isClassOrInterfaceKind(node)) {
            this.extractClass(node, sourceFile);
        } else {
            ts.forEachChild(node, (child) => this.extractNode(child, sourceFile));
        }
    }

    private extractClass(node: ts.Node, sourceFile: ts.SourceFile) {
        const nodeType = Session.getTypeChecker().getTypeAtLocation(node);

        const maybeSymbol = nodeType.getSymbol();
        if (maybeSymbol) {

            const isNodeOfInterest = !sourceFile.isDeclarationFile && !sourceFile.hasNoDefaultLib;
            if (isNodeOfInterest) {

                if (Session.getConfigItem('includeOnlyExports')) {
                    if (Check.isExport(node)) {
                        this.capture(maybeSymbol, node, nodeType);
                    }
                } else {
                    this.capture(maybeSymbol, node, nodeType);
                }
            }
        }
    }

    private capture(symbol: ts.Symbol, node: ts.Node, type: ts.Type): void {
        const typeName = Type.extractTypeName(symbol);

        this.allNodeRefsMap[typeName] = { node, type };
        this.mainEntityNames.push(typeName);
    }

    public clean() {
        this.allNodeRefsMap = {};
        this.mainEntityNames = [];
    }

}

export default new Extractor();