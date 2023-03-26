
import _ from 'lodash';

import path from 'path';

import { Parserr } from '../../../src/index';

import ExpectedSutOutput from './files/ExpectedSutOutput.json';


describe('Parserr - Array Parsing', () => {

    it('should parse the array test file accordingly', async () => {
        const filePaths = [path.join(__dirname, './files/Entity')];

        const sutOutput = await Parserr.parse({ files: filePaths });

        expect(sutOutput).toEqual(ExpectedSutOutput);
    });

});