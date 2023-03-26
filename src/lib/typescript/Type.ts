
import _ from 'lodash';
import * as ts from 'typescript';

import Session from '../utils/Session';

import Check from './Check';

import ITypeDescription from '../types/ITypeDescription';


class Type {

    public getTypeDescription(type: ts.Type): ITypeDescription {
        switch (true) {
            case this.isBaseType(type):
                return this.getBaseTypeDescription(type);

            default:
                return this.getClassDescription(type);
        }
    }

    private isBaseType(type: ts.Type): boolean {
        const symbol = type.getSymbol();

        return (!symbol
            || Session.getTypeChecker().getFullyQualifiedName(symbol) === 'Date')
            || Check.isArrayType(type);
    }

    private getBaseTypeDescription(type: ts.Type): ITypeDescription {
        switch (true) {
            case Check.isStringType(type):
                return { type: 'string' };

            case Check.isNumberType(type):
                return { type: 'number' };

            case Check.isBooleanType(type):
                return { type: 'boolean' };

            case this.isDateType(type):
                return { type: 'Date' };

            case Check.isArrayType(type):
                return this.getArrayDescription(type);

            default:
                throw new Error(`Type ${this.getTypeString(type)} unrecognised or not yet implemented`);
        }
    }

    private getPropertyDescription(properties: Array<ts.Symbol>): Record<string, ITypeDescription> {
        const propertyDescriptions = {};

        for (const property of properties) {
            const propertyType = Session.getTypeChecker().getTypeOfSymbol(property);
            const propertyDescription = this.getTypeDescription(propertyType)

            _.assign(propertyDescriptions, {
                [property.getName()]: {
                    ...propertyDescription,
                    required: !Check.isOptionalSymbol(property)
                }
            });
        }

        return propertyDescriptions;
    }

    private getClassDescription(type: ts.Type): ITypeDescription {
        const properties = Session.getTypeChecker().getPropertiesOfType(type);
        const propertyDescription = this.getPropertyDescription(properties);

        return {
            type: 'object',
            properties: propertyDescription
        };
    }

    private getArrayDescription(type: ts.Type): ITypeDescription {
        const indexType = Session.getTypeChecker().getIndexTypeOfType(type, ts.IndexKind.Number);

        return {
            type: 'array',
            items: this.getTypeDescription(indexType)
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

}

export default new Type();