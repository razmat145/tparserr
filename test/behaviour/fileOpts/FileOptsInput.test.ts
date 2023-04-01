
import _ from 'lodash';
import { describe, it, expect } from '@jest/globals';

import path from 'path';

import { Parserr } from '../../../src/index';

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
    }, {
        "name": "Point",
        "type": "object",
        "properties": {
            "name": { "type": "string", "required": false },
            "x": { "type": "number", "required": true },
            "createdAt": { "type": "Date", "required": false }
        }
    }];

    it('should parse the test files accordingly, using an absolute path', async () => {
        const filePaths = _.map(['./files/Line', './files/Point'], file => path.join(__dirname, file));

        const sutOutput = await Parserr.parse({ files: filePaths, includeOnlyExports: true });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the test files accordingly, using a relative file path and caller dir opt', async () => {
        const filePaths = ['./files/Line', './files/Point'];
        const callerBaseDir = __dirname;

        const sutOutput = await Parserr.parse({
            useRelativePaths: true,
            files: filePaths,
            callerBaseDir,
            includeOnlyExports: true
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the test files accordingly, using an absolute dir input', async () => {
        const targetDir = path.join(__dirname, './files/');

        const sutOutput = await Parserr.parse({
            targetDir, includeOnlyExports: true
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the test files accordingly, using a relative dir input and caller dir opt', async () => {
        const targetDir = './files/';
        const callerBaseDir = __dirname;

        const sutOutput = await Parserr.parse({
            useRelativePaths: true,
            targetDir,
            callerBaseDir,
            includeOnlyExports: true
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should parse the test files accordingly, using a mix of relative and absolute file paths and caller dir opt', async () => {
        const filePaths = ['./files/Line', path.join(__dirname, './files/Point')];
        const callerBaseDir = __dirname;

        const sutOutput = await Parserr.parse({
            files: filePaths,
            callerBaseDir,
            includeOnlyExports: true
        });

        expect(sutOutput).toEqual(expectedOutput);
    });

    it('should throw an error when no file path opts are received', async () => {
        await expect(Parserr.parse({}))
            .rejects
            .toThrow('Parserr requires either *files* or a *targetDir* config to function');
    });

    it('should throw an error when relative paths received with relative flag but without a callerBaseDir', async () => {
        const opts = { files: ['./files/Line'], useRelativePaths: true };

        await expect(Parserr.parse(opts))
            .rejects
            .toThrow('Parserr cannot use *useRelativePaths* relative input paths flag without a *callerBaseDir* config');
    });

    it('should throw an error when a mix of relative and absolute file paths are received without a callerBaseDir', async () => {
        const opts = { files: ['./files/Line', path.join(__dirname, './files/Point')] };

        await expect(Parserr.parse(opts))
            .rejects
            .toThrow('Parserr cannot use mixed relative and absolute *files* input paths without a *callerBaseDir* config');
    });

    it('should throw an error when a relative path targetDir is received without a callerBaseDir', async () => {
        const opts = { targetDir: './files/' };

        await expect(Parserr.parse(opts))
            .rejects
            .toThrow('Parserr cannot use a relative path *targetDir* input without a *callerBaseDir* config');
    });

});