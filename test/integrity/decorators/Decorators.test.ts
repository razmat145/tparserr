
import { describe, it, expect } from '@jest/globals';
import path from 'path';

import { Parserr } from '../../../src/index';

import ExpectedSutOutput from './files/ExpectedSutOutput.json';


describe('Parserr - Decorators Parsing', () => {

    it('should parse the class decorators accordingly', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];

        const sutOutput = await Parserr.parse({
            files: filePaths,
            includeOnlyExports: true,
            enableDecorators: true
        });

        expect(sutOutput).toEqual(ExpectedSutOutput);
    });

});