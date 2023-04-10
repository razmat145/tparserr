
import _ from 'lodash';

import path from 'path';
import { promises as afs } from 'fs';

import { Pathrr } from 'tspathrr';

import Session from './Session';


class File {

    public async getNormalizedFilePaths(): Promise<Array<string>> {
        const files = Session.getConfigItem('files');

        if (Session.getConfigItem('useRelativePaths') || !this.areAllPathsAbsolute(files)) {
            const aboluteFilePaths = await Promise.all(
                _.map(files, file => {
                    if (path.isAbsolute(file)) {
                        return file;
                    } else {
                        return this.resolveRelativePath(file);
                    }
                })
            );

            return this.normalizeFilePaths(aboluteFilePaths);
        } else {
            return this.normalizeFilePaths(files);
        }
    }

    private async resolveRelativePath(filePath: string) {
        const callerBaseDir = Session.getConfigItem('callerBaseDir');

        if (Session.getConfigItem('enableSourceFilePathing')) {
            return (await Pathrr.resolve([filePath], callerBaseDir, true)).shift();
        } else {
            return path.join(callerBaseDir, filePath);
        }
    }

    public async extractNormalizedFilePaths(): Promise<Array<string>> {
        const targetDir = await this.getTargetDir();
        const files = await afs.readdir(targetDir);

        const filePaths = _.map(files, file => path.join(targetDir, file));

        return this.normalizeFilePaths(filePaths);
    }

    public trapInvalidConfigOpts() {
        const { files, useRelativePaths, targetDir, callerBaseDir } = Session.getConfig();

        switch (true) {
            case _.isEmpty(files) && !targetDir:
                throw new Error(`Parserr requires either *files* or a *targetDir* config to function`);

            case useRelativePaths && !callerBaseDir:
                throw new Error(`Parserr cannot use *useRelativePaths* relative input paths flag without a *callerBaseDir* config`);

            case !_.isEmpty(files) && !this.areAllPathsAbsolute(files) && !callerBaseDir:
                throw new Error(`Parserr cannot use mixed relative and absolute *files* input paths without a *callerBaseDir* config`);

            case !!targetDir && !path.isAbsolute(targetDir) && !callerBaseDir:
                throw new Error(`Parserr cannot use a relative path *targetDir* input without a *callerBaseDir* config`);

            default:
                break;
        }
    }

    private areAllPathsAbsolute(filePaths: Array<string>): boolean {
        let areAllAbsolute = true;

        for (const filePath of filePaths) {
            if (!path.isAbsolute(filePath)) {
                areAllAbsolute = false;
                break;
            }
        }

        return areAllAbsolute;
    }

    private normalizeFilePaths(filePaths: Array<string>) {
        return _.map(filePaths, filePath => path.normalize(filePath));
    }

    private async getTargetDir() {
        const targetDir = Session.getConfigItem('targetDir');

        if (Session.getConfigItem('useRelativePaths')) {
            const callerBaseDir = Session.getConfigItem('callerBaseDir');

            if (Session.getConfigItem('enableSourceFilePathing')) {
                return (await Pathrr.resolve([targetDir], callerBaseDir, true)).shift();
            } else {
                return path.join(Session.getConfigItem('callerBaseDir'), targetDir);
            }
        } else {
            return targetDir;
        }
    }

}

export default new File();