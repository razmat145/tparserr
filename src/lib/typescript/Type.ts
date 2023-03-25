
import _ from 'lodash';
import * as ts from 'typescript';

import Session from '../utils/Session';

import Flag from './Check';

import ITypeDescription from '../types/ITypeDescription';


class Type {

    public getTypeDescription(type: ts.Type): ITypeDescription {
        if (this.isBaseType(type)) {
            return this.getBaseTypeDescription(type);
        } else {
            return this.getClassDescription(type);
        }
    }

    private isBaseType(type: ts.Type): boolean {
        const symbol = type.getSymbol();

        return !symbol
            || Session.getTypeChecker().getFullyQualifiedName(symbol) === 'Date';
    }

    private getBaseTypeDescription(type: ts.Type): ITypeDescription {
        switch (true) {
            case Flag.isStringType(type):
                return { type: 'string' };

            case Flag.isNumberType(type):
                return { type: 'number' };

            case Flag.isBooleanType(type):
                return { type: 'boolean' };

            case this.isDateType(type):
                return { type: 'Date' };

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
                    required: !Flag.isOptionalSymbol(property)
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