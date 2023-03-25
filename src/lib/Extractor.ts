
import _ from 'lodash';
import * as ts from 'typescript';

import Type from './typescript/Type';
import Check from './typescript/Check';

import Session from './utils/Session';

import ITypeDescription from './types/ITypeDescription';
import TTypeMap from './types/TTypeMap';


class Extractor {

    private allTypesMap: TTypeMap = {};

    private mainEntityNames: Array<string> = [];

    public getSchemaDescription(): Array<ITypeDescription> {
        this.extractTypesAndEntityNames();

        return _.map(this.mainEntityNames,
            mainEntity => _.assign(
                { name: mainEntity },
                Type.getTypeDescription(this.allTypesMap[mainEntity])
            )
        );
    }

    public extractTypesAndEntityNames() {
        const sourceFiles = Session.getProgram().getSourceFiles();

        for (const sourceFile of sourceFiles) {
            this.extractNode(sourceFile, sourceFile);
        }
    }

    private extractNode(node: ts.Node, sourceFile: ts.SourceFile) {
        if (Check.isClassKind(node)) {
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

                if (Session.getConfigItem('includeOnlyDefaultExports')) {
                    if (Check.isExportDefault(node)) {
                        this.capture(maybeSymbol, nodeType);
                    }
                } else {
                    this.capture(maybeSymbol, nodeType);
                }
            }
        }
    }

    private capture(symbol: ts.Symbol, type: ts.Type): void {
        const typeName = this.extractTypeName(symbol);

        this.allTypesMap[typeName] = type;
        this.mainEntityNames.push(typeName);
    }

    private extractTypeName(symbol: ts.Symbol): string {
        const name = Session.getTypeChecker().getFullyQualifiedName(symbol);

        return name.replace(/('|").*('|")\./, '');
    }

}

export default new Extractor();