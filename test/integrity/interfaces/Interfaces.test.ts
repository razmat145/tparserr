
import { describe, it, expect } from '@jest/globals';
import path from 'path';

import { Parserr } from '../../../src/index';

import UserExpectedSutOutput from './files/UserExpectedSutOutput.json';


describe('Parserr - Interface Parsing', () => {

    it('should parse the User interface', async () => {
        const filePaths = [path.join(__dirname, './files/User.ts')];

        const sutOutput = await Parserr.parse({
            files: filePaths,
            includeOnlyExports: true,
            enableDecorators: true
        });

        expect(sutOutput).toEqual(UserExpectedSutOutput);
    });

});