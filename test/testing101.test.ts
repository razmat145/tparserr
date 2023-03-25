
import path from 'path';

import { Parserr } from '../src/index';

describe('Parserr', () => {

    it('should parse the simple Line class accordingly', async () => {
        const filePath = path.join(__dirname, './testing101/Line');

        const sutOutput = await Parserr.parse({ files: [filePath] });
        const expectedOutput = [{
            "name": "Line",
            "type": "object",
            "properties": {
                "name": { "type": "string", "required": false },
                "x": { "type": "number", "required": true },
                "y": { "type": "number", "required": true },
                "createdAt": { "type": "Date", "required": false }
            }
        }];

        expect(sutOutput).toEqual(expectedOutput);
    });

});