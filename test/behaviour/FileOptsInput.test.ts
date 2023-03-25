
import path from 'path';

import { Parserr } from '../../src/index';

describe('Parserr - FileOptsInput', () => {

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

    it('should parse the simple Line class accordingly, using an absolute path', async () => {
        const filePath = path.join(__dirname, './files/Line');

        const sutOutput = await Parserr.parse({ files: [filePath] });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the simple Line class accordingly, using a relative file path and caller dir opt', async () => {
        const filePath = './files/Line';
        const callerBaseDir = __dirname;

        const sutOutput = await Parserr.parse({
            useRelativePaths: true,
            files: [filePath],
            callerBaseDir
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the simple Line class accordingly, using an absolute dir input', async () => {
        const targetDir = path.join(__dirname, './files/');

        const sutOutput = await Parserr.parse({
            targetDir
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the simple Line class accordingly, using a relative dir input and caller dir opt', async () => {
        const targetDir = './files/';
        const callerBaseDir = __dirname;

        const sutOutput = await Parserr.parse({
            useRelativePaths: true,
            targetDir,
            callerBaseDir
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

});