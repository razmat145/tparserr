
import _ from 'lodash';
import * as ts from 'typescript';

import Check from './Check';
import Decorator from './Decorator';

import Session from '../utils/Session';

import { INodeRef } from '../types/NodeRef';
import { ITypeDescription } from '../types/ITypeDescription';


class Type {

    public getTypeDescription(nodeRef: INodeRef): ITypeDescription {
        switch (true) {
            case this.isBaseType(nodeRef):
                return this.getBaseTypeDescription(nodeRef);

            default:
                return this.getClassDescription(nodeRef);
        }
    }

    private isBaseType(nodeRef: INodeRef): boolean {
        const symbol = nodeRef.type.getSymbol();

        return (!symbol
            || Session.getTypeChecker().getFullyQualifiedName(symbol) === 'Date')
            || Check.isArrayType(nodeRef.type);
    }

    private getBaseTypeDescription(nodeRef: INodeRef): ITypeDescription {
        switch (true) {
            case Check.isStringType(nodeRef.type):
                return { type: 'string' };

            case Check.isNumberType(nodeRef.type):
                return { type: 'number' };

            case Check.isBooleanType(nodeRef.type):
                return { type: 'boolean' };

            case this.isDateType(nodeRef.type):
                return { type: 'Date' };

            case Check.isArrayType(nodeRef.type):
                return this.getArrayDescription(nodeRef.type);

            default:
                throw new Error(`Type ${this.getTypeString(nodeRef.type)} unrecognised or not yet implemented`);
        }
    }

    private getPropertyDescription(properties: Array<ts.Symbol>): Record<string, ITypeDescription> {
        const propertyDescriptions = {};

        for (const property of properties) {

            const propertyType = Session.getTypeChecker().getTypeOfSymbol(property);
            const propertyDescription = this.getTypeDescription({ type: propertyType });

            const includeOnlyRequiredProperties = Session.getConfigItem('includeOnlyRequiredProperties');
            const isPropertyOptional = Check.isOptionalSymbol(property);

            if (includeOnlyRequiredProperties && isPropertyOptional) {
                continue;
            }

            const propertyTypeDescription = {
                ...propertyDescription,
                required: !isPropertyOptional
            };

            if (Session.getConfigItem('enableDecorators')) {
                const decoratorDescription = Decorator.extractPropertyDecorators(property);

                !_.isEmpty(decoratorDescription) && _.assign(propertyTypeDescription, { annotations: decoratorDescription });
            }

            _.assign(propertyDescriptions, {
                [property.getName()]: propertyTypeDescription
            });
        }

        return propertyDescriptions;
    }

    private getClassDescription(nodeRef: INodeRef): ITypeDescription {

        const properties = Session.getTypeChecker().getPropertiesOfType(nodeRef.type);
        const propertyDescription = this.getPropertyDescription(properties);

        const classDescription = {
            type: 'object',
            properties: propertyDescription
        };

        if (Session.getConfigItem('enableDecorators')) {
            const decoratorDescription = Decorator.extractClassDecorators(nodeRef);

            !_.isEmpty(decoratorDescription) && _.assign(classDescription, { annotations: decoratorDescription });
        }
        if (Session.getConfigItem('includeNestedClassNames')) {
            const name = this.extractTypeName(nodeRef.type.getSymbol());

            name && _.assign(classDescription, { name });
        }

        return classDescription;
    }

    private getArrayDescription(type: ts.Type): ITypeDescription {
        const indexType = Session.getTypeChecker().getIndexTypeOfType(type, ts.IndexKind.Number);

        return {
            type: 'array',
            items: this.getTypeDescription({ type: indexType })
        };
    }

    private isDateType(type: ts.Type): boolean {
        return this.getTypeString(type) === 'Date';
    }

    private getTypeString(type: ts.Type): string {
        return Session.getTypeChecker()
            .typeToString(
                type,
                undefined,
                ts.TypeFormatFlags.UseFullyQualifiedType
            );
    }

    public extractTypeName(symbol: ts.Symbol): string {
        const name = Session.getTypeChecker().getFullyQualifiedName(symbol);

        return name.replace(/('|").*('|")\./, '');
    }

}

export default new Type();