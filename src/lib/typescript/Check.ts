
import * as ts from 'typescript';


class Check {

    public isClassKind(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.ClassDeclaration;
    }

    public isExportDefault(node: ts.Declaration | ts.Node): boolean {
        const modifier = ts.getCombinedModifierFlags(<ts.Declaration>node);

        return modifier === ts.ModifierFlags.ExportDefault;
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

}

export default new Check();