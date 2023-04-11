
import * as ts from 'typescript';

import Session from '../utils/Session';


class Check {

    public isClassOrInterfaceKind(node: ts.Node): boolean {
        return node?.kind === ts.SyntaxKind.ClassDeclaration ||
            this.isInterface(node)
    }

    public isInterface(node: ts.Node): boolean {
        return node?.kind === ts.SyntaxKind.InterfaceDeclaration;
    }

    public isExport(node: ts.Declaration | ts.Node): boolean {
        const modifier = ts.getCombinedModifierFlags(<ts.Declaration>node);

        return !!(modifier & ts.ModifierFlags.Export)
            || !!(modifier & ts.ModifierFlags.ExportDefault);
    }

    public isOptionalSymbol(symbol: ts.Symbol): boolean {
        return !!(symbol.flags & ts.SymbolFlags.Optional);
    }

    public isStringType(type: ts.Type): boolean {
        return !!(type.flags & ts.TypeFlags.String);
    }

    public isNumberType(type: ts.Type): boolean {
        return !!(type.flags & ts.TypeFlags.Number);
    }

    public isBooleanType(type: ts.Type): boolean {
        return !!(type.flags & ts.TypeFlags.Boolean);
    }

    public isObjectType(type: ts.Type): boolean {
        return !!(type.flags & ts.TypeFlags.Object)
            &&
            !!((<ts.ObjectType>type).objectFlags & ts.ObjectFlags.ClassOrInterface)
    }

    public isArrayType(type: ts.Type): boolean {
        const isObject = this.isObjectType(type);
        const hasNumberedIndexType = !!Session.getTypeChecker().getIndexTypeOfType(type, ts.IndexKind.Number);

        return !isObject && hasNumberedIndexType;
    }

}

export default new Check();