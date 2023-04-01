
import { describe, it, expect } from '@jest/globals';
import path from 'path';

import { Parserr } from '../../../src/index';

import LineExpectedSutOutput from './files/LineExpectedSutOutput.json';
import UserExpectedSutOutput from './files/UserExpectedSutOutput.json';


describe('Parserr - Decorators Parsing', () => {

    it('should parse the class and property decorators accordingly', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];

        const sutOutput = await Parserr.parse({
            files: filePaths,
            includeOnlyExports: true,
            enableDecorators: true
        });

        expect(sutOutput).toEqual(LineExpectedSutOutput);
    });

    it('should parse the user readable class and property decorators accordingly', async () => {
        const filePaths = [path.join(__dirname, './files/User')];

        const sutOutput = await Parserr.parse({
            files: filePaths,
            includeOnlyExports: true,
            enableDecorators: true
        });

        expect(sutOutput).toEqual(UserExpectedSutOutput);
    });

});