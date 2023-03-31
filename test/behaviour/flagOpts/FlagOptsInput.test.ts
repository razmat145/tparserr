
import { describe, it, expect } from '@jest/globals';
import path from 'path';

import { Parserr } from '../../../src/index';

describe('Parserr - FlagOptsInput', () => {

    it('should parse the test files accordingly, extracting only classes that are using export default if *includeOnlyDefaultExports* true is provided', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];
        const expectedMatch = [{
            "name": "Line",
            "type": "object",
            "properties": {
                "name": { "type": "string", "required": false },
                "x": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "required": false },
                        "value": { "type": "number", "required": true }
                    },
                    "required": true
                },
                "y": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "required": false },
                        "value": { "type": "number", "required": true }
                    },
                    "required": true
                }
            }
        }];

        const sutOutput = await Parserr.parse({ files: filePaths, includeOnlyDefaultExports: true });

        expect(sutOutput).toEqual(expectedMatch);
    });

    it('should parse the test files accordingly, extracting only all classes in file', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];
        const exportDefaultExpectedMatch = [{
            "name": "Line",
            "type": "object",
            "properties": {
                "name": { "type": "string", "required": false },
                "x": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "required": false },
                        "value": { "type": "number", "required": true }
                    },
                    "required": true
                },
                "y": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "required": false },
                        "value": { "type": "number", "required": true }
                    },
                    "required": true
                }
            }
        }, {
            "name": "Point",
            "type": "object",
            "properties": {
                "name": { "type": "string", "required": false },
                "value": { "type": "number", "required": true }
            }
        }];

        const sutOutput = await Parserr.parse({ files: filePaths });

        expect(sutOutput).toEqual(exportDefaultExpectedMatch);
    });

    it('should parse the test files accordingly, extracting only required properties of classes if *includeOnlyRequiredProperties* true is provided', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];
        const onlyRequiredPropertiesExpectedMatch = [{
            "name": "Line",
            "type": "object",
            "properties": {
                "x": {
                    "type": "object",
                    "properties": {
                        "value": { "type": "number", "required": true }
                    },
                    "required": true
                },
                "y": {
                    "type": "object",
                    "properties": {
                        "value": { "type": "number", "required": true }
                    },
                    "required": true
                }
            }
        }];

        const sutOutput = await Parserr.parse({
            files: filePaths,
            includeOnlyDefaultExports: true,
            includeOnlyRequiredProperties: true
        });

        expect(sutOutput).toEqual(onlyRequiredPropertiesExpectedMatch);
    });

    it('should parse the test files accordingly, also extracting nested classes names if *includeNestedClassNames* true is provided', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];
        const includingNesteClassNamesMatch = [{
            "name": "Line",
            "type": "object",
            "properties": {
                "name": { "type": "string", "required": false },
                "x": {
                    "type": "object",
                    "properties":
                    {
                        "name": { "type": "string", "required": false },
                        "value": { "type": "number", "required": true }
                    },
                    "name": "Point",
                    "required": true
                },
                "y": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "required": false },
                        "value": { "type": "number", "required": true }
                    },
                    "name": "Point",
                    "required": true
                }
            }
        }];

        const sutOutput = await Parserr.parse({
            files: filePaths,
            includeOnlyDefaultExports: true,
            includeNestedClassNames: true
        });
        
        expect(sutOutput).toEqual(includingNesteClassNamesMatch);
    });

});