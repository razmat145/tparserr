
import _ from 'lodash';
import * as ts from 'typescript';

import { INodeRef } from '../types/NodeRef';
import { IAnnotation } from '../types/ITypeDescription';


class Decorator {

    public extractClassDecorators(nodeRef: INodeRef): Array<IAnnotation> {
        if (nodeRef.isInterface) { return; }

        const decorators = ts.canHaveDecorators(nodeRef.node) ? ts.getDecorators(nodeRef.node) : [];

        return this.extractDecoratorAnnotations(decorators);
    }

    public extractPropertyDecorators(propSymbol: ts.Symbol): Array<IAnnotation> {

        const propDeclarations = propSymbol.getDeclarations();
        const maybeNode = !_.isEmpty(propDeclarations) ? propDeclarations[0] : null;

        if (maybeNode) {
            const decorators = ts.canHaveDecorators(maybeNode) ? ts.getDecorators(maybeNode) : [];

            return this.extractDecoratorAnnotations(decorators);
        }

        return null;
    }

    private extractDecoratorAnnotations(decorators: Readonly<Array<ts.Decorator>>): Array<IAnnotation> {
        if (_.isEmpty(decorators)) return;

        return _(decorators)
            .map(deco => {
                const expression = deco.expression as ts.CallExpression;

                const name = expression?.expression
                    ? expression?.expression.getText()
                    : null;

                const hasArguments = !_.isEmpty(expression?.arguments);
                const args = hasArguments
                    ? _.map(expression?.arguments, arg => this.extractArg(arg))
                    : null;

                return name
                    ? !_.isEmpty(args)
                        ? { name, args }
                        : { name }
                    : null;
            })
            .compact()
            .value();
    }

    private extractArg(arg: ts.Expression) {
        switch (arg.kind) {
            case ts.SyntaxKind.TrueKeyword:
                return true;

            case ts.SyntaxKind.FalseKeyword:
                return false;

            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return (arg as ts.StringLiteral).text;

            case ts.SyntaxKind.NumericLiteral:
                return Number(arg.getText());

            case ts.SyntaxKind.ArrayLiteralExpression:
                const arrayArg = arg as ts.ArrayLiteralExpression;
                return _.map(arrayArg.elements, el => this.extractArg(el));

            default:
                throw new Error(`Decorator - Unknown or not yet implemented arg syntax kind: ${arg.kind}`);
        }
    }

}

export default new Decorator();