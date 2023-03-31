
import { describe, it, expect, jest } from '@jest/globals';
import path from 'path';

import { Parserr } from '../../../src/index';

describe('Parserr - Failure', () => {

    const mockLogger = {
        debug: (message: string) => message,
        info: (message: string) => message,
        warn: (message: string) => message,
        error: (message: string) => message
    };

    it('should throw an error if the file to parse contains invalid typescript', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];

        await expect(Parserr.parse({ files: filePaths, logger: mockLogger }))
            .rejects
            .toThrow('Typescript Program failed to compile with the provided files');
    });

    it('should use the provided logger to log the errors', async () => {
        const filePaths = [path.join(__dirname, './files/Line')];

        const loggerErrorSpy = jest.spyOn(mockLogger, 'error');

        await expect(Parserr.parse({ files: filePaths, logger: mockLogger }))
            .rejects
            .toThrow('Typescript Program failed to compile with the provided files');

        expect(loggerErrorSpy).toHaveBeenCalled();
    });

});