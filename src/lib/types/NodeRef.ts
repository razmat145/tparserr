
import * as ts from 'typescript';

export interface INodeRef {
    node?: ts.Node;

    type: ts.Type;
}

export type TNodeRefMap = Record<string, INodeRef>;