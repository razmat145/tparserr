
import _ from 'lodash';

import path from 'path';

import { Parserr } from '../../../src/index';

import ExpectedSutOutput from './files/ExpectedSutOutput.json';


describe('Parserr - Nested Object Parsing', () => {

    it('should parse the nested test file accordingly', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];

        const sutOutput = await Parserr.parse({ files: filePaths });

        expect(sutOutput).toEqual(ExpectedSutOutput);
    });

});