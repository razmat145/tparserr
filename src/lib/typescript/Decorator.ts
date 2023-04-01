
import _ from 'lodash';
import * as ts from 'typescript';

import { INodeRef } from '../types/NodeRef';
import { IAnnotation } from '../types/ITypeDescription';


class Decorator {

    public extractClassDecorators(nodeRef: INodeRef): Array<IAnnotation> {
        const decorators = ts.canHaveDecorators(nodeRef.node) ? ts.getDecorators(nodeRef.node) : [];

        return !_.isEmpty(decorators)
            ? _.map(decorators, deco => {
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
            : null;
    }

    private extractArg(arg: ts.Expression) {
        switch (arg.kind) {
            case ts.SyntaxKind.TrueKeyword:
                return true;

            case ts.SyntaxKind.FalseKeyword:
                return false;

            case ts.SyntaxKind.StringLiteral:
                return (arg as ts.StringLiteral).text;

            case ts.SyntaxKind.NumericLiteral:
                return Number(arg.getText());

            default:
                throw new Error(`Decorator - Unknown or not yet implemented arg syntax kind: ${arg.kind}`);
        }
    }

}

export default new Decorator();