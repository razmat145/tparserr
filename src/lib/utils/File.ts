
import _ from 'lodash';

import path from 'path';
import { promises as afs } from 'fs';

import Session from './Session';


class File {

    public getNormalizedFilePaths(): Array<string> {
        const files = Session.getConfigItem('files');

        if (Session.getConfigItem('useRelativePaths') || !this.areAllPathsAbsolute(files)) {
            const aboluteFilePaths = _.map(files, file => {
                if (path.isAbsolute(file)) {
                    return file;
                } else {
                    return path.join(Session.getConfigItem('callerBaseDir'), file);
                }
            });

            return this.normalizeFilePaths(aboluteFilePaths);
        } else {
            return this.normalizeFilePaths(files);
        }
    }

    public async extractNormalizedFilePaths(): Promise<Array<string>> {
        const targetDir = this.getTargetDir();
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

    private getTargetDir() {
        const targetDir = Session.getConfigItem('targetDir');

        if (Session.getConfigItem('useRelativePaths')) {
            return path.join(Session.getConfigItem('callerBaseDir'), targetDir);
        } else {
            return targetDir;
        }
    }

}

export default new File();