
import * as ts from 'typescript';

export interface INodeRef {
    node?: ts.Node;

    type: ts.Type;

    child?: boolean;

    isInterface: boolean;
}

export type TNodeRefMap = Record<string, INodeRef>;